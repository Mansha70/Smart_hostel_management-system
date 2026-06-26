import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DashboardCard, StatsGrid } from '@/components/dashboard/DashboardCards';
import { ComplaintCard } from '@/components/complaints/ComplaintCard';
import { Complaint } from '@/types';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle, PlusCircle, ArrowRight, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const mockComplaints: Complaint[] = [
  { id: '1', title: 'AC not working in room', description: 'The air conditioner has stopped working completely.', category: 'electrical', status: 'in_progress', priority: 'high', room_number: 'A101', hostel_block: 'A', student_id: '1', images: ['https://images.pexels.com/photos/257927/pexels-photo-257927.jpeg?auto=compress&cs=tinysrgb&w=400'], created_at: new Date(Date.now() - 86400000).toISOString(), updated_at: new Date(Date.now() - 86400000).toISOString() },
  { id: '2', title: 'Water leakage in bathroom', description: 'There is a constant water leak from the ceiling.', category: 'plumbing', status: 'pending', priority: 'medium', room_number: 'A101', hostel_block: 'A', student_id: '1', images: [], created_at: new Date(Date.now() - 172800000).toISOString(), updated_at: new Date(Date.now() - 172800000).toISOString() },
  { id: '3', title: 'WiFi not connecting', description: 'Unable to connect to the hostel WiFi.', category: 'internet', status: 'resolved', priority: 'medium', room_number: 'A101', hostel_block: 'A', student_id: '1', images: [], created_at: new Date(Date.now() - 259200000).toISOString(), updated_at: new Date(Date.now() - 86400000).toISOString() },
];

const statusData = [{ name: 'Pending', value: 2, color: '#eab308' }, { name: 'In Progress', value: 3, color: '#8b5cf6' }, { name: 'Resolved', value: 8, color: '#22c55e' }];
const categoryData = [{ name: 'Electrical', count: 4 }, { name: 'Plumbing', count: 3 }, { name: 'Internet', count: 2 }, { name: 'Furniture', count: 1 }];

export function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold tracking-tight">Dashboard</h1><p className="text-muted-foreground">Welcome back! Here's your complaint overview.</p></div>
        <Link to="/complaints/create"><Button className="gap-2"><PlusCircle className="h-4 w-4" />New Complaint</Button></Link>
      </div>
      <StatsGrid>
        <DashboardCard title="Total Complaints" value={13} icon={FileText} trend={{ value: 12, isPositive: false }} />
        <DashboardCard title="Pending" value={2} icon={Clock} iconClassName="bg-yellow-500/10" />
        <DashboardCard title="In Progress" value={3} icon={TrendingUp} iconClassName="bg-purple-500/10" />
        <DashboardCard title="Resolved" value={8} icon={CheckCircle} iconClassName="bg-green-500/10" />
      </StatsGrid>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Complaints</CardTitle>
              <Link to="/complaints"><Button variant="ghost" size="sm" className="gap-1">View All<ArrowRight className="h-4 w-4" /></Button></Link>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">{mockComplaints.map((complaint) => <ComplaintCard key={complaint.id} complaint={complaint} />)}</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Complaints by Category</CardTitle></CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}><XAxis dataKey="name" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} /></BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">Status Overview</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart><Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">{statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}</Pie></PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {statusData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} /><span>{item.name}</span></div>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Resolution Rate</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">This month</span><span className="font-semibold">61.5%</span></div>
              <Progress value={61.5} />
              <p className="text-xs text-muted-foreground">8 out of 13 complaints resolved</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
