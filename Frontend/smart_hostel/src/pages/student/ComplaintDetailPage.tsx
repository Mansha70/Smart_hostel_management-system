import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatusBadge, PriorityBadge } from '@/components/complaints/StatusBadge';
import { Complaint, ComplaintTimeline as TimelineItem } from '@/types';
import { format } from 'date-fns';
import { ArrowLeft, MapPin, Calendar, Clock, MessageSquare, Share2 } from 'lucide-react';
import { api } from '@/lib/api';

const mockComplaint: Complaint = {
  id: '1', title: 'AC not working in room', description: 'The air conditioner has stopped working completely. The room gets very hot during the day. I have tried resetting the AC unit multiple times but it still does not turn on.', category: 'electrical', status: 'in_progress', priority: 'high', room_number: 'A101', hostel_block: 'A', student_id: '1',
  assigned_staff: { id: '2', email: 'staff@hostel.com', full_name: 'John Smith', role: 'staff', created_at: new Date().toISOString() },
  images: ['https://images.pexels.com/photos/257927/pexels-photo-257927.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800'],
  resolution_notes: 'AC unit needs replacement. Parts have been ordered.',
  created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  updated_at: new Date(Date.now() - 3600000).toISOString(),
};

const mockTimeline: TimelineItem[] = [
  { id: '4', complaint_id: '1', status: 'in_progress', notes: 'AC unit inspected. Parts need replacement.', created_by: '2', created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: '3', complaint_id: '1', status: 'assigned', notes: 'Assigned to John Smith from Electrical Department.', created_by: '3', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: '2', complaint_id: '1', status: 'pending', notes: 'Complaint submitted successfully.', created_by: '1', created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
];

const categoryLabels: Record<string, string> = { electrical: 'Electrical', plumbing: 'Plumbing', internet: 'Internet', furniture: 'Furniture', cleanliness: 'Cleanliness', mess_food: 'Mess Food', security: 'Security', other: 'Other' };

export function ComplaintDetailPage() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
const res = await api.get<{ success: true; complaint: unknown }>(`/complaints/my/${id}`);
        const obj = (res as { success: true; complaint: unknown }).complaint;

        // Map backend complaint to frontend Complaint
        const c = obj as Record<string, unknown>;

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

type BackendComplaintLike = {
          _id?: string;
          id?: string;
          title?: string;
          description?: string;
          category?: string;
          status?: string;
          roomNumber?: string;
          room_number?: string;
          student?: string;
          mediaUrls?: string[];
          images?: string[];
          resolutionNotes?: string;
          resolution_notes?: string;
          createdAt?: string;
          updatedAt?: string;
          updated_at?: string;
          assignedStaff?: {
            _id?: string;
            id?: string;
            email?: string;
            full_name?: string;
            name?: string;
          } | null;
          timeline?: unknown[];
        };

        const backendComplaint = c as unknown as BackendComplaintLike;

        const mappedComplaint: Complaint = {
          id: String(backendComplaint._id ?? backendComplaint.id ?? ''),
          title: String(backendComplaint.title ?? ''),
          description: String(backendComplaint.description ?? ''),
          category: (backendComplaint.category ?? 'other') as Complaint['category'],
          status: normalizeStatus(backendComplaint.status),
          priority: 'medium',
          room_number: String(backendComplaint.roomNumber ?? backendComplaint.room_number ?? ''),
          hostel_block: '',
          student_id: String(backendComplaint.student ?? ''),
          images: (backendComplaint.mediaUrls ?? backendComplaint.images ?? []) as string[],
          resolution_notes: String(backendComplaint.resolutionNotes ?? backendComplaint.resolution_notes ?? ''),
          created_at: backendComplaint.createdAt ? new Date(backendComplaint.createdAt).toISOString() : new Date().toISOString(),
          updated_at: backendComplaint.updatedAt
            ? new Date(backendComplaint.updatedAt).toISOString()
            : backendComplaint.updated_at
              ? new Date(backendComplaint.updated_at).toISOString()
              : new Date().toISOString(),
          assigned_staff: backendComplaint.assignedStaff
            ? {
                id: String(backendComplaint.assignedStaff._id ?? backendComplaint.assignedStaff.id ?? ''),
                email: String(backendComplaint.assignedStaff.email ?? ''),
                full_name: String(
                  backendComplaint.assignedStaff.full_name ??
                    backendComplaint.assignedStaff.name ??
                    backendComplaint.assignedStaff.email ??
                    'Staff'
                ),
                role: 'staff',
                created_at: new Date().toISOString(),
              }
            : undefined,
        };

const mappedTimeline: TimelineItem[] = (backendComplaint.timeline ?? []).map((t, idx) => {
          const tt = t as Record<string, unknown>;
          return {
            id: String(tt._id ?? idx ?? ''),
            complaint_id: String(backendComplaint._id ?? backendComplaint.id ?? ''),
            status: normalizeStatus(tt.status),
            notes: String(tt.notes ?? ''),
            created_by: String(tt.createdBy ?? ''),
            created_at: tt.createdAt ? new Date(String(tt.createdAt)).toISOString() : new Date().toISOString(),
          };
        });

        setComplaint(mappedComplaint);
        setTimeline(mappedTimeline);
      } catch {
        // fallback to mock if endpoint is not available yet
        setComplaint(mockComplaint);
        setTimeline(mockTimeline);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const displayComplaint = complaint ?? mockComplaint;
  const displayTimeline = timeline.length ? timeline : mockTimeline;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/complaints"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
        <div className="flex-1"><h1 className="text-2xl font-bold tracking-tight">{displayComplaint.title}</h1><p className="text-muted-foreground">Complaint #{id}</p></div>
        <Button variant="outline" size="icon"><Share2 className="h-4 w-4" /></Button>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={displayComplaint.status} />
            <PriorityBadge priority={displayComplaint.priority} />
            <Badge variant="outline">{categoryLabels[displayComplaint.category]}</Badge>
          </div>
          <Card>
            <CardHeader><CardTitle className="text-lg">Description</CardTitle></CardHeader>
            <CardContent><p className="text-sm whitespace-pre-wrap">{displayComplaint.description}</p></CardContent>
          </Card>
          {displayComplaint.images.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-lg">Attachments</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {displayComplaint.images.map((image, index) => (
                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                      <img src={image} alt={`Attachment ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          {displayComplaint.resolution_notes && (
            <Card>
              <CardHeader><CardTitle className="text-lg">Resolution Notes</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">{displayComplaint.resolution_notes}</p></CardContent>
            </Card>
          )}
          <Card>
            <CardHeader><CardTitle className="text-lg">Status Timeline</CardTitle></CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading timeline...</p>
              ) : (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                  <div className="space-y-6">
                    {displayTimeline.map((item, index) => (
                      <div key={item.id} className="relative flex gap-4 pl-10">
                        <div className={`absolute left-0 h-8 w-8 rounded-full flex items-center justify-center ${index === 0 ? 'bg-primary' : 'bg-muted'}`}>
                          <Clock className={`h-4 w-4 ${index === 0 ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="flex items-center gap-2">
                            <span className="font-medium capitalize">{item.status.replace('_', ' ')}</span>
                            {index === 0 && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Current</span>}
                          </div>
                          {item.notes && <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>}
                          <p className="text-xs text-muted-foreground mt-1">{format(new Date(item.created_at), 'PPp')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div><p className="text-sm font-medium">Location</p><p className="text-sm text-muted-foreground">Block {displayComplaint.hostel_block} - Room {displayComplaint.room_number}</p></div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div><p className="text-sm font-medium">Created</p><p className="text-sm text-muted-foreground">{format(new Date(displayComplaint.created_at), 'PPP')}</p></div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div><p className="text-sm font-medium">Last Updated</p><p className="text-sm text-muted-foreground">{format(new Date(displayComplaint.updated_at), 'PPP')}</p></div>
              </div>
            </CardContent>
          </Card>
          {displayComplaint.assigned_staff && (
            <Card>
              <CardHeader><CardTitle className="text-lg">Assigned Staff</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar><AvatarFallback className="bg-primary text-primary-foreground">{displayComplaint.assigned_staff.full_name.split(' ').map((n) => n[0]).join('')}</AvatarFallback></Avatar>
                  <div><p className="font-medium">{displayComplaint.assigned_staff.full_name}</p><p className="text-sm text-muted-foreground">Electrical Department</p></div>
                </div>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader><CardTitle className="text-lg">Actions</CardTitle></CardHeader>
            <CardContent>
              <Link to="/feedback" className="block"><Button variant="outline" className="w-full justify-start gap-2"><MessageSquare className="h-4 w-4" />Submit Feedback</Button></Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
