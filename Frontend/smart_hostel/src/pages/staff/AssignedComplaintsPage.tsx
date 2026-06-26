import { useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Complaint, ComplaintStatus } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Search, MapPin, Calendar, Upload, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StatusBadge, PriorityBadge } from '@/components/complaints/StatusBadge';
import { COMPLAINT_STATUSES } from '@/types';
import { toast } from 'sonner';
import { api } from '@/lib/api';

const categoryLabels: Record<string, string> = {
  electrical: 'Electrical',
  plumbing: 'Plumbing',
  internet: 'Internet',
  furniture: 'Furniture',
  cleanliness: 'Cleanliness',
  mess_food: 'Mess Food',
  security: 'Security',
  other: 'Other',
};

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

function toClientComplaint(c: unknown): Complaint {
  const obj = (c ?? {}) as Record<string, unknown>;

  const id =
    (obj as Record<string, unknown> & { _id?: string; id?: string })._id ??
    (obj as Record<string, unknown> & { _id?: string; id?: string }).id ??
    '';

  const createdRaw =
    (obj as Record<string, unknown>)['createdAt'] ?? (obj as Record<string, unknown>)['created_at'];
  const createdIso = createdRaw ? new Date(String(createdRaw)).toISOString() : new Date().toISOString();

  const assignedRaw =
    (obj as Record<string, unknown>)['assignedStaff'] ??
    (obj as Record<string, unknown>)['assigned_staff'] ??
    null;

  const assigned = assignedRaw;

  const normalizeStatus = (statusRaw: unknown): Complaint['status'] => {
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

  const status = normalizeStatus((c as BackendComplaint | null | undefined)?.status);

  return {
    id,
    title: (obj as Record<string, unknown>)['title'] ? String((obj as Record<string, unknown>)['title']) : '',
    description: (obj as Record<string, unknown>)['description']
      ? String((obj as Record<string, unknown>)['description'])
      : '',
    category: ((obj as Record<string, unknown>)['category'] ?? 'other') as any,
    status,

    // Backend schema has no priority; keep safe default for UI.
    priority: 'medium',

    room_number: (obj as Record<string, unknown>)['roomNumber']
      ? String((obj as Record<string, unknown>)['roomNumber'])
      : (obj as Record<string, unknown>)['room_number']
        ? String((obj as Record<string, unknown>)['room_number'])
        : '',
    hostel_block: '',

    student_id:
      typeof (obj as Record<string, unknown>)['student'] === 'string'
        ? String((obj as Record<string, unknown>)['student'])
        : (obj as Record<string, unknown>)['student']
          ? (() => {
              const s = (obj as Record<string, unknown>)['student'] as unknown;
              if (!s || typeof s === 'string') return '';
              const maybeObj = s as Record<string, unknown>;
              return String(maybeObj['_id'] ?? maybeObj['id'] ?? '');
            })()
          : '',


    images: ((obj as Record<string, unknown>)['mediaUrls'] as any) ?? [],
    created_at: createdIso,
    updated_at: (obj as Record<string, unknown>)['updatedAt']
      ? new Date(String((obj as Record<string, unknown>)['updatedAt'])).toISOString()
      : (obj as Record<string, unknown>)['updated_at']
        ? new Date(String((obj as Record<string, unknown>)['updated_at'])).toISOString()
        : createdIso,

    assigned_staff: assigned
      ? {
          id: (assigned as any)?._id ?? (assigned as any)?.id ?? '',
          email: (assigned as any)?.email ?? '',
          full_name:
            (assigned as any)?.full_name ?? (assigned as any)?.name ?? (assigned as any)?.email ?? 'Staff',
          role: 'staff',
          created_at: new Date().toISOString(),
        }
      : undefined,
  } as Complaint;
}

export function AssignedComplaintsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ComplaintStatus>('all');

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('in_progress');
  const [notes, setNotes] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    let mounted = true;

    async function fetchComplaints() {
      try {
        setIsFetching(true);
        // Backend does not currently expose a dedicated "my assigned" endpoint.
        // So we fetch all complaints (admin-protected) and then filter.
        // If this requires admin, this endpoint must be added server-side.
        const res = await api.get<{ success: true; complaints: BackendComplaint[] }>('/complaints/assigned');
        if (!mounted) return;

        const mapped = (res?.complaints ?? []).map(toClientComplaint);
        // Filter for staff assigned complaints in the UI.
        const list = mapped.filter((c) => c.assigned_staff?.role === 'staff' || c.status !== 'pending');
        setComplaints(list);
      } catch (e) {
        if (!mounted) return;
        toast.error(e instanceof Error ? e.message : 'Failed to fetch assigned complaints');
      } finally {
        if (mounted) setIsFetching(false);
      }
    }

    fetchComplaints();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const matchesSearch = complaint.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [complaints, searchQuery, statusFilter]);

  const handleOpenUpdateModal = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setNotes('');
    setIsUpdateModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedComplaint) return;

    try {
      setIsLoading(true);

      await api.patch(`/complaints/${selectedComplaint.id}/status`, {
        status: newStatus,
        notes,
      });

      toast.success('Complaint status updated successfully!');
      setIsUpdateModalOpen(false);
      setSelectedComplaint(null);

      // Simple refresh by refetching list
      const res = await api.get<{ success: true; complaints: BackendComplaint[] }>('/complaints/getAll');
      const mapped = (res?.complaints ?? []).map(toClientComplaint);
      const list = mapped.filter((c) => c.assigned_staff?.role === 'staff' || c.status !== 'pending');
      setComplaints(list);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Assigned Complaints</h1>
        <p className="text-muted-foreground">Manage and update your assigned complaints.</p>
      </div>

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
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as 'all' | ComplaintStatus)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {COMPLAINT_STATUSES.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="text-sm text-muted-foreground">
        {isFetching ? 'Loading complaints...' : `${filteredComplaints.length} complaints found`}
      </div>

      <div className="space-y-4">
        {filteredComplaints.map((complaint) => (
          <Card key={complaint.id} className="overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {complaint.images[0] && (
                <div className="lg:w-48 h-32 lg:h-auto flex-shrink-0 bg-muted">
                  <img src={complaint.images[0]} alt={complaint.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{complaint.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={complaint.status} />
                      <PriorityBadge priority={complaint.priority} />
                      <Badge variant="outline">{categoryLabels[complaint.category] ?? 'Other'}</Badge>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">{complaint.description}</p>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />Block {complaint.hostel_block} - {complaint.room_number}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {complaint.created_at
                        ? formatDistanceToNow(new Date(complaint.created_at), { addSuffix: true })
                        : ''}
                    </div>
                  </div>

                  <Button size="sm" onClick={() => handleOpenUpdateModal(complaint)}>
                    Update Status
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Complaint Status</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            {selectedComplaint && (
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="font-medium">{selectedComplaint.title}</p>
                <p className="text-xs text-muted-foreground">
                  Block {selectedComplaint.hostel_block} - {selectedComplaint.room_number}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label>New Status</Label>
              <Select value={newStatus} onValueChange={(v) => setNewStatus(v as ComplaintStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Notes / Resolution Details</Label>
              <Textarea placeholder="Add notes..." value={notes} onChange={(e) => setNotes(e.target.value)} className="min-h-24" />
            </div>

            <div className="space-y-2">
              <Label>Upload Resolution Images (Optional)</Label>
              <Button variant="outline" className="w-full gap-2">
                <Upload className="h-4 w-4" />
                Upload Images
              </Button>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsUpdateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateStatus} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />Updating...
                  </>
                ) : (
                  'Update Status'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

