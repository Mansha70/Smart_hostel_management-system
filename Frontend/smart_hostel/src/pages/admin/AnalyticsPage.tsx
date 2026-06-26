import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, } from 'recharts';

const monthlyTrend = [{ month: 'Jan', complaints: 45, resolved: 38, pending: 7 }, { month: 'Feb', complaints: 52, resolved: 48, pending: 4 }, { month: 'Mar', complaints: 48, resolved: 45, pending: 3 }, { month: 'Apr', complaints: 61, resolved: 55, pending: 6 }, { month: 'May', complaints: 55, resolved: 50, pending: 5 }, { month: 'Jun', complaints: 67, resolved: 62, pending: 5 }];
const categoryBreakdown = [{ category: 'Electrical', count: 34, fullMark: 50 }, { category: 'Plumbing', count: 28, fullMark: 50 }, { category: 'Internet', count: 22, fullMark: 50 }, { category: 'Furniture', count: 18, fullMark: 50 }, { category: 'Cleanliness', count: 15, fullMark: 50 }, { category: 'Security', count: 12, fullMark: 50 }];
const resolutionByBlock = [{ block: 'A', total: 35, resolved: 28 }, { block: 'B', total: 42, resolved: 38 }, { block: 'C', total: 28, resolved: 25 }, { block: 'D', total: 31, resolved: 26 }, { block: 'E', total: 22, resolved: 18 }];
const priorityDistribution = [{ name: 'Low', value: 45, color: '#94a3b8' }, { name: 'Medium', value: 68, color: '#3b82f6' }, { name: 'High', value: 42, color: '#f97316' }, { name: 'Urgent', value: 12, color: '#ef4444' }];
const avgResolutionTime = [{ category: 'Electrical', hours: 36 }, { category: 'Plumbing', hours: 24 }, { category: 'Internet', hours: 48 }, { category: 'Furniture', hours: 72 }, { category: 'Cleanliness', hours: 16 }, { category: 'Security', hours: 8 }];
const performanceMetrics = [{ label: 'Total Complaints', value: '328', change: '+12%', isPositive: true }, { label: 'Resolution Rate', value: '85%', change: '+5%', isPositive: true }, { label: 'Avg Resolution Time', value: '1.8 days', change: '-15%', isPositive: true }, { label: 'Pending', value: '23', change: '-8%', isPositive: true }];

export function AnalyticsPage() {
  const [period, setPeriod] = useState('6m');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold tracking-tight">Analytics</h1><p className="text-muted-foreground">Insights and performance metrics.</p></div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Select period" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="1m">Last 1 Month</SelectItem>
            <SelectItem value="3m">Last 3 Months</SelectItem>
            <SelectItem value="6m">Last 6 Months</SelectItem>
            <SelectItem value="1y">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {performanceMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl font-bold">{metric.value}</span>
                    <Badge variant={metric.isPositive ? 'default' : 'destructive'} className="text-xs">
                      {metric.isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}{metric.change}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-lg">Monthly Complaints Trend</CardTitle></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend />
                <Line type="monotone" dataKey="complaints" stroke="hsl(var(--primary))" strokeWidth={2} name="Total Complaints" />
                <Line type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2} name="Resolved" />
                <Line type="monotone" dataKey="pending" stroke="#eab308" strokeWidth={2} name="Pending" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Category Distribution</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={categoryBreakdown}>
                <PolarGrid /><PolarAngleAxis dataKey="category" fontSize={11} /><PolarRadiusAxis />
                <Radar name="Complaints" dataKey="count" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Priority Distribution</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={priorityDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {priorityDistribution.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Resolution by Block</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resolutionByBlock}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="block" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Legend />
                <Bar dataKey="total" fill="#94a3b8" name="Total" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" fill="#22c55e" name="Resolved" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Avg Resolution Time (hours)</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={avgResolutionTime} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" fontSize={12} /><YAxis dataKey="category" type="category" fontSize={11} width={80} /><Tooltip />
                <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
