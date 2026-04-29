
"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  INITIAL_SUGGESTIONS, 
  Suggestion 
} from '@/lib/mock-data';
import { 
  BarChart3, Users, CheckCircle, Clock, Trash2, CheckSquare, Eye, MoreHorizontal, Download
} from 'lucide-react';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { CategoryStats, SuggestionTrend } from '@/components/DashboardCharts';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<Suggestion[]>(INITIAL_SUGGESTIONS);

  const stats = [
    { title: 'Total Submissions', value: '1,248', icon: BarChart3, color: 'text-primary bg-primary/10' },
    { title: 'Resolved Issues', value: '842', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
    { title: 'Pending Review', value: '156', icon: Clock, iconColor: 'text-orange-500 bg-orange-50' },
    { title: 'Unique Students', value: '412', icon: Users, color: 'text-blue-600 bg-blue-50' },
  ];

  const handleResolve = (id: string) => {
    setSuggestions(prev => prev.map(s => s.id === id ? { ...s, status: 'Resolved' } : s));
    toast({
      title: "Updated",
      description: "Suggestion has been marked as resolved.",
    });
  };

  const handleDelete = (id: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
    toast({
      title: "Deleted",
      variant: "destructive",
      description: "Submission has been removed from records.",
    });
  };

  return (
    <div className="py-12 bg-background min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-headline font-bold text-primary mb-2">Admin Command Center</h1>
            <p className="text-muted-foreground">Manage and analyze Cavendish student voices.</p>
          </div>
          <Button className="bg-primary text-primary-foreground">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-none shadow-md overflow-hidden hover:shadow-lg transition-all">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-2xl ${stat.color || stat.iconColor}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <Card className="lg:col-span-2 border-none shadow-md">
            <CardHeader>
              <CardTitle>Suggestion Trends</CardTitle>
              <CardDescription>Volume of feedback over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <SuggestionTrend />
            </CardContent>
          </Card>
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
              <CardDescription>Top feedback categories</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryStats />
            </CardContent>
          </Card>
        </div>

        {/* Submissions Table */}
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>Latest student feedback requiring attention</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Filter</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suggestions.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-mono text-xs">#{s.id.padStart(4, '0')}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{s.isAnonymous ? 'Anonymous' : s.studentName}</span>
                          <span className="text-xs text-muted-foreground">{s.studentRegNo}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">{s.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`text-xs font-bold ${s.priority === 'High' ? 'text-red-500' : 'text-primary'}`}>
                          {s.priority}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={s.status === 'Resolved' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-slate-100 text-slate-700 hover:bg-slate-100'}>
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
                            <DropdownMenuItem className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" /> View Details
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
