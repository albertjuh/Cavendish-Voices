
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Send, 
  MessageSquare, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { INITIAL_SUGGESTIONS } from '@/lib/mock-data';
import { format } from 'date-fns';

export default function DashboardPage() {
  const recentSuggestions = INITIAL_SUGGESTIONS.slice(0, 2);

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Welcome Banner */}
      <section className="bg-primary rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-bold mb-4">
            <ShieldCheck className="h-3 w-3" />
            <span>SECURE STUDENT PORTAL</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-headline font-bold text-white mb-4 leading-tight">
            Welcome back, <span className="text-secondary">Student</span>.
          </h1>
          <p className="text-white/80 text-lg mb-8 max-w-lg">
            Your ideas drive Cavendish forward. Whether it's a compliment or a concern, we're listening 24/7.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-2xl shadow-lg font-bold">
              <Link href="/submit" className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                New Suggestion
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 rounded-2xl">
              <Link href="/suggestions">Explore Feedback</Link>
            </Button>
          </div>
        </div>
        {/* Abstract design elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
      </section>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-md hover:shadow-lg transition-all rounded-2xl overflow-hidden">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-xl text-primary">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Voice</p>
              <p className="text-2xl font-black text-primary">1,248</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-md hover:shadow-lg transition-all rounded-2xl overflow-hidden">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-xl text-green-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Resolved</p>
              <p className="text-2xl font-black text-primary">842</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md hover:shadow-lg transition-all rounded-2xl overflow-hidden">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-secondary/10 p-3 rounded-xl text-secondary">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Avg Response</p>
              <p className="text-2xl font-black text-primary">24h</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md hover:shadow-lg transition-all rounded-2xl overflow-hidden">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Polls</p>
              <p className="text-2xl font-black text-primary">12</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-none shadow-md rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-headline font-bold text-primary">Recent Suggestions</CardTitle>
              <CardDescription>Latest updates from the student body</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/suggestions" className="flex items-center gap-1">
                See All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {recentSuggestions.map((s) => (
              <div key={s.id} className="group p-4 rounded-xl border border-transparent hover:border-primary/10 hover:bg-primary/5 transition-all flex flex-col sm:flex-row gap-4">
                <div className="bg-white rounded-lg h-12 w-12 flex items-center justify-center shadow-sm shrink-0 border border-border group-hover:bg-primary group-hover:text-white transition-colors">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-primary truncate pr-4">{s.title}</h4>
                    <span className="text-[10px] font-bold uppercase text-muted-foreground shrink-0">{format(new Date(s.submittedAt), 'MMM dd')}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 italic mb-2">"{s.message}"</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/10 text-secondary-foreground font-bold">{s.category}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">{s.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Help */}
        <div className="space-y-6">
          <Card className="border-none shadow-md rounded-2xl bg-secondary/5 border-l-4 border-l-secondary">
            <CardHeader>
              <CardTitle className="text-lg font-headline font-bold">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Having trouble with a campus service? Our support team is ready to assist you directly.</p>
              <Button asChild variant="outline" className="w-full rounded-xl border-secondary text-secondary-foreground hover:bg-secondary/10">
                <Link href="/contact">Open Support Ticket</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md rounded-2xl overflow-hidden">
            <div className="bg-primary p-6 text-white">
              <h3 className="font-headline font-bold mb-2">Anonymous Reporting</h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Your safety and privacy are our priorities. Choose the 'Anonymous' option in the form to hide your identity from everyone, including admins.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
