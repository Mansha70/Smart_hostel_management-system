import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardCard, StatsGrid } from '@/components/dashboard/DashboardCards';
import { Link } from 'react-router-dom';
import { FileText, Users, UserCog, Clock, TrendingUp, ArrowRight, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';

const statusData = [{ name: 'Pending', value: 23, color: '#eab308' }, { name: 'Assigned', value: 15, color: '#3b82f6' }, { name: 'In Progress', value: 12, color: '#8b5cf6' }, { name: 'Resolved', value: 89, color: '#22c55e' }, { name: 'Rejected', value: 5, color: '#ef4444' }];
const categoryData = [{ name: 'Electrical', count: 34, fill: '#eab308' }, { name: 'Plumbing', count: 28, fill: '#3b82f6' }, { name: 'Internet', count: 22, fill: '#22c55e' }, { name: 'Furniture', count: 18, fill: '#f97316' }, { name: 'Cleanliness', count: 15, fill: '#06b6d4' }];
const monthlyData = [{ month: 'Jan', complaints: 45, resolved: 38 }, { month: 'Feb', complaints: 52, resolved: 48 }, { month: 'Mar', complaints: 48, resolved: 45 }, { month: 'Apr', complaints: 61, resolved: 55 }, { month: 'May', complaints: 55, resolved: 50 }, { month: 'Jun', complaints: 67, resolved: 62 }];
const recentComplaints = [{ id: '1', title: 'AC not working', status: 'pending', student: 'John Doe', room: 'A101' }, { id: '2', title: 'Water leakage', status: 'in_progress', student: 'Jane Smith', room: 'B205' }, { id: '3', title: 'WiFi issues', status: 'assigned', student: 'Bob Johnson', room: 'C301' }, { id: '4', title: 'Broken chair', status: 'resolved', student: 'Alice Brown', room: 'D102' }];

const statusColors: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-800', in_progress: 'bg-purple-100 text-purple-800', assigned: 'bg-blue-100 text-blue-800', resolved: 'bg-green-100 text-green-800' };
const statusLabels: Record<string, string> = { pending: 'Pending', in_progress: 'In Progress', assigned: 'Assigned', resolved: 'Resolved' };

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1><p className="text-muted-foreground">Welcome back! Here's your hostel overview.</p></div>
        <div className="flex gap-2">
          <Link to="/admin/complaints"><Button variant="outline" className="gap-2"><FileText className="h-4 w-4" />View All Complaints</Button></Link>
          <Link to="/admin/announcements"><Button className="gap-2"><TrendingUp className="h-4 w-4" />New Announcement</Button></Link>
        </div>
      </div>
      <StatsGrid>
        <DashboardCard title="Total Complaints" value={144} icon={FileText} trend={{ value: 12, isPositive: true }} />
        <DashboardCard title="Total Students" value={320} icon={Users} trend={{ value: 5, isPositive: true }} />
        <DashboardCard title="Total Staff" value={24} icon={UserCog} trend={{ value: 2, isPositive: true }} />
        <DashboardCard title="Pending" value={23} icon={Clock} iconClassName="bg-yellow-500/10" />
      </StatsGrid>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Monthly Complaints Trend</CardTitle>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1"><div className="h-3 w-3 rounded-full bg-primary" /><span className="text-muted-foreground">Complaints</span></div>
                <div className="flex items-center gap-1"><div className="h-3 w-3 rounded-full bg-green-500" /><span className="text-muted-foreground">Resolved</span></div>
              </div>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorComplaints" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} /></linearGradient>
                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip />
                  <Area type="monotone" dataKey="complaints" stroke="hsl(var(--primary))" fill="url(#colorComplaints)" strokeWidth={2} />
                  <Area type="monotone" dataKey="resolved" stroke="#22c55e" fill="url(#colorResolved)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Complaints by Category</CardTitle></CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical"><XAxis type="number" fontSize={12} /><YAxis dataKey="name" type="category" fontSize={12} width={80} /><Tooltip /><Bar dataKey="count" radius={[0, 4, 4, 0]} /></BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">Status Distribution</CardTitle></CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart><Pie data={statusData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">{statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}</Pie></PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-2">
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
            <CardHeader className="flex flex-row items-center justify-between"><CardTitle className="text-lg">Recent Complaints</CardTitle><Link to="/admin/complaints"><Button variant="ghost" size="sm" className="gap-1">View All<ArrowRight className="h-4 w-4" /></Button></Link></CardHeader>
            <CardContent className="space-y-3">
              {recentComplaints.map((complaint) => (
                <div key={complaint.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                  <div><p className="text-sm font-medium">{complaint.title}</p><p className="text-xs text-muted-foreground">{complaint.student} - {complaint.room}</p></div>
                  <Badge className={statusColors[complaint.status]}>{statusLabels[complaint.status]}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Resolution Metrics</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-center gap-1 text-green-600"><ArrowUpRight className="h-4 w-4" /><span className="text-2xl font-bold">62%</span></div>
                  <p className="text-xs text-muted-foreground">Resolution Rate</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50"><div className="flex items-center justify-center"><span className="text-2xl font-bold">2.1</span></div><p className="text-xs text-muted-foreground">Avg. Days</p></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
