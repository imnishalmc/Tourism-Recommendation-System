import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BarChart3, MapPinned, MessageSquareText, Mountain, Users, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const links = [
  { to: "/admin/dashboard", label: "Overview", icon: BarChart3 },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/destinations", label: "Destinations", icon: MapPinned },
  { to: "/admin/reviews", label: "Reviews", icon: MessageSquareText },
];

function initials(name?: string) {
  const parts = (name || "Administrator").trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return <div className="min-h-screen bg-slate-50 text-foreground">
    <aside className="fixed inset-y-0 z-20 hidden w-64 flex-col border-r border-slate-200 bg-white p-5 md:flex">
      <button onClick={() => navigate("/")} className="flex items-center gap-3 text-left">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-white"><Mountain className="size-5" /></span>
        <span><span className="block font-bold">Sajilo Yatra</span><span className="text-xs text-muted-foreground">Administration</span></span>
      </button>
      <nav className="mt-10 space-y-1">
        {links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition", isActive ? "bg-primary text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-primary")}><Icon className="size-4" />{label}</NavLink>)}
      </nav>
      <div className="mt-auto flex items-center gap-3 rounded-2xl bg-soft-green p-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-primary">{initials(user?.full_name)}</span><div className="min-w-0"><p className="truncate text-sm font-semibold">{user?.full_name || "Administrator"}</p><p className="truncate text-xs text-muted-foreground">{user?.email}</p></div></div>
      <button onClick={() => { logout(); navigate("/"); }} className="mt-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600"><LogOut className="size-4" />Sign out</button>
    </aside>
    <main className="min-h-screen md:ml-64"><header className="sticky top-0 z-10 flex h-16 items-center border-b border-slate-200 bg-white/90 px-5 backdrop-blur md:px-8"><span className="text-sm font-medium text-muted-foreground">Admin workspace</span></header><div className="p-5 md:p-8"><Outlet /></div></main>
  </div>;
}
