import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Send, Loader2, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const complaints = [{ id: '3', title: 'WiFi not connecting' }, { id: '6', title: 'Broken window latch' }];

export function FeedbackPage() {
  const [selectedComplaint, setSelectedComplaint] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) { toast.error('Please select a complaint'); return; }
    if (rating === 0) { toast.error('Please provide a rating'); return; }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSubmitted(true);
    toast.success('Thank you for your feedback!');
  };

  if (isSubmitted) {
    return (
      <div className="max-w-xl mx-auto">
        <Card>
          <CardContent className="pt-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4"><ThumbsUp className="h-8 w-8 text-green-600" /></div>
            <h2 className="text-xl font-semibold mb-2">Thank You!</h2>
            <p className="text-muted-foreground mb-6">Your feedback has been submitted successfully.</p>
            <Button onClick={() => { setIsSubmitted(false); setSelectedComplaint(''); setRating(0); setFeedback(''); }}>Submit Another Feedback</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Submit Feedback</h1><p className="text-muted-foreground">Help us improve by sharing your experience.</p></div>
      <Card>
        <CardHeader><CardTitle className="text-lg">Feedback Form</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Select Complaint</Label>
              <Select value={selectedComplaint} onValueChange={setSelectedComplaint}>
                <SelectTrigger><SelectValue placeholder="Select a resolved complaint" /></SelectTrigger>
                <SelectContent>
                  {complaints.map((c) => (<SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" className="p-1 focus:outline-none" onMouseEnter={() => setHoveredRating(star)} onMouseLeave={() => setHoveredRating(0)} onClick={() => setRating(star)}>
                    <Star className={cn('h-8 w-8 transition-colors', (hoveredRating || rating) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground')} />
                  </button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">{rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select rating'}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback">Your Feedback</Label>
              <Textarea id="feedback" placeholder="Share your experience..." className="min-h-32 resize-none" value={feedback} onChange={(e) => setFeedback(e.target.value)} />
            </div>
            <Button type="submit" className="w-full gap-2" disabled={isLoading}>
              {isLoading ? (<><Loader2 className="h-4 w-4 animate-spin" />Submitting...</>) : (<><Send className="h-4 w-4" />Submit Feedback</>)}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
