import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardCard, StatsGrid } from '@/components/dashboard/DashboardCards';
import { Complaint } from '@/types';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ClipboardList, Clock, CheckCircle, AlertCircle, ArrowRight, MapPin, Calendar } from 'lucide-react';
import { StatusBadge, PriorityBadge } from '@/components/complaints/StatusBadge';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const mockComplaints: Complaint[] = [
  { id: '1', title: 'AC not working in room', description: 'The air conditioner has stopped working.', category: 'electrical', status: 'in_progress', priority: 'high', room_number: 'A101', hostel_block: 'A', student_id: '1', images: [], created_at: new Date(Date.now() - 86400000).toISOString(), updated_at: new Date(Date.now() - 86400000).toISOString() },
  { id: '2', title: 'Water leakage in bathroom', description: 'There is a constant water leak.', category: 'plumbing', status: 'assigned', priority: 'high', room_number: 'B205', hostel_block: 'B', student_id: '2', images: [], created_at: new Date(Date.now() - 172800000).toISOString(), updated_at: new Date(Date.now() - 172800000).toISOString() },
];

const weeklyData = [{ name: 'Mon', resolved: 3, assigned: 2 }, { name: 'Tue', resolved: 4, assigned: 1 }, { name: 'Wed', resolved: 2, assigned: 3 }, { name: 'Thu', resolved: 5, assigned: 2 }, { name: 'Fri', resolved: 3, assigned: 4 }, { name: 'Sat', resolved: 1, assigned: 1 }, { name: 'Sun', resolved: 2, assigned: 0 }];

export function StaffDashboard() {
  const pendingCount = mockComplaints.filter((c) => c.status === 'assigned' || c.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold tracking-tight">Staff Dashboard</h1><p className="text-muted-foreground">Manage your assigned complaints efficiently.</p></div>
        <Link to="/assigned"><Button className="gap-2"><ClipboardList className="h-4 w-4" />View All Assigned</Button></Link>
      </div>
      <StatsGrid>
        <DashboardCard title="Total Assigned" value={mockComplaints.length} icon={ClipboardList} trend={{ value: 8, isPositive: true }} />
        <DashboardCard title="Pending" value={pendingCount} icon={Clock} iconClassName="bg-yellow-500/10" />
        <DashboardCard title="In Progress" value={mockComplaints.filter((c) => c.status === 'in_progress').length} icon={AlertCircle} iconClassName="bg-purple-500/10" />
        <DashboardCard title="Resolved" value={mockComplaints.filter((c) => c.status === 'resolved').length} icon={CheckCircle} iconClassName="bg-green-500/10" />
      </StatsGrid>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Assignments</CardTitle>
              <Link to="/assigned"><Button variant="ghost" size="sm" className="gap-1">View All<ArrowRight className="h-4 w-4" /></Button></Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockComplaints.map((complaint) => (
                <div key={complaint.id} className="flex items-start justify-between p-4 rounded-lg border hover:bg-muted/50">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Link to={`/assigned/${complaint.id}`} className="font-semibold hover:text-primary">{complaint.title}</Link>
                      <PriorityBadge priority={complaint.priority} />
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1"><MapPin className="h-3 w-3" />Block {complaint.hostel_block} - {complaint.room_number}</div>
                      <div className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDistanceToNow(new Date(complaint.created_at), { addSuffix: true })}</div>
                    </div>
                  </div>
                  <StatusBadge status={complaint.status} />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Weekly Performance</CardTitle></CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}><XAxis dataKey="name" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="resolved" fill="#22c55e" name="Resolved" radius={[4, 4, 0, 0]} /><Bar dataKey="assigned" fill="#eab308" name="Assigned" radius={[4, 4, 0, 0]} /></BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">Performance Summary</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span>Resolution Rate</span><span className="font-medium">50%</span></div>
                <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full bg-green-500 rounded-full" style={{ width: '50%' }} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center p-3 rounded-lg bg-muted/50"><p className="text-2xl font-bold text-green-600">20</p><p className="text-xs text-muted-foreground">This Month</p></div>
                <div className="text-center p-3 rounded-lg bg-muted/50"><p className="text-2xl font-bold">1.2d</p><p className="text-xs text-muted-foreground">Avg. Resolution</p></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
