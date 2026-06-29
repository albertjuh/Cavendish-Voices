'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { useFirebase } from '@/firebase';
import {
  getSuggestionById,
  subscribeComments,
  addComment,
  type Comment,
} from '@/lib/firestore';
import type { Suggestion } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Loader2,
  Send,
  MessageCircle,
  Calendar,
  User,
  Building,
  Tag,
  AlertTriangle,
} from 'lucide-react';

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'High': return 'bg-red-100 text-red-700 border-red-200';
    case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'Low': return 'bg-blue-100 text-blue-700 border-blue-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'Resolved': return 'bg-green-100 text-green-700';
    case 'Reviewing': return 'bg-purple-100 text-purple-700';
    case 'Pending': return 'bg-slate-100 text-slate-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

export default function SuggestionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { firestore, user } = useFirebase();
  const { toast } = useToast();

  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingSuggestion, setLoadingSuggestion] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [posting, setPosting] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id || !user) return;
    getSuggestionById(firestore, id).then((s) => {
      setSuggestion(s);
      setLoadingSuggestion(false);
    });
    const unsub = subscribeComments(firestore, id, (data) => {
      setComments(data);
    });
    return unsub;
  }, [firestore, user, id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const handlePostComment = async () => {
    if (!commentText.trim() || !user || !id) return;
    setPosting(true);
    try {
      await addComment(firestore, user, id, commentText.trim());
      setCommentText('');
    } catch {
      toast({ title: 'Error', description: 'Failed to post comment.', variant: 'destructive' });
    } finally {
      setPosting(false);
    }
  };

  if (loadingSuggestion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!suggestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4">
        <AlertTriangle className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-bold text-primary">Suggestion not found</h2>
        <Button variant="outline" onClick={() => router.push('/suggestions')}>
          Back to Feed
        </Button>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12 bg-background min-h-screen">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Back link */}
        <Link
          href="/suggestions"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Suggestion Feed
        </Link>

        {/* Suggestion Detail Card */}
        <Card className="border-none shadow-lg mb-8">
          <CardHeader className="pb-4">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline" className={getPriorityColor(suggestion.priority)}>
                {suggestion.priority} Priority
              </Badge>
              <Badge className={getStatusColor(suggestion.status)}>
                {suggestion.status}
              </Badge>
            </div>
            <CardTitle className="text-2xl md:text-3xl font-headline font-bold text-primary leading-tight">
              {suggestion.title}
            </CardTitle>
            <CardDescription className="flex flex-wrap gap-4 mt-3 text-sm">
              <span className="flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" />
                {suggestion.category}
              </span>
              <span className="flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5" />
                {suggestion.department}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                {suggestion.isAnonymous ? 'Anonymous' : suggestion.studentName}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {format(new Date(suggestion.submittedAt), 'MMM dd, yyyy')}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <blockquote className="border-l-4 border-primary/30 pl-4 text-muted-foreground italic leading-relaxed text-base">
              &ldquo;{suggestion.message}&rdquo;
            </blockquote>
            <p className="text-xs text-muted-foreground mt-4">
              Ref: #{suggestion.id.slice(-8).toUpperCase()}
            </p>
          </CardContent>
        </Card>

        {/* Chat Wall */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-headline font-bold text-primary">
              Discussion
            </h2>
            <span className="text-sm text-muted-foreground">({comments.length} comment{comments.length !== 1 ? 's' : ''})</span>
          </div>

          {/* Comments List */}
          <div className="space-y-3 max-h-[480px] overflow-y-auto rounded-2xl bg-muted/30 p-4 border">
            {comments.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <MessageCircle className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">No comments yet.</p>
                <p className="text-xs">Be the first to join the discussion!</p>
              </div>
            ) : (
              comments.map((c) => (
                <div
                  key={c.id}
                  className={`flex gap-3 ${c.authorId === user?.uid ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <Avatar className="h-8 w-8 shrink-0 border border-border shadow-sm">
                    <AvatarImage src={c.authorPhoto ?? undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                      {c.authorName?.charAt(0)?.toUpperCase() ?? 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`flex flex-col gap-1 max-w-[75%] ${c.authorId === user?.uid ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-semibold">
                        {c.authorId === user?.uid ? 'You' : c.authorName}
                      </span>
                      <span>{format(new Date(c.createdAt), 'MMM dd, h:mm a')}</span>
                    </div>
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        c.authorId === user?.uid
                          ? 'bg-primary text-primary-foreground rounded-tr-sm'
                          : 'bg-white border border-border rounded-tl-sm shadow-sm'
                      }`}
                    >
                      {c.message}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* Comment Input */}
          <div className="bg-white rounded-2xl border shadow-sm p-4">
            <div className="flex gap-3 items-start">
              <Avatar className="h-8 w-8 shrink-0 border border-border">
                <AvatarImage src={user?.photoURL ?? undefined} />
                <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-bold">
                  {user?.displayName?.charAt(0)?.toUpperCase() ?? 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 flex flex-col gap-2">
                <Textarea
                  placeholder="Share your thoughts on this suggestion…"
                  className="resize-none text-sm min-h-[80px] rounded-xl border-muted focus:border-primary"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      handlePostComment();
                    }
                  }}
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Ctrl+Enter to post</p>
                  <Button
                    onClick={handlePostComment}
                    disabled={!commentText.trim() || posting}
                    size="sm"
                    className="rounded-xl bg-primary text-primary-foreground gap-2"
                  >
                    {posting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
