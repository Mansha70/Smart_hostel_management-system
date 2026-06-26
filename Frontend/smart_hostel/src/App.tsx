import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/sonner';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

// Public Pages
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';

// Student Pages
import { StudentDashboard } from '@/pages/student/StudentDashboard';
import { CreateComplaintPage } from '@/pages/student/CreateComplaintPage';
import { MyComplaintsPage } from '@/pages/student/MyComplaintsPage';
import { ComplaintDetailPage } from '@/pages/student/ComplaintDetailPage';
import { FeedbackPage } from '@/pages/student/FeedbackPage';
import { ProfilePage } from '@/pages/student/ProfilePage';

// Staff Pages
import { AssignedComplaintsPage } from '@/pages/staff/AssignedComplaintsPage';

// Admin Pages
import { ManageComplaintsPage } from '@/pages/admin/ManageComplaintsPage';
import { ManageStudentsPage } from '@/pages/admin/ManageStudentsPage';
import { ManageStaffPage } from '@/pages/admin/ManageStaffPage';
import { AnnouncementsPage } from '@/pages/admin/AnnouncementsPage';
import { AnalyticsPage } from '@/pages/admin/AnalyticsPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Route>

            {/* Student Routes */}
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['student', 'staff', 'admin']}><StudentDashboard /></ProtectedRoute>} />
            <Route path="/complaints/create" element={<ProtectedRoute allowedRoles={['student']}><CreateComplaintPage /></ProtectedRoute>} />
            <Route path="/complaints" element={<ProtectedRoute allowedRoles={['student']}><MyComplaintsPage /></ProtectedRoute>} />
            <Route path="/complaints/:id" element={<ProtectedRoute allowedRoles={['student']}><ComplaintDetailPage /></ProtectedRoute>} />
            <Route path="/feedback" element={<ProtectedRoute allowedRoles={['student']}><FeedbackPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute allowedRoles={['student', 'staff']}><ProfilePage /></ProtectedRoute>} />

            {/* Staff Routes */}
            <Route path="/assigned" element={<ProtectedRoute allowedRoles={['staff']}><AssignedComplaintsPage /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin/complaints" element={<ProtectedRoute allowedRoles={['admin']}><ManageComplaintsPage /></ProtectedRoute>} />
            <Route path="/admin/students" element={<ProtectedRoute allowedRoles={['admin']}><ManageStudentsPage /></ProtectedRoute>} />
            <Route path="/admin/staff" element={<ProtectedRoute allowedRoles={['admin']}><ManageStaffPage /></ProtectedRoute>} />
            <Route path="/admin/announcements" element={<ProtectedRoute allowedRoles={['admin']}><AnnouncementsPage /></ProtectedRoute>} />
            <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin']}><AnalyticsPage /></ProtectedRoute>} />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        <Toaster position="top-right" />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
