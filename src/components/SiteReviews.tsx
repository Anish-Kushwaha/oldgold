import { useState, useEffect } from "react";
import { Star, Send, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SiteReview {
  id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles?: { full_name: string | null; email: string } | null;
}

const StarRating = ({ rating, onRate, interactive = false }: { rating: number; onRate?: (r: number) => void; interactive?: boolean }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        disabled={!interactive}
        onClick={() => onRate?.(star)}
        className={interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}
      >
        <Star
          className={`h-4 w-4 ${star <= rating ? "text-primary fill-primary" : "text-muted-foreground/30"}`}
        />
      </button>
    ))}
  </div>
);

const SiteReviews = () => {
  const [reviews, setReviews] = useState<SiteReview[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const fetchReviews = async () => {
    // Fetch reviews - we'll get profile names separately
    const { data } = await supabase
      .from("site_reviews")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data && data.length > 0) {
      // Fetch profile names for reviewers
      const userIds = [...new Set(data.map(r => r.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", userIds);
      
      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
      const enriched = data.map(r => ({
        ...r,
        profiles: profileMap.get(r.user_id) || null,
      }));
      setReviews(enriched);
    } else {
      setReviews([]);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to submit a review");
      return;
    }
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("site_reviews").insert({
      user_id: user.id,
      rating,
      comment: comment.trim() || null,
    });
    if (error) {
      toast.error("Failed to submit review");
    } else {
      toast.success("Thank you for your review!");
      setRating(0);
      setComment("");
      fetchReviews();
    }
    setSubmitting(false);
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <MessageSquare className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-display font-bold text-lg">Community Reviews</h3>
            <p className="text-sm text-muted-foreground">Share your experience with OldGold</p>
          </div>
        </div>
        {avgRating && (
          <div className="flex items-center gap-2">
            <StarRating rating={Math.round(Number(avgRating))} />
            <span className="text-sm font-display font-semibold text-primary">{avgRating}</span>
          </div>
        )}
      </div>

      {/* Review form */}
      {user ? (
        <form onSubmit={handleSubmit} className="space-y-3 p-4 rounded-lg bg-secondary/50 border border-border">
          <p className="text-sm font-display font-semibold">Rate OldGold</p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Rating:</span>
            <StarRating rating={rating} onRate={setRating} interactive />
          </div>
          <textarea
            placeholder="Tell us about your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={1000}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
          />
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 gold-gradient text-primary-foreground font-display font-semibold px-5 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" /> {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      ) : (
        <div className="p-4 rounded-lg bg-secondary/50 border border-border text-center">
          <p className="text-sm text-muted-foreground">
            <a href="/sell" className="text-primary font-semibold hover:underline">Log in</a> to leave a review
          </p>
        </div>
      )}

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">No reviews yet. Be the first!</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="p-3 rounded-lg bg-secondary/50 border border-border">
              <div className="flex items-center justify-between mb-1">
                <span className="font-display font-semibold text-sm">
                  {review.profiles?.full_name || review.profiles?.email || "User"}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString("en-IN")}
                </span>
              </div>
              <StarRating rating={review.rating} />
              {review.comment && (
                <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SiteReviews;
