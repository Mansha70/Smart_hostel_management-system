import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Complaint } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Eye, MoreVertical, MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  assigned: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-purple-100 text-purple-800',
  resolved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const categoryLabels: Record<string, string> = {
  electrical: 'Electrical', plumbing: 'Plumbing', internet: 'Internet', furniture: 'Furniture',
  cleanliness: 'Cleanliness', mess_food: 'Mess Food', security: 'Security', other: 'Other',
};

interface ComplaintCardProps {
  complaint: Complaint;
  showActions?: boolean;
  onDelete?: () => void;
}

export function ComplaintCard({ complaint, showActions = true, onDelete }: ComplaintCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      {complaint.images[0] && (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img src={complaint.images[0]} alt={complaint.title} className="w-full h-full object-cover" />
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <Link to={`/complaints/${complaint.id}`} className="font-semibold hover:text-primary line-clamp-1">{complaint.title}</Link>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className={statusColors[complaint.status]}>{complaint.status.replace('_', ' ')}</Badge>
              <Badge variant="outline">{complaint.priority}</Badge>
            </div>
          </div>
          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild><Link to={`/complaints/${complaint.id}`}>View Details</Link></DropdownMenuItem>
                {onDelete && <DropdownMenuItem onClick={onDelete} className="text-destructive">Delete</DropdownMenuItem>}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{complaint.description}</p>
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /><span>Block {complaint.hostel_block} - {complaint.room_number}</span></div>
          <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /><span>{formatDistanceToNow(new Date(complaint.created_at), { addSuffix: true })}</span></div>
        </div>
        <div className="flex items-center justify-between">
          <Badge variant="outline">{categoryLabels[complaint.category]}</Badge>
          <Link to={`/complaints/${complaint.id}`}><Button size="sm" variant="ghost"><Eye className="h-4 w-4 mr-1" />View</Button></Link>
        </div>
      </CardContent>
    </Card>
  );
}
