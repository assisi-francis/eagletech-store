'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Star, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string;
}

export function ProductReviews({ productSlug }: { productSlug: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    async function fetchReviewsAndUser() {
      // Get User
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      // Get Reviews
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_slug', productSlug)
        .order('created_at', { ascending: false });

      if (data) {
        setReviews(data);
        if (user) {
          setHasReviewed(data.some(r => r.user_id === user.id));
        }
      }
      setLoading(false);
    }
    fetchReviewsAndUser();
  }, [productSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be signed in to leave a review.');
      return;
    }

    setIsSubmitting(true);
    
    const newReview = {
      product_slug: productSlug,
      user_id: user.id,
      user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous User',
      rating,
      comment
    };

    const { data, error } = await supabase
      .from('reviews')
      .insert([newReview])
      .select()
      .single();

    setIsSubmitting(false);

    if (error) {
      toast.error('Failed to submit review.');
    } else if (data) {
      toast.success('Review submitted successfully!');
      setReviews([data, ...reviews]);
      setHasReviewed(true);
      setComment('');
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-8 mt-12">
      <div className="flex items-center justify-between border-b border-border/50 pb-4">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-primary" />
            Customer Reviews
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`w-5 h-5 ${star <= Number(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted'}`} 
                />
              ))}
            </div>
            <span className="font-bold">{averageRating} out of 5</span>
            <span className="text-muted-foreground text-sm">({reviews.length} reviews)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Write a review column */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm sticky top-24">
            <h4 className="font-bold text-lg mb-4">Write a Review</h4>
            
            {!user ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">Please sign in to share your thoughts.</p>
                <Button className="w-full rounded-full" onClick={() => window.location.href = '/auth'}>Sign In</Button>
              </div>
            ) : hasReviewed ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p className="font-bold">You've reviewed this product!</p>
                <p className="text-sm text-muted-foreground">Thank you for your feedback.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none hover:scale-110 transition-transform"
                      >
                        <Star className={`w-8 h-8 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Your Review</label>
                  <textarea 
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What did you like or dislike?"
                    className="w-full h-32 p-3 rounded-xl border border-border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full rounded-xl font-bold">
                  {isSubmitting ? 'Submitting...' : 'Submit Review'} <Send className="w-4 h-4 ml-2" />
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-muted/50 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 border border-border/50 rounded-3xl bg-card shadow-sm">
              <MessageCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h4 className="font-bold text-lg">No reviews yet</h4>
              <p className="text-muted-foreground">Be the first to review this product!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary uppercase">
                      {review.user_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold">{review.user_name}</p>
                      <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(review.created_at))} ago</p>
                    </div>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted'}`} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-foreground leading-relaxed">{review.comment}</p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
