
"use client"

import { useState, useMemo, useEffect } from 'react';
import { CATEGORIES, DEPARTMENTS, Suggestion } from '@/lib/mock-data';
import { subscribeSuggestions } from '@/lib/firestore';
import { useFirebase } from '@/firebase';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  Search, Filter, Calendar, User, Building, Tag, MessageCircle, ArrowUpDown, Loader2
} from 'lucide-react';
import { format } from 'date-fns';

export default function SuggestionsList() {
  const { firestore, user } = useFirebase();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeSuggestions(firestore, (data) => {
      setSuggestions(data);
      setLoading(false);
    });
    return unsubscribe;
  }, [firestore, user]);

  const filteredSuggestions = useMemo(() => {
    return suggestions
      .filter(s => {
        const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
                             s.message.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
        const matchesDept = deptFilter === 'all' || s.department === deptFilter;
        return matchesSearch && matchesCategory && matchesDept;
      })
      .sort((a, b) => {
        const dateA = new Date(a.submittedAt).getTime();
        const dateB = new Date(b.submittedAt).getTime();
        return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
      });
  }, [suggestions, search, categoryFilter, deptFilter, sortBy]);

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Resolved': return 'bg-green-100 text-green-700';
      case 'Reviewing': return 'bg-purple-100 text-purple-700';
      case 'Pending': return 'bg-slate-100 text-slate-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-headline font-bold text-primary mb-2">Student Feedback</h1>
            <p className="text-muted-foreground">Community voices helping Cavendish grow.</p>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium">
              {filteredSuggestions.length} Total Voice{filteredSuggestions.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border mb-10 flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search suggestions..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary shrink-0" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-primary shrink-0" />
              <Select value={deptFilter} onValueChange={setDeptFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {DEPARTMENTS.map(dept => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-primary shrink-0" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Suggestion Cards */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredSuggestions.map((s) => (
              <Card key={s.id} className="flex flex-col border-none shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <Badge variant="outline" className={getPriorityColor(s.priority)}>
                      {s.priority} Priority
                    </Badge>
                    <Badge className={getStatusColor(s.status)}>
                      {s.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold line-clamp-1">{s.title}</CardTitle>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                    <Tag className="h-3 w-3" />
                    <span>{s.category}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground text-sm line-clamp-4 italic leading-relaxed">
                    "{s.message}"
                  </p>
                </CardContent>
                <CardFooter className="border-t pt-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      <span>{s.isAnonymous ? 'Anonymous' : s.studentName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{format(new Date(s.submittedAt), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground w-full">
                    <Building className="h-3.5 w-3.5" />
                    <span className="truncate">{s.department}</span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredSuggestions.length === 0 && (
          <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed">
            <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground">
              <MessageCircle className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">No suggestions found</h3>
            <p className="text-muted-foreground">
              {suggestions.length === 0 ? 'Be the first to submit a suggestion!' : 'Try adjusting your filters or search terms.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
