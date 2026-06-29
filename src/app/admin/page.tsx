
"use client"

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Suggestion } from '@/lib/mock-data';
import { subscribeSuggestions, updateSuggestionStatus, deleteSuggestion } from '@/lib/firestore';
import { useFirebase } from '@/firebase';
import {
  BarChart3, Users, CheckCircle, Clock, Trash2, CheckSquare, Eye, MoreHorizontal,
  Download, Loader2, Sparkles, TrendingUp, AlertTriangle, Lightbulb, MessageSquare, RefreshCw
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { CategoryStats, SuggestionTrend } from '@/components/DashboardCharts';
import { useToast } from '@/hooks/use-toast';
import { analyzeSuggestions, type AIInsights } from '@/ai/actions';

export default function AdminDashboard() {
  const { toast } = useToast();
  const { firestore, user } = useFirebase();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeSuggestions(firestore, (data) => {
      setSuggestions(data);
      setLoading(false);
    });
    return unsubscribe;
  }, [firestore, user]);

  const stats = useMemo(() => {
    const total = suggestions.length;
    const resolved = suggestions.filter(s => s.status === 'Resolved').length;
    const pending = suggestions.filter(s => s.status === 'Pending').length;
    const uniqueStudents = new Set(suggestions.filter(s => !s.isAnonymous).map(s => s.studentRegNo)).size;
    return [
      { title: 'Total Submissions', value: total.toString(), icon: BarChart3, color: 'text-primary bg-primary/10' },
      { title: 'Resolved Issues', value: resolved.toString(), icon: CheckCircle, color: 'text-green-600 bg-green-50' },
      { title: 'Pending Review', value: pending.toString(), icon: Clock, color: 'text-orange-500 bg-orange-50' },
      { title: 'Unique Students', value: uniqueStudents.toString(), icon: Users, color: 'text-blue-600 bg-blue-50' },
    ];
  }, [suggestions]);

  const handleResolve = async (id: string) => {
    try {
      await updateSuggestionStatus(firestore, id, 'Resolved');
      toast({ title: "Updated", description: "Suggestion has been marked as resolved." });
    } catch {
      toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSuggestion(firestore, id);
      toast({ title: "Deleted", variant: "destructive", description: "Submission has been removed from records." });
    } catch {
      toast({ title: "Error", description: "Failed to delete submission.", variant: "destructive" });
    }
  };

  const handleRunAnalysis = async () => {
    setAiLoading(true);
    try {
      const insights = await analyzeSuggestions(suggestions);
      setAiInsights(insights);
    } catch {
      toast({ title: "AI Error", description: "Analysis failed. Ensure GOOGLE_GENAI_API_KEY is configured.", variant: "destructive" });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="py-8 md:py-12 bg-background min-h-screen">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-headline font-bold text-primary mb-1">Admin Command Center</h1>
            <p className="text-sm text-muted-foreground">Manage and analyze Cavendish student voices.</p>
          </div>
          <Button className="bg-primary text-primary-foreground w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-none shadow-md overflow-hidden hover:shadow-lg transition-all">
              <CardContent className="p-4 md:p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1 line-clamp-1">{stat.title}</p>
                  <p className="text-xl md:text-2xl font-bold text-primary">{stat.value}</p>
                </div>
                <div className={`p-2 md:p-3 rounded-2xl ${stat.color} shrink-0`}>
                  <stat.icon className="h-5 w-5 md:h-6 md:w-6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Analysis Panel */}
        <Card className="border-none shadow-md mb-8 md:mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary/80 p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Sparkles className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h2 className="font-headline font-bold text-white text-lg">AI Analysis</h2>
                  <p className="text-white/70 text-xs">Powered by Gemini — analyze all {suggestions.length} submissions</p>
                </div>
              </div>
              <Button
                onClick={handleRunAnalysis}
                disabled={aiLoading || loading}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 w-full sm:w-auto gap-2"
              >
                {aiLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing…</>
                ) : (
                  <><RefreshCw className="h-4 w-4" /> {aiInsights ? 'Re-run Analysis' : 'Run AI Analysis'}</>
                )}
              </Button>
            </div>
          </div>

          {aiInsights && (
            <CardContent className="p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Summary */}
                <div className="md:col-span-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Executive Summary</h3>
                  <p className="text-sm text-foreground leading-relaxed bg-muted/40 rounded-xl p-4">
                    {aiInsights.summary}
                  </p>
                </div>

                {/* Top Themes */}
                <div>
                  <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    <TrendingUp className="h-3.5 w-3.5" /> Top Themes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {aiInsights.topThemes.map((theme, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{theme}</Badge>
                    ))}
                  </div>
                  <div className="mt-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Sentiment</h3>
                    <p className="text-sm text-muted-foreground">{aiInsights.sentimentOverview}</p>
                  </div>
                </div>

                {/* Urgent Items */}
                {aiInsights.urgentItems.length > 0 && (
                  <div>
                    <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-500 mb-3">
                      <AlertTriangle className="h-3.5 w-3.5" /> Urgent Attention
                    </h3>
                    <ul className="space-y-2">
                      {aiInsights.urgentItems.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="mt-1 h-2 w-2 rounded-full bg-red-400 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {aiInsights.recommendations.length > 0 && (
                  <div className="md:col-span-2">
                    <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                      <Lightbulb className="h-3.5 w-3.5" /> Recommendations
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {aiInsights.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 bg-secondary/10 rounded-xl p-3 text-sm">
                          <span className="font-bold text-secondary shrink-0">{i + 1}.</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-10">
          <Card className="lg:col-span-2 border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Suggestion Trends</CardTitle>
              <CardDescription>Volume of feedback over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <SuggestionTrend />
            </CardContent>
          </Card>
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Category Distribution</CardTitle>
              <CardDescription>Top feedback categories</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryStats />
            </CardContent>
          </Card>
        </div>

        {/* Submissions Table */}
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-base md:text-lg">Recent Submissions</CardTitle>
              <CardDescription>Latest student feedback requiring attention</CardDescription>
            </div>
            <Button variant="outline" size="sm">Filter</Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[80px] whitespace-nowrap">ID</TableHead>
                      <TableHead className="whitespace-nowrap">Student</TableHead>
                      <TableHead className="whitespace-nowrap hidden sm:table-cell">Category</TableHead>
                      <TableHead className="whitespace-nowrap hidden md:table-cell">Priority</TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suggestions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                          No submissions yet.
                        </TableCell>
                      </TableRow>
                    )}
                    {suggestions.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-mono text-xs">#{s.id.slice(-4).toUpperCase()}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{s.isAnonymous ? 'Anonymous' : s.studentName}</span>
                            <span className="text-xs text-muted-foreground">{s.studentRegNo}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="outline" className="font-normal text-xs">{s.category}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className={`text-xs font-bold ${s.priority === 'High' ? 'text-red-500' : 'text-primary'}`}>
                            {s.priority}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-xs ${s.status === 'Resolved' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-slate-100 text-slate-700 hover:bg-slate-100'}`}>
                            {s.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem asChild className="cursor-pointer">
                                <Link href={`/suggestions/${s.id}`}>
                                  <Eye className="mr-2 h-4 w-4" /> View &amp; Discuss
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer text-green-600"
                                onClick={() => handleResolve(s.id)}
                              >
                                <CheckSquare className="mr-2 h-4 w-4" /> Mark Resolved
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="cursor-pointer text-destructive"
                                onClick={() => handleDelete(s.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
