import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Shield, BarChart3, Clock, Users, MessageSquare, ArrowRight, Star } from 'lucide-react';

const features = [
  { icon: Zap, title: 'Lightning Fast', description: 'Submit complaints in seconds and track progress in real-time.' },
  { icon: Shield, title: 'Secure & Private', description: 'Your data is protected with enterprise-grade security.' },
  { icon: BarChart3, title: 'Analytics Dashboard', description: 'Comprehensive insights for administrators and staff.' },
  { icon: Clock, title: '24/7 Availability', description: 'File complaints anytime, anywhere from any device.' },
  { icon: Users, title: 'Role Management', description: 'Distinct dashboards for students, staff, and admins.' },
  { icon: MessageSquare, title: 'Real-time Updates', description: 'Get instant notifications on complaint status changes.' },
];

const stats = [
  { value: '10,000+', label: 'Complaints Resolved' },
  { value: '50+', label: 'Hostel Blocks' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '<24h', label: 'Avg Resolution Time' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Student, Block A', content: 'Finally, a system that works! My complaints are resolved quickly.', rating: 5 },
  { name: 'Rahul Kumar', role: 'Maintenance Staff', content: 'The dashboard makes it so easy to manage my assigned tasks.', rating: 5 },
  { name: 'Dr. Anil Patel', role: 'Hostel Warden', content: 'Analytics feature helps me identify recurring issues.', rating: 5 },
];

export function LandingPage() {
  return (
    <div className="pt-16">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="container mx-auto px-4 py-20 lg:py-32 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />Smart Complaint Management
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Hostel Complaints,<br /><span className="text-primary">Solved Beautifully</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
              Streamline hostel maintenance with our modern complaint management system. Track, manage, and resolve issues efficiently.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register"><Button size="lg" className="gap-2">Get Started Free<ArrowRight className="h-4 w-4" /></Button></Link>
              <Link to="/login"><Button size="lg" variant="outline">Sign In</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">A comprehensive solution designed for modern hostel management</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by Everyone</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">See what students, staff, and administrators are saying</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">{testimonial.content}</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
