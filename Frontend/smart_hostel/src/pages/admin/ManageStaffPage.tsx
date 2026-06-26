import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Search, Mail, Activity, CheckCircle, Clock, TrendingUp } from 'lucide-react';

const mockStaff: (User & { stats: { assigned: number; resolved: number; pending: number } })[] = [
  { id: 's1', email: 'john.smith@hostel.com', full_name: 'John Smith', role: 'staff', phone_number: '1234567890', created_at: new Date(Date.now() - 86400000 * 90).toISOString(), stats: { assigned: 24, resolved: 18, pending: 6 } },
  { id: 's2', email: 'jane.doe@hostel.com', full_name: 'Jane Doe', role: 'staff', phone_number: '0987654321', created_at: new Date(Date.now() - 86400000 * 60).toISOString(), stats: { assigned: 31, resolved: 28, pending: 3 } },
  { id: 's3', email: 'mike.johnson@hostel.com', full_name: 'Mike Johnson', role: 'staff', phone_number: '5551234567', created_at: new Date(Date.now() - 86400000 * 45).toISOString(), stats: { assigned: 19, resolved: 15, pending: 4 } },
];

export function ManageStaffPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStaff = mockStaff.filter((staff) =>
    staff.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || staff.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalStats = filteredStaff.reduce((acc, staff) => ({ assigned: acc.assigned + staff.stats.assigned, resolved: acc.resolved + staff.stats.resolved, pending: acc.pending + staff.stats.pending }), { assigned: 0, resolved: 0, pending: 0 });

  const getInitials = (name: string) => name.split(' ').map((n) => n[0]).join('').toUpperCase();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold tracking-tight">Manage Staff</h1><p className="text-muted-foreground">View staff performance and manage team.</p></div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search staff..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="p-4 rounded-lg border bg-card"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"><Activity className="h-5 w-5 text-primary" /></div><div><p className="text-2xl font-bold">{filteredStaff.length}</p><p className="text-xs text-muted-foreground">Total Staff</p></div></div></div>
        <div className="p-4 rounded-lg border bg-card"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center"><Clock className="h-5 w-5 text-blue-500" /></div><div><p className="text-2xl font-bold">{totalStats.assigned}</p><p className="text-xs text-muted-foreground">Total Assigned</p></div></div></div>
        <div className="p-4 rounded-lg border bg-card"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center"><CheckCircle className="h-5 w-5 text-green-500" /></div><div><p className="text-2xl font-bold">{totalStats.resolved}</p><p className="text-xs text-muted-foreground">Total Resolved</p></div></div></div>
        <div className="p-4 rounded-lg border bg-card"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-yellow-500" /></div><div><p className="text-2xl font-bold">{totalStats.assigned > 0 ? Math.round((totalStats.resolved / totalStats.assigned) * 100) : 0}%</p><p className="text-xs text-muted-foreground">Resolution Rate</p></div></div></div>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Member</TableHead><TableHead>Assigned</TableHead><TableHead>Resolved</TableHead><TableHead>Pending</TableHead><TableHead>Performance</TableHead><TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((staff) => {
                  const resolutionRate = staff.stats.assigned > 0 ? Math.round((staff.stats.resolved / staff.stats.assigned) * 100) : 0;
                  return (
                    <TableRow key={staff.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar><AvatarFallback className="bg-primary text-primary-foreground">{getInitials(staff.full_name)}</AvatarFallback></Avatar>
                          <div><p className="font-medium">{staff.full_name}</p><div className="flex items-center gap-1 text-xs text-muted-foreground"><Mail className="h-3 w-3" />{staff.email}</div></div>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="secondary">{staff.stats.assigned}</Badge></TableCell>
                      <TableCell><Badge className="bg-green-100 text-green-800">{staff.stats.resolved}</Badge></TableCell>
                      <TableCell><Badge variant="outline">{staff.stats.pending}</Badge></TableCell>
                      <TableCell>
                        <div className="space-y-1 max-w-32"><div className="flex items-center justify-between text-xs"><span>{resolutionRate}%</span></div><Progress value={resolutionRate} className="h-2" /></div>
                      </TableCell>
                      <TableCell><span className="text-sm text-muted-foreground">{formatDistanceToNow(new Date(staff.created_at), { addSuffix: true })}</span></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
