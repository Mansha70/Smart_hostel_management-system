import type { User, UserRole } from '@/types';

export type LoginResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
};

export type RegisterResponse = {
  success: boolean;
  message?: string;
  user?: {
    _id?: string;
    id?: string;
    email: string;
    name: string;
    role: UserRole;
    department?: string;
    roomNumber?: string;
  };
};

export type UserFromBackend = {
  _id?: string;
  id?: string;
  name?: string;
  email: string;
  role: UserRole;
  department?: string;
  roomNumber?: string;
};

export function mapBackendUserToFrontend(u: UserFromBackend): User {
  return {
    id: u._id || u.id || 'unknown',
    email: u.email,
    full_name: u.name || u.email,
    role: u.role,
    room_number: u.roomNumber,
    hostel_block: u.department,
    created_at: new Date().toISOString(),
  };
}

