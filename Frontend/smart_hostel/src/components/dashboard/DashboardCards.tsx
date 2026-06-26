import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: { value: number; isPositive: boolean };
  className?: string;
  iconClassName?: string;
}

export function DashboardCard({ title, value, description, icon: Icon, trend, className, iconClassName }: DashboardCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center', iconClassName || 'bg-primary/10')}>
          <Icon className={cn('h-4 w-4', iconClassName ? 'text-primary-foreground' : 'text-primary')} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {trend && (
          <div className={cn('text-xs mt-1 flex items-center gap-1', trend.isPositive ? 'text-green-600' : 'text-red-600')}>
            <span>{trend.isPositive ? '' : ''}</span>
            <span>{Math.abs(trend.value)}% from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface StatsGridProps {
  children: ReactNode;
}

export function StatsGrid({ children }: StatsGridProps) {
  return <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">{children}</div>;
}
