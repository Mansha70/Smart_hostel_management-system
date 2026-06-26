import { useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, MoreHorizontal, Eye, UserPlus, Trash2, ChevronLeft, ChevronRight, MapPin, Loader2 } from 'lucide-react';

import { toast } from 'sonner';
import { api } from '@/lib/api';

type BackendComplaint = {
  _id?: string;
  id?: string;
  title?: string;
  description?: string;
  category?: string;
  status?: string;
  roomNumber?: string;
  room_number?: string;
  student?: { _id?: string; id?: string; name?: string; email?: string } | string;
  assignedStaff?: {
    _id?: string;
    id?: string;
    name?: string;
    department?: string;
    email?: string;
    full_name?: string;
  } | null;
  mediaUrls?: string[];
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
};

type BackendStaff = {
  _id?: string;
  id?: string;
  email?: string;
  name?: string;
  full_name?: string;
  role?: 'student' | 'staff' | 'admin' | string;
  roomNumber?: string;
  created_at?: string | number;
};

type ComplaintStatus = 'pending' | 'assigned' | 'in_progress' | 'resolved' | 'rejected';

type ComplaintPriority = 'low' | 'medium' | 'high';

type ComplaintCategoryValue = 'maintenance' | 'cleanliness' | 'security' | 'mess' | 'other' | string;

type Complaint = {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategoryValue;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  room_number: string;
  hostel_block: string;
  student_id: string;
  images: string[];
  created_at: string;
  updated_at: string;
  assigned_staff?: {
    id: string;
    email: string;
    full_name: string;
    role: 'staff' | string;
    room_number: string;
    hostel_block: string;
    phone_number?: string;
    avatar_url?: string;
    created_at: string;
  };
};

const COMPLAINT_STATUSES: Array<{ value: ComplaintStatus; label: string }> = [
  { value: 'pending', label: 'Pending' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'rejected', label: 'Rejected' },
];

const COMPLAINT_CATEGORIES: Array<{ value: ComplaintCategoryValue; label: string }> = [
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'cleanliness', label: 'Cleanliness' },
  { value: 'security', label: 'Security' },
  { value: 'mess', label: 'Mess' },
  { value: 'other', label: 'Other' },
];

const COMPLAINT_PRIORITIES: Array<{ value: ComplaintPriority; label: string }> = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const formatDistanceToNow = (date: Date) => {
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
};

const format = (date: Date) => date.toLocaleString();

const PriorityBadge = ({ priority }: { priority: ComplaintPriority }) => (
  <Badge variant="outline">{priority.replace(/_/g, ' ')}</Badge>
);

const StatusBadge = ({ status }: { status: ComplaintStatus }) => (
  <Badge variant="secondary">{status.replace(/_/g, ' ')}</Badge>
);

function toClientComplaint(c: unknown): Complaint {
  const obj = (c ?? {}) as Record<string, unknown>;

  const id =
    (obj as { _id?: string; id?: string })._id ??
    (obj as { _id?: string; id?: string }).id ??
    '';

  const createdRaw = obj['createdAt'] ?? obj['created_at'];
  const createdIso = createdRaw ? new Date(String(createdRaw)).toISOString() : new Date().toISOString();

  const assignedRaw = obj['assignedStaff'] ?? obj['assigned_staff'] ?? null;
  const assignedRawObj = assignedRaw as Record<string, unknown> | null;

  const assignedFullName = assignedRawObj?.full_name ?? assignedRawObj?.name ?? (assignedRawObj?.email ? String(assignedRawObj.email) : undefined);

  const normalizeStatus = (statusRaw: unknown): ComplaintStatus => {
    const s = String(statusRaw ?? 'Pending');
    const lowered = s.trim().toLowerCase();
    if (lowered.includes('pending')) return 'pending';
    if (lowered.includes('assigned')) return 'assigned';
    if (lowered.includes('in progress')) return 'in_progress';
    if (lowered.includes('resolved')) return 'resolved';
    if (lowered.includes('closed')) return 'resolved';
    if (lowered.includes('rejected')) return 'rejected';
    return 'pending';
  };

  const cObj = c as BackendComplaint | undefined;
  const status = normalizeStatus(cObj?.status);

  const priority: Complaint['priority'] = 'medium';

  const updatedRaw = obj['updatedAt'] ?? obj['updated_at'];
  const updatedIso = updatedRaw ? new Date(String(updatedRaw)).toISOString() : createdIso;

  return {
    id,
    title: (obj['title'] ?? '') as string,
    description: (obj['description'] ?? '') as string,
    category: ((obj['category'] ?? 'other') as unknown) as ComplaintCategoryValue,

    status,
    priority,
    room_number: (obj['roomNumber'] ?? obj['room_number'] ?? '') as string,
    hostel_block: '',
    student_id: typeof obj['student'] === 'string' ? (obj['student'] as string) : '',
    images: (obj['mediaUrls'] ?? []) as string[],
    created_at: createdIso,
    updated_at: updatedIso,
    assigned_staff: assignedRaw
      ? {
          id: (assignedRaw as any)?._id ?? (assignedRaw as any)?.id ?? '',
          email: (assignedRaw as any)?.email ?? '',
          full_name: assignedFullName ? String(assignedFullName) : 'Staff',
          role: 'staff',
          room_number: '',
          hostel_block: '',
          phone_number: undefined,
          avatar_url: undefined,
          created_at: new Date().toISOString(),
        }
      : undefined,
  };
}

export function ManageComplaintsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Complaint['status']>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | (typeof COMPLAINT_CATEGORIES)[number]['value']>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | Complaint['priority']>('all');

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [selectedStaff, setSelectedStaff] = useState('');
  const [assignNotes, setAssignNotes] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [staff, setStaff] = useState<
    Array<{
      id: string;
      email: string;
      full_name: string;
      role: string;
      room_number?: string;
      hostel_block?: string;
      phone_number?: string;
      avatar_url?: string;
      created_at?: string;
    }>
  >([]);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setIsFetching(true);

        const res = await api.get<{ success: true; complaints: BackendComplaint[] }>('/complaints/getAll');
        if (!mounted) return;
        setComplaints((res?.complaints ?? []).map(toClientComplaint));

        const staffRes = await api.get<{ success: true; staff: BackendStaff[] }>('/staff/getAll');
        const staffList = (staffRes?.staff ?? []).map((s: BackendStaff) => ({
          id: String(s.id ?? s._id ?? ''),
          email: s.email ?? '',
          full_name: s.full_name ?? s.name ?? 'Staff',
          role: 'staff',
          room_number: s.roomNumber,
          hostel_block: undefined,
          phone_number: undefined,
          avatar_url: undefined,
          created_at: new Date(s.created_at ?? Date.now()).toISOString(),
        }));

        setStaff(staffList);
      } catch (e) {
        if (!mounted) return;
        toast.error(e instanceof Error ? e.message : 'Failed to fetch complaints');
      } finally {
        if (mounted) setIsFetching(false);
      }
    }

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const matchesSearch = complaint.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
      const matchesCategory =
        categoryFilter === 'all' || complaint.category === (categoryFilter as unknown as Complaint['category']);
      const matchesPriority = priorityFilter === 'all' || complaint.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
    });
  }, [complaints, categoryFilter, priorityFilter, searchQuery, statusFilter]);

  const refresh = async () => {
    const res = await api.get<{ success: true; complaints: BackendComplaint[] }>('/complaints/getAll');
    setComplaints((res?.complaints ?? []).map(toClientComplaint));
  };

  const handleAssign = async () => {
    if (!selectedComplaint) return;
    if (!selectedStaff) {
      toast.error('Please select a staff member');
      return;
    }

    try {
      setIsLoading(true);
      await api.patch(`/complaints/${selectedComplaint.id}/assign`, {
        staffId: selectedStaff,
        notes: assignNotes,
      });

      toast.success('Complaint assigned successfully!');
      setIsAssignModalOpen(false);
      setSelectedComplaint(null);
      setSelectedStaff('');
      setAssignNotes('');
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to assign complaint');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    toast.error('Delete is not available');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Manage Complaints</h1>
        <p className="text-muted-foreground">View, assign, and manage all complaints.</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search complaints..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as Complaint['status'] | 'all')}>
              <SelectTrigger className="w-32">
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

            <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as typeof categoryFilter)}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {COMPLAINT_CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as typeof priorityFilter)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                {COMPLAINT_PRIORITIES.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          {isFetching ? 'Loading complaints...' : `${filteredComplaints.length} complaints found`}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Complaint</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Staff</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredComplaints.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{complaint.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {complaint.created_at ? formatDistanceToNow(new Date(complaint.created_at)) : ''}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline">
                        {complaint.category ? String(complaint.category).replace(/_/g, ' ') : 'Other'}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        {complaint.room_number ? `Room ${complaint.room_number}` : '—'}
                      </div>
                    </TableCell>

                    <TableCell>
                      <PriorityBadge priority={complaint.priority} />
                    </TableCell>

                    <TableCell>
                      <StatusBadge status={complaint.status} />
                    </TableCell>

                    <TableCell>
                      {complaint.assigned_staff ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {complaint.assigned_staff.full_name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{complaint.assigned_staff.full_name}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Unassigned</span>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedComplaint(complaint);
                              setIsViewModalOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />View Details
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedComplaint(complaint);
                              setIsAssignModalOpen(true);
                            }}
                          >
                            <UserPlus className="h-4 w-4 mr-2" />Assign Staff
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedComplaint(complaint);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing 1-{filteredComplaints.length} of {filteredComplaints.length} complaints
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">Page 1 of 1</span>
          <Button variant="outline" size="icon" disabled>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Complaint Details</DialogTitle>
          </DialogHeader>
          {selectedComplaint && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2">
                <StatusBadge status={selectedComplaint.status} />
                <PriorityBadge priority={selectedComplaint.priority} />
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Title</Label>
                <p className="font-medium">{selectedComplaint.title}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Description</Label>
                <p className="text-sm">{selectedComplaint.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Category</Label>
                  <p className="text-sm">{selectedComplaint.category}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Location</Label>
                  <p className="text-sm">{selectedComplaint.room_number ? `Room ${selectedComplaint.room_number}` : '—'}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Created</Label>
                <p className="text-sm">{selectedComplaint.created_at ? format(new Date(selectedComplaint.created_at)) : ''}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Staff</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {selectedComplaint && (
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="font-medium">{selectedComplaint.title}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedComplaint.room_number ? `Room ${selectedComplaint.room_number}` : ''}
                </p>
              </div>
            )}

            {staff.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                Staff list is not available from backend. Assigned staff display works, but assigning requires an endpoint to list staff.
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Select Staff Member</Label>
                <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {staff.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea
                placeholder="Add any notes..."
                value={assignNotes}
                onChange={(e) => setAssignNotes(e.target.value)}
                className="min-h-20"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAssignModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAssign} disabled={isLoading || staff.length === 0}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />Assigning...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />Assign
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Complaint</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this complaint? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

