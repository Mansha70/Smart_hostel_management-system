import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Announcement } from '@/types';
import { format } from 'date-fns';
import { Megaphone, Plus, Edit, Trash2, CalendarIcon, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const mockAnnouncements: Announcement[] = [
  { id: '1', title: 'Water Supply Maintenance', content: 'Water supply will be interrupted on Saturday from 10 AM to 2 PM for maintenance work.', scheduled_at: new Date(Date.now() + 86400000 * 2).toISOString(), created_by: 'admin', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: '2', title: 'Weekend Mess Schedule Change', content: 'Due to maintenance, the mess timing on Sunday will be: Breakfast 8-10 AM.', created_by: 'admin', created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: '3', title: 'Important: WiFi Password Update', content: 'The hostel WiFi password has been updated. Please check the notice board.', created_by: 'admin', created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
];

export function AnnouncementsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', scheduled: false, scheduled_date: new Date() });

  const handleCreate = async () => {
    if (!form.title || !form.content) { toast.error('Please fill in all fields'); return; }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast.success('Announcement created successfully!');
    setIsCreateModalOpen(false);
    setForm({ title: '', content: '', scheduled: false, scheduled_date: new Date() });
  };

  const handleEdit = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast.success('Announcement updated successfully!');
    setIsEditModalOpen(false);
    setSelectedAnnouncement(null);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast.success('Announcement deleted successfully!');
    setIsDeleteDialogOpen(false);
    setSelectedAnnouncement(null);
  };

  const openEditModal = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setForm({ title: announcement.title, content: announcement.content, scheduled: !!announcement.scheduled_at, scheduled_date: announcement.scheduled_at ? new Date(announcement.scheduled_at) : new Date() });
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold tracking-tight">Announcements</h1><p className="text-muted-foreground">Create and manage hostel announcements.</p></div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2"><Plus className="h-4 w-4" />Create Announcement</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="p-4 rounded-lg border bg-card"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"><Megaphone className="h-5 w-5 text-primary" /></div><div><p className="text-2xl font-bold">{mockAnnouncements.length}</p><p className="text-xs text-muted-foreground">Total Announcements</p></div></div></div>
        <div className="p-4 rounded-lg border bg-card"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center"><span className="text-green-600 font-bold">2</span></div><div><p className="text-2xl font-bold">{mockAnnouncements.filter(a => !a.scheduled_at || new Date(a.scheduled_at) <= new Date()).length}</p><p className="text-xs text-muted-foreground">Published</p></div></div></div>
        <div className="p-4 rounded-lg border bg-card"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center"><Clock className="h-5 w-5 text-blue-500" /></div><div><p className="text-2xl font-bold">{mockAnnouncements.filter(a => a.scheduled_at && new Date(a.scheduled_at) > new Date()).length}</p><p className="text-xs text-muted-foreground">Scheduled</p></div></div></div>
      </div>
      <div className="space-y-4">
        {mockAnnouncements.map((announcement) => (
          <Card key={announcement.id}>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{announcement.title}</h3>
                    {announcement.scheduled_at && new Date(announcement.scheduled_at) > new Date() && <Badge variant="outline" className="text-blue-600">Scheduled</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{announcement.content}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1"><CalendarIcon className="h-3 w-3" />Created {format(new Date(announcement.created_at), 'PP')}</div>
                    {announcement.scheduled_at && <div className="flex items-center gap-1"><Clock className="h-3 w-3" />Publish {format(new Date(announcement.scheduled_at), 'PPp')}</div>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditModal(announcement)}><Edit className="h-4 w-4 mr-1" />Edit</Button>
                  <Button variant="outline" size="sm" className="text-destructive" onClick={() => { setSelectedAnnouncement(announcement); setIsDeleteDialogOpen(true); }}><Trash2 className="h-4 w-4 mr-1" />Delete</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isCreateModalOpen || isEditModalOpen} onOpenChange={(open) => { if (!open) { setIsCreateModalOpen(false); setIsEditModalOpen(false); setSelectedAnnouncement(null); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{isEditModalOpen ? 'Edit Announcement' : 'Create Announcement'}</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2"><Label htmlFor="title">Title</Label><Input id="title" placeholder="Announcement title..." value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="content">Content</Label><Textarea id="content" placeholder="Write your announcement content..." className="min-h-32" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5"><Label>Schedule Publication</Label><p className="text-xs text-muted-foreground">Publish at a specific date and time</p></div>
              <Switch checked={form.scheduled} onCheckedChange={(checked) => setForm({ ...form, scheduled: checked })} />
            </div>
            {form.scheduled && (
              <div className="space-y-2">
                <Label>Publication Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn('w-full justify-start text-left font-normal')}><CalendarIcon className="mr-2 h-4 w-4" />{format(form.scheduled_date, 'PPP')}</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={form.scheduled_date} onSelect={(date) => date && setForm({ ...form, scheduled_date: date })} disabled={(date) => date < new Date()} /></PopoverContent>
                </Popover>
              </div>
            )}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }}>Cancel</Button>
              <Button onClick={isEditModalOpen ? handleEdit : handleCreate} disabled={isLoading}>
                {isLoading ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />{isEditModalOpen ? 'Updating...' : 'Creating...'}</>) : (<><Megaphone className="h-4 w-4 mr-2" />{isEditModalOpen ? 'Update' : 'Publish'}</>)}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Announcement</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete "{selectedAnnouncement?.title}"? This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
