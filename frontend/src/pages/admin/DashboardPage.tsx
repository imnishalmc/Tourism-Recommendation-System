import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, MapPinned, MessageSquareText, Plus, Star, Users } from "lucide-react";
import { adminService, type AdminDashboard } from "@/services/adminService";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import DestinationCategoryChart from "@/components/admin/DestinationCategoryChart";
import MostReviewedChart from "@/components/admin/MostReviewedChart";
import ProvinceDistributionChart from "@/components/admin/ProvinceDistributionChart";
import TrendingDestinationsCard from "@/components/admin/TrendingDestinationsCard";

const cards = [
  { key: "users", label: "Total users", icon: Users, href: "/admin/users", accent: "blue" },
  { key: "destinations", label: "Total destinations", icon: MapPinned, href: "/admin/destinations", accent: "green" },
  { key: "reviews", label: "Reviews this month", icon: Star, href: "/admin/reviews", accent: "blue" },
] as const;

function Sparkline({ values, accent }: { values: number[]; accent: "blue" | "green" }) {
  const safeValues = values.length ? values : [0, 0];
  const max = Math.max(...safeValues, 1); const min = Math.min(...safeValues); const range = max - min || 1;
  const points = safeValues.map((value, index) => `${(index / Math.max(safeValues.length - 1, 1)) * 100},${45 - ((value - min) / range) * 32}`).join(" ");
  const color = accent === "green" ? "#2f8132" : "#1976d2";
  return <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="h-[74px] w-full" aria-hidden="true"><defs><linearGradient id={`spark-${accent}`} x1="0" x2="0" y1="0" y2="1"><stop stopColor={color} stopOpacity="0.18" /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient></defs><polygon points={`0,50 ${points} 100,50`} fill={`url(#spark-${accent})`} /><polyline points={points} fill="none" stroke={color} strokeWidth="1.7" vectorEffect="non-scaling-stroke" /></svg>;
}

export default function DashboardPage() {
  const [data, setData] = useState<AdminDashboard | null>(null); const [error, setError] = useState(""); const { user } = useAuth();
  useEffect(() => { adminService.dashboard().then(setData).catch(() => setError("Could not load dashboard data. Please ensure the API is running and you are signed in as an admin.")); }, []);
  return <div className="mx-auto max-w-7xl space-y-7">
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-sm font-semibold tracking-[0.14em] text-primary">OVERVIEW</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Welcome back, {user?.full_name || "Admin"}</h1><p className="mt-2 max-w-3xl text-muted-foreground">Sajilo Yatraa is tracking {data?.destinations || 0} curated destinations and a growing traveller community across all seven provinces of Nepal.</p></div><div className="flex flex-wrap gap-3"><a href="#dashboard-insights" className={cn(buttonVariants({ variant: "outline" }), "rounded-xl")}><BarChart3 />View analytics</a><Link to="/admin/destinations" className={cn(buttonVariants(), "rounded-xl")}><Plus />Manage destinations</Link></div></div>
    {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
    <div className="grid gap-4 md:grid-cols-3">{cards.map(({ key, label, icon: Icon, href, accent }) => { const metric = data?.overview_metrics?.[key]; const monthly = key === "reviews"; const change = monthly ? metric?.percent_change : undefined; const positive = change == null || change >= 0; const detail = monthly ? "compared with last month" : key === "users" ? "All registered accounts" : "All destinations in the database"; return <Link key={key} to={href} className="group overflow-hidden rounded-3xl border border-slate-100 bg-white pt-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className="px-6"><div className="flex items-center justify-between"><p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{label}</p><span className={`flex size-9 items-center justify-center rounded-xl ${accent === "green" ? "bg-emerald-50 text-emerald-700" : "bg-sky-50 text-blue-700"}`}><Icon className="size-4" /></span></div><p className="mt-4 text-4xl font-medium tracking-tight text-slate-800">{data ? data[key].toLocaleString() : "-"}</p><div className="mt-2 flex items-center gap-2 text-sm text-slate-500">{change != null && <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${positive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>{positive ? "+" : ""}{change}%</span>}<span>{detail}</span></div></div><div className="mt-4 border-t border-slate-100 bg-slate-50/50"><Sparkline values={metric?.trend || []} accent={accent} /></div></Link>; })}</div>
    <div id="dashboard-insights" className="scroll-mt-6 space-y-5">{data?.destination_categories && data.destination_categories.length > 0 && <DestinationCategoryChart data={data.destination_categories} />}{data?.most_reviewed && data.most_reviewed.length > 0 && <div className="grid gap-5 lg:grid-cols-2"><MostReviewedChart data={data.most_reviewed} />{data.province_distribution && data.province_distribution.length > 0 && <ProvinceDistributionChart data={data.province_distribution} />}</div>}</div>
    <div className="grid gap-5 lg:grid-cols-2">{data?.trending_destinations && data.trending_destinations.length > 0 && <TrendingDestinationsCard destinations={data.trending_destinations} />}<section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div><h2 className="font-bold">Latest reviews</h2><p className="text-sm text-muted-foreground">Newest traveller feedback awaiting a moderation pass.</p></div><div className="mt-5">{data?.recent_reviews && data.recent_reviews.length > 0 ? data.recent_reviews.map((review) => <div key={review.id} className="flex gap-3 border-b border-slate-200 py-4 first:pt-0 last:border-0 last:pb-0"><span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-light-blue text-primary"><MessageSquareText className="size-4" /></span><div className="min-w-0 flex-1"><div className="flex justify-between gap-3"><p className="font-semibold">{review.user__full_name || review.user__email}</p><span className="flex items-center gap-1 text-sm font-medium text-blue-700"><Star className="size-3.5 fill-blue-600 text-blue-600" />{review.rating.toFixed(1)}</span></div><p className="mt-1 text-sm text-muted-foreground">{review.destination__name}</p><p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{review.comment || "No written comment"}</p></div></div>) : <p className="text-sm text-muted-foreground">No reviews yet.</p>}</div><Link to="/admin/reviews" className={cn(buttonVariants({ variant: "outline" }), "mt-5 w-full rounded-xl")}>Open moderation queue</Link></section></div>
  </div>;
}
