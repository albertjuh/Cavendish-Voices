
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Send, MessageSquare, ShieldCheck, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden bg-primary">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://picsum.photos/seed/cavendish1/1200/600"
            alt="Cavendish University Campus"
            fill
            className="object-cover opacity-20"
            priority
            data-ai-hint="university campus"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              <ShieldCheck className="h-4 w-4" />
              <span>100% Secure & Anonymous</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-headline font-bold text-white mb-6 leading-tight">
              Your Voice Matters at <span className="text-secondary">Cavendish University</span>
            </h1>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              A digital platform designed to bridge the gap between students and administration. Share your ideas, report concerns, and help us build a better campus experience together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg h-14 px-8 rounded-full shadow-lg hover:shadow-xl transition-all">
                <Link href="/submit" className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Submit a Suggestion
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary text-lg h-14 px-8 rounded-full">
                <Link href="/suggestions">View Feedback</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At Cavendish University, we believe that academic excellence is a collaborative journey. Cavendish Voices is dedicated to fostering an environment of transparency, accountability, and continuous improvement by providing students with a direct channel to university management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-xl bg-white/50 backdrop-blur hover:translate-y-[-5px] transition-transform duration-300">
              <CardContent className="pt-8 text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                  <MessageSquare className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-4">Open Communication</h3>
                <p className="text-muted-foreground">Breaking barriers between the student body and university leadership through structured digital feedback.</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-white/50 backdrop-blur hover:translate-y-[-5px] transition-transform duration-300">
              <CardContent className="pt-8 text-center">
                <div className="bg-secondary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-secondary">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-4">Continuous Growth</h3>
                <p className="text-muted-foreground">Using data-driven insights from suggestions to implement meaningful changes across all departments.</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-white/50 backdrop-blur hover:translate-y-[-5px] transition-transform duration-300">
              <CardContent className="pt-8 text-center">
                <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-green-600">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-4">Accountability</h3>
                <p className="text-muted-foreground">Tracking every suggestion from submission to resolution, ensuring your concerns are never ignored.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Quick View */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-primary mb-2">1,240+</p>
              <p className="text-muted-foreground font-medium">Suggestions Received</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">850+</p>
              <p className="text-muted-foreground font-medium">Resolved Issues</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">95%</p>
              <p className="text-muted-foreground font-medium">Student Satisfaction</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">24h</p>
              <p className="text-muted-foreground font-medium">Avg. Response Time</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
