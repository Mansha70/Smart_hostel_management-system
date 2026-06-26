import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User, UserRole } from '@/types';
import { api } from '@/lib/api';
import { clearStoredUser, getStoredUser, clearToken, setStoredUser, setToken } from '@/lib/authStorage';
import { mapBackendUserToFrontend } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  full_name: string;
  email: string;
  password: string;
  role: UserRole;
  room_number?: string;
  hostel_block?: string;
  phone_number?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapHostelBlockToDepartment(hostelBlock?: string): string | undefined {
  // Backend User.department enum values:
  // "Electricity", "water", "WiFi", "Mess", "Cleaning", "Furniture"
  // UI uses single letters like "E", "W", "I", etc.
  if (!hostelBlock) return undefined;
  const v = hostelBlock.trim().toLowerCase();

  const map: Record<string, string> = {
    e: 'Electricity',
    w: 'water',
    wifi: 'WiFi',
    i: 'WiFi',
    m: 'Mess',
    c: 'Cleaning',
    f: 'Furniture',
  };

  return map[v] || undefined;
}

export function AuthProvider({ children }: { children: ReactNode }) {

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredUser<User>();
    if (stored) setUser(stored);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.post<{ token: string; user: { id: string; name: string; email: string; role: UserRole } }>(
        '/login',
        { email, password }
      );

      setToken(res.token);
      const mappedUser: User = {
        id: res.user.id,
        email: res.user.email,
        full_name: res.user.name,
        role: res.user.role,
        created_at: new Date().toISOString(),
      };

      setStoredUser(mappedUser);
      setUser(mappedUser);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const res = await api.post<{ success: boolean; message: string; user?: import('@/lib/auth').UserFromBackend }>('/register', {
        name: data.full_name,
        email: data.email,
        password: data.password,
        role: data.role,
        roomNumber: data.room_number,
        // backend model expects `department` enum like: Electricity, water, WiFi, Mess...
        // current UI provides `hostel_block` like "A", "E" etc, so map it.
        department: mapHostelBlockToDepartment(data.hostel_block),
      });



      if (res.user) {

        const mappedUser = mapBackendUserToFrontend(res.user);
        setStoredUser(mappedUser);
        setUser(mappedUser);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearToken();
    clearStoredUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}


