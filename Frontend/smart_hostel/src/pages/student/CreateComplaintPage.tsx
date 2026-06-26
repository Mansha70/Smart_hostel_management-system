import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { COMPLAINT_CATEGORIES, COMPLAINT_PRIORITIES } from '@/types';
import { Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

const createComplaintSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.enum(['electrical', 'plumbing', 'internet', 'furniture', 'cleanliness', 'mess_food', 'security', 'other'] as const),
  priority: z.enum(['low', 'medium', 'high', 'urgent'] as const),
  room_number: z.string().min(1, 'Room number is required'),
});

type CreateComplaintForm = z.infer<typeof createComplaintSchema>;

export function CreateComplaintPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateComplaintForm>({
    resolver: zodResolver(createComplaintSchema),
    defaultValues: { title: '', description: '', category: undefined, priority: 'medium', room_number: user?.room_number || '' },
  });

  const onSubmit = async (data: CreateComplaintForm) => {
    try {
      if (!user?.id) {
        toast.error('You must be logged in');
        return;
      }

      setIsLoading(true);

      // Debug: ensure token exists before sending request.
      if (!localStorage.getItem('hostel_complaint_jwt')) {
        toast.error('Token missing in localStorage. Please login again.');
        setIsLoading(false);
        return;
      }

      // Note: Backend expects: title, description, category, roomNumber, and multipart field `media`.
      // This UI currently submits JSON only; if you later add media upload, switch to api.postForm().
      await api.post('/complaints/createComplaint', {
        title: data.title,
        description: data.description,
        category: data.category,
        roomNumber: data.room_number,
      });

      toast.success('Complaint submitted successfully!');
      navigate('/complaints');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to submit complaint');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Create Complaint</h1><p className="text-muted-foreground">Submit a new complaint. We'll address it as soon as possible.</p></div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Complaint Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Complaint Title</FormLabel><FormControl><Input placeholder="Brief title describing the issue" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe the issue in detail..." className="min-h-32 resize-none" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem><FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger></FormControl>
                      <SelectContent>{COMPLAINT_CATEGORIES.map((cat) => (<SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>))}</SelectContent>
                    </Select>
                  <FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="priority" render={({ field }) => (
                  <FormItem><FormLabel>Priority Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger></FormControl>
                      <SelectContent>{COMPLAINT_PRIORITIES.map((pri) => (<SelectItem key={pri.value} value={pri.value}>{pri.label}</SelectItem>))}</SelectContent>
                    </Select>
                  <FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="room_number" render={({ field }) => (
                <FormItem><FormLabel>Room Number</FormLabel><FormControl><Input placeholder="e.g., A101" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </CardContent>
          </Card>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading ? (<><Loader2 className="h-4 w-4 animate-spin" />Submitting...</>) : (<><Send className="h-4 w-4" />Submit Complaint</>)}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
