import { useEffect, useState } from "react";
import { Pencil, Star, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { reviewService } from "@/services/review.services";
import type { Review } from "@/types/review";

export function ReviewSection({ destinationId }: { destinationId: number }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [editing, setEditing] = useState<Review | null>(null);
  const [error, setError] = useState("");

  const load = () => reviewService.list(destinationId).then(setReviews).catch(() => setError("Could not load reviews."));
  useEffect(() => { load(); }, [destinationId]);

  const resetForm = () => { setEditing(null); setComment(""); setRating(null); };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError("");
    if (!isAuthenticated) { navigate(`/login?next=/destination/${destinationId}`); return; }
    if (rating === null) { setError("Please select a rating before posting your review."); return; }
    try {
      const saved = editing
        ? await reviewService.update(editing.id, { rating, comment })
        : await reviewService.create({ destination: destinationId, rating, comment });
      setReviews((all) => editing ? all.map((review) => review.id === saved.id ? saved : review) : [saved, ...all]);
      resetForm();
    } catch { setError("Could not save your review."); }
  };

  const edit = (review: Review) => { setEditing(review); setRating(review.rating); setComment(review.comment); setError(""); };
  const remove = async (review: Review) => { if (!confirm("Delete your review?")) return; try { await reviewService.remove(review.id); setReviews((all) => all.filter((item) => item.id !== review.id)); } catch { setError("Could not delete your review."); } };

  return <section className="mt-12 border-t pt-10"><div className="flex items-end justify-between gap-4"><div><h2 className="text-2xl font-semibold">Traveller reviews</h2><p className="mt-1 text-muted-foreground">Share your experience to help future visitors.</p></div><span className="text-sm text-muted-foreground">{reviews.length} reviews</span></div><form onSubmit={submit} className="mt-6 rounded-2xl border bg-muted/30 p-5"><p className="font-semibold">{editing ? "Edit your review" : "Write a review"}</p><fieldset className="mt-3"><legend className="text-sm text-muted-foreground">Your rating <span className="text-red-600">*</span></legend><div className="mt-1 flex gap-1">{[1, 2, 3, 4, 5].map((value) => <button type="button" key={value} onClick={() => setRating(value)} className="rounded p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={`${value} stars`} aria-pressed={rating === value}><Star className={rating !== null && value <= rating ? "size-6 fill-amber-400 text-amber-400" : "size-6 text-slate-300"} /></button>)}</div>{rating !== null && <p className="mt-1 text-xs text-muted-foreground">{rating} out of 5 stars</p>}</fieldset><textarea required value={comment} onChange={(event) => setComment(event.target.value)} maxLength={1000} placeholder="What did you enjoy?" className="mt-3 min-h-24 w-full rounded-xl border bg-white p-3 text-sm" /><div className="mt-3 flex justify-end gap-2">{editing && <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>}<Button type="submit">{isAuthenticated ? editing ? "Save review" : "Post review" : "Sign in to review"}</Button></div></form>{error && <p className="mt-3 text-sm text-red-600">{error}</p>}<div className="mt-6 space-y-4">{reviews.map((review) => <article key={review.id} className="rounded-2xl border p-5"><div className="flex justify-between gap-4"><div><p className="font-semibold">{review.user_name || review.user_email}</p><p className="mt-1 flex items-center gap-1 text-sm text-amber-600"><Star className="size-4 fill-current" />{review.rating}.0</p></div>{user?.id === review.user && <div className="flex gap-1"><Button size="icon-sm" variant="ghost" onClick={() => edit(review)}><Pencil /></Button><Button size="icon-sm" variant="destructive" onClick={() => remove(review)}><Trash2 /></Button></div>}</div><p className="mt-3 text-sm leading-6 text-muted-foreground">{review.comment || "No written comment."}</p><p className="mt-3 text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</p></article>)}{!reviews.length && <p className="py-6 text-center text-muted-foreground">Be the first to review this destination.</p>}</div></section>;
}
