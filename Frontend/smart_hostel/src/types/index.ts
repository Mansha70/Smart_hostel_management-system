export type UserRole = 'student' | 'staff' | 'admin';

export type ComplaintStatus = 'pending' | 'assigned' | 'in_progress' | 'resolved' | 'rejected';

export type ComplaintPriority = 'low' | 'medium' | 'high' | 'urgent';

export type ComplaintCategory =
  | 'electrical'
  | 'plumbing'
  | 'internet'
  | 'furniture'
  | 'cleanliness'
  | 'mess_food'
  | 'security'
  | 'other';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  room_number?: string;
  hostel_block?: string;
  phone_number?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  room_number: string;
  hostel_block: string;
  student_id: string;
  assigned_staff_id?: string;
  assigned_staff?: User;
  images: string[];
  resolution_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ComplaintTimeline {
  id: string;
  complaint_id: string;
  status: ComplaintStatus;
  notes?: string;
  created_by: string;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  scheduled_at?: string;
  created_by: string;
  created_at: string;
}

export interface Feedback {
  id: string;
  complaint_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'complaint' | 'announcement' | 'assignment' | 'system';
  read: boolean;
  created_at: string;
}

export const COMPLAINT_CATEGORIES: { value: ComplaintCategory; label: string }[] = [
  { value: 'electrical', label: 'Electrical' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'internet', label: 'Internet' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'cleanliness', label: 'Cleanliness' },
  { value: 'mess_food', label: 'Mess Food' },
  { value: 'security', label: 'Security' },
  { value: 'other', label: 'Other' },
];

export const COMPLAINT_PRIORITIES: { value: ComplaintPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export const COMPLAINT_STATUSES: { value: ComplaintStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'rejected', label: 'Rejected' },
];

export const HOSTEL_BLOCKS = ['A', 'B', 'C', 'D', 'E'];
