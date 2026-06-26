import { useEffect, useMemo, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ComplaintCard } from '@/components/complaints/ComplaintCard';
import { Complaint, COMPLAINT_CATEGORIES, COMPLAINT_STATUSES } from '@/types';
import { Search, Grid3X3, List } from 'lucide-react';

import { api } from '@/lib/api';

type SortBy = 'newest' | 'oldest' | 'priority';

type BackendComplaint = {
  _id?: string;
  title?: string;
  description?: string;
  category?: Complaint['category'];
  status?: Complaint['status'];
  priority?: Complaint['priority'];
  roomNumber?: string;
  room_number?: string;
  hostel_block?: string;
  hostelBlock?: string;
  student?: { _id?: string } | string;
  assignedStaff?: {
    _id: string;
    email: string;
    name: string;
    role: NonNullable<Complaint['assigned_staff']>['role'];
  };
  assigned_staff?: Complaint['assigned_staff'];
  mediaUrls?: string[];
  images?: string[];
  resolution_notes?: string;
  createdAt?: string;
  updatedAt?: string;
};

const mockComplaints: Complaint[] = [

  {
    id: '1',
    title: 'AC not working in room',
    description: 'The air conditioner has stopped working completely.',
    category: 'electrical',
    status: 'in_progress',
    priority: 'high',
    room_number: 'A101',
    hostel_block: 'A',
    student_id: '1',
    images: [
      'https://images.pexels.com/photos/257927/pexels-photo-257927.jpeg?auto=compress&cs=tinysrgb&w=400',
    ],
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    title: 'Water leakage in bathroom',
    description: 'There is a constant water leak from the ceiling.',
    category: 'plumbing',
    status: 'pending',
    priority: 'medium',
    room_number: 'A101',
    hostel_block: 'A',
    student_id: '1',
    images: [],
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '3',
    title: 'WiFi not connecting',
    description: 'Unable to connect to the hostel WiFi.',
    category: 'internet',
    status: 'resolved',
    priority: 'medium',
    room_number: 'A101',
    hostel_block: 'A',
    student_id: '1',
    images: [],
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

const sortOptions: { value: SortBy; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'priority', label: 'Priority' },
];

function mapBackendComplaint(c: BackendComplaint): Complaint {
  const id = String(c._id || '');
  const priority = c.priority || 'medium';
  const status = c.status || 'pending';
  const category = c.category || 'other';

  const room_number = (c.roomNumber || c.room_number || '') as string;
  const hostel_block = (c.hostel_block || c.hostelBlock || '') as string;

  const student_id =
    typeof c.student === 'string'
      ? c.student
      : String((c.student && c.student._id) || '');

  const images = (c.mediaUrls || c.images || []).map((x) => String(x));

  return {
    id,
    title: String(c.title || ''),
    description: String(c.description || ''),
    category,
    status,
    priority,
    room_number,
    hostel_block,
    student_id,
    assigned_staff: c.assignedStaff
      ? {
          id: c.assignedStaff._id,
          email: c.assignedStaff.email,
          full_name: c.assignedStaff.name,
          role: c.assignedStaff.role as NonNullable<Complaint['assigned_staff']>['role'],
          created_at: new Date().toISOString(),
        }
      : c.assigned_staff,
    images,
    resolution_notes: c.resolution_notes,
    created_at: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString(),
    updated_at: c.updatedAt ? new Date(c.updatedAt).toISOString() : new Date().toISOString(),
  };
}

export function MyComplaintsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(false);

  const [complaints, setComplaints] = useState<Complaint[]>([]);


  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortBy>('newest');

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await api.get<{ success: boolean; complaints: BackendComplaint[] }>('/complaints/my');
        if (!res?.complaints) return;

        const mapped = res.complaints.map(mapBackendComplaint);
        setComplaints(mapped.length ? mapped : mockComplaints);
      } catch {
        // keep mock data
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const filteredComplaints = useMemo(() => {
    const base = complaints.filter((complaint) => {
      const matchesSearch = complaint.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || complaint.status === statusFilter;
      const matchesCategory =
        categoryFilter === 'all' || complaint.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });

    const byPriority: Record<Complaint['priority'], number> = {
      urgent: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

    const sorted = [...base];
    if (sortBy === 'newest') {
      sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'oldest') {
      sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else {
      sorted.sort((a, b) => byPriority[b.priority] - byPriority[a.priority]);
    }

    return sorted;
  }, [complaints, searchQuery, statusFilter, categoryFilter, sortBy]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Complaints</h1>
        <p className="text-muted-foreground">View and manage all your submitted complaints.</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search complaints..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {COMPLAINT_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {COMPLAINT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortBy)}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>


            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-sm text-muted-foreground">Loading complaints...</div>
        ) : (
          <div>
            {viewMode === 'grid' ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredComplaints.map((complaint) => (
                  <ComplaintCard key={complaint.id} complaint={complaint} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredComplaints.map((complaint) => (
                  <ComplaintCard key={complaint.id} complaint={complaint} />
                ))}
              </div>
            )}

            {filteredComplaints.length === 0 && (
              <div className="text-sm text-muted-foreground">No complaints found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


