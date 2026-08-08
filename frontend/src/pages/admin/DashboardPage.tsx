import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPinned, MessageSquareText, Users } from "lucide-react";
import { adminService, type AdminDashboard } from "@/services/adminService";

const cards = [
  { key: "users", label: "Registered users", icon: Users, href: "/admin/users", tone: "bg-blue-50 text-blue-600" },
  { key: "destinations", label: "Destinations", icon: MapPinned, href: "/admin/destinations", tone: "bg-emerald-50 text-emerald-600" },
  { key: "reviews", label: "Traveller reviews", icon: MessageSquareText, href: "/admin/reviews", tone: "bg-amber-50 text-amber-600" },
] as const;

export default function DashboardPage() {
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { adminService.dashboard().then(setData).catch(() => setError("Could not load dashboard data. Please ensure the API is running and you are signed in as an admin.")); }, []);
  return <div className="mx-auto max-w-7xl space-y-7">
    <div><p className="text-sm font-semibold text-primary">OVERVIEW</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Welcome back, administrator</h1><p className="mt-2 text-muted-foreground">Keep your tourism platform accurate, safe, and ready for travellers.</p></div>
    {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({ key, label, icon: Icon, href, tone }) => <Link key={key} to={href} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className={`flex size-11 items-center justify-center rounded-xl ${tone}`}><Icon className="size-5" /></div><p className="mt-5 text-3xl font-bold">{data ? data[key] : "—"}</p><p className="mt-1 text-sm text-muted-foreground">{label}</p></Link>)}</div>
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="font-bold">Recent reviews</h2><p className="text-sm text-muted-foreground">Latest traveller feedback</p></div><Link className="text-sm font-semibold text-primary" to="/admin/reviews">View all</Link></div><div className="mt-5 space-y-4">{data?.recent_reviews.map((review) => <div key={review.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0"><div className="flex justify-between gap-3"><p className="font-semibold">{review.user__full_name || review.user__email}</p><span className="text-sm font-bold text-amber-500">★ {review.rating}.0</span></div><p className="text-sm text-muted-foreground">{review.destination__name} · {review.comment || "No written comment"}</p></div>) || <p className="text-sm text-muted-foreground">No reviews yet.</p>}</div></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-bold">Most discussed destinations</h2><p className="text-sm text-muted-foreground">Based on traveller review activity</p><div className="mt-5 space-y-4">{data?.top_destinations.map((item, index) => <div key={item.id} className="flex items-center gap-4"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-light-blue text-sm font-bold text-primary">{index + 1}</span><div className="min-w-0 flex-1"><p className="truncate font-semibold">{item.name}</p><p className="text-sm text-muted-foreground">{item.district}</p></div><span className="text-sm font-semibold text-muted-foreground">{item.review_total} reviews</span></div>) || <p className="text-sm text-muted-foreground">No destinations to rank yet.</p>}</div></section>
    </div>
  </div>;
}
