import { useEffect, useState } from "react";
import { MapPin, Pencil, Plus, Search, Star, Trash2, X } from "lucide-react";
import { adminService } from "@/services/adminService";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { buildImageUrl, buildImageUrlCandidates } from "@/lib/destinationImages";
import { cn } from "@/lib/utils";
import { CROWD_LEVELS, DIFFICULTY_LEVELS, MAIN_CATEGORIES, BUDGET_LEVELS } from "@/constants/categories";
import type { Destination } from "@/types/destination";

type FormData = Record<string, string | number | boolean>;

// ADDED: budget_level, latitude, longitude — all three are required on the backend
// (Destination.budget_level has no default; latitude/longitude have no default either)
const emptyForm: FormData = { name: "", district: "", province: "", best_season: "", main_category: "natural", tags: "", activities: "", difficulty_level: "easy", accessibility: "", transportation: "", crowd_level: "moderate", budget_level: "medium", description: "", image_url: "", ratings: "", popularity: "", attraction_total_reviews: 0, is_featured: false, latitude: "", longitude: "" };

const difficultyStyles: Record<string, string> = { easy: "bg-soft-green text-secondary", moderate: "bg-light-blue text-primary", hard: "bg-primary/10 text-primary", very_hard: "bg-primary/20 text-primary" };
const crowdStyles: Record<string, string> = { very_low: "bg-secondary/10 text-secondary", low: "bg-secondary/10 text-secondary", moderate: "bg-muted text-muted-foreground", high: "bg-primary/10 text-primary", very_high: "bg-primary/20 text-primary" };
const label = (list: { value: string; label: string }[], value: string) => list.find((item) => item.value === value)?.label ?? value;

export default function DestinationManagementPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]); const [search, setSearch] = useState(""); const [form, setForm] = useState<FormData>(emptyForm); const [editing, setEditing] = useState<Destination | null>(null); const [open, setOpen] = useState(false); const [loading, setLoading] = useState(true); const [message, setMessage] = useState("");
  const load = async (query = "") => { setLoading(true); try { setDestinations(await adminService.destinations(query)); } catch { setMessage("Unable to load destinations."); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  // UPDATED: also seed budget_level, latitude, longitude when editing an existing destination
  const openForm = (destination?: Destination) => { setEditing(destination || null); setForm(destination ? { ...emptyForm, ...destination, tags: destination.tags?.join(", ") || "", image_url: typeof destination.image_url === "string" ? destination.image_url : "", ratings: destination.ratings ?? "", popularity: destination.popularity ?? "", budget_level: destination.budget_level ?? "medium", latitude: destination.latitude ?? "", longitude: destination.longitude ?? "" } : { ...emptyForm }); setOpen(true); };
  const update = (name: string, value: string | boolean) => setForm((current) => ({ ...current, [name]: value }));
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    // ADDED: guard against empty lat/long before hitting the API — clearer error than a raw 400
    if (form.latitude === "" || form.longitude === "") {
      setMessage("Latitude and longitude are required.");
      return;
    }
    try {
      const payload = {
        name: String(form.name).trim(),
        district: String(form.district).trim(),
        province: String(form.province).trim(),
        best_season: String(form.best_season).trim(),
        main_category: form.main_category,
        tags: String(form.tags).split(",").map((tag) => tag.trim()).filter(Boolean),
        activities: String(form.activities).trim(),
        difficulty_level: form.difficulty_level,
        accessibility: String(form.accessibility).trim(),
        transportation: String(form.transportation).trim(),
        crowd_level: form.crowd_level,
        budget_level: form.budget_level, // ADDED
        description: String(form.description).trim(),
        image_url: String(form.image_url).trim(),
        ratings: form.ratings === "" ? null : Number(form.ratings),
        popularity: form.popularity === "" ? null : Number(form.popularity),
        attraction_total_reviews: Number(form.attraction_total_reviews || 0),
        is_featured: Boolean(form.is_featured),
        latitude: Number(form.latitude),   // ADDED
        longitude: Number(form.longitude), // ADDED
      } as Partial<Destination>;
      const saved = editing ? await adminService.updateDestination(editing.id, payload) : await adminService.createDestination(payload);
      setDestinations((all) => editing ? all.map((item) => item.id === saved.id ? saved : item) : [saved, ...all]);
      setOpen(false);
    } catch {
      setMessage("Could not save. Check that required fields and numeric values are valid.");
    }
  };
  const remove = async (id: number) => { if (!confirm("Delete this destination and its related reviews?")) return; try { await adminService.deleteDestination(id); setDestinations((all) => all.filter((item) => item.id !== id)); } catch { setMessage("Could not delete destination."); } };
  return <div className="mx-auto max-w-7xl"><div><p className="text-sm font-semibold text-primary">CONTENT</p><h1 className="mt-1 text-3xl font-bold">Destination management</h1><p className="mt-2 text-muted-foreground">Manage the destination fields that travellers see.</p></div><div className="mt-7 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row"><form className="relative flex-1" onSubmit={(event) => { event.preventDefault(); load(search); }}><Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search destinations…" className="h-9 pl-9" /></form><Button variant="outline" onClick={() => { setSearch(""); load(); }}>Clear</Button><Button size="lg" onClick={() => openForm()}><Plus />Add destination</Button></div>{message && <p className="mt-4 text-sm text-red-600">{message}</p>}<p className="mt-6 text-sm text-muted-foreground">{loading ? "Loading destinations…" : `${destinations.length} destinations found`}</p><div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{destinations.map((destination) => <DestinationCard key={destination.id} destination={destination} onEdit={() => openForm(destination)} onDelete={() => remove(destination.id)} />)}</div>{open && <DestinationForm form={form} editing={editing} update={update} close={() => setOpen(false)} save={save} />}</div>;
}

function DestinationCard({ destination, onEdit, onDelete }: { destination: Destination; onEdit: () => void; onDelete: () => void }) { return <article className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm"><div className="relative aspect-[4/3] overflow-hidden bg-muted"><img src={buildImageUrl(destination.image_url, destination.name)} alt={destination.name} data-image-index="0" onError={(event) => { const sources = buildImageUrlCandidates(destination.image_url, destination.name); const next = Number(event.currentTarget.dataset.imageIndex || 0) + 1; if (next >= sources.length) { event.currentTarget.style.display = "none"; return; } event.currentTarget.dataset.imageIndex = String(next); event.currentTarget.src = sources[next]; }} className="size-full object-cover" />{destination.ratings != null && <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm font-semibold"><Star className="size-3.5 fill-amber-400 text-amber-400" />{destination.ratings.toFixed(1)}</span>}{destination.is_featured && <span className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">Popular</span>}</div><div className="p-6"><h2 className="text-lg font-semibold">{destination.name}</h2><p className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-3" />{destination.district}</p><div className="mt-4 flex gap-2"><span className={cn("rounded-full px-3 py-1 text-xs", difficultyStyles[destination.difficulty_level])}>{label(DIFFICULTY_LEVELS, destination.difficulty_level)}</span><span className={cn("rounded-full px-3 py-1 text-xs", crowdStyles[destination.crowd_level])}>{label(CROWD_LEVELS, destination.crowd_level)} crowd</span></div><p className="mt-4 line-clamp-3 text-sm text-muted-foreground">{destination.description || "No description yet."}</p><div className="mt-5 flex gap-2"><Button variant="outline" className="flex-1 rounded-full" onClick={onEdit}><Pencil />Edit details</Button><Button variant="destructive" size="icon" onClick={onDelete}><Trash2 /></Button></div></div></article>; }

function DestinationForm({ form, editing, update, close, save }: { form: FormData; editing: Destination | null; update: (name: string, value: string | boolean) => void; close: () => void; save: (event: React.FormEvent) => void }) {
  const input = (name: string, label: string, options: { required?: boolean; type?: string; min?: number; max?: number; maxLength?: number; step?: number } = {}) => <label className="text-sm font-semibold">{label}<Input required={options.required} type={options.type || "text"} min={options.min} max={options.max} step={options.step} maxLength={options.maxLength} value={String(form[name])} onChange={(event) => update(name, event.target.value)} className="mt-1" /></label>;
  const select = (name: string, label: string, items: { value: string; label: string }[]) => <label className="text-sm font-semibold">{label}<select value={String(form[name])} onChange={(event) => update(name, event.target.value)} className="mt-1 h-8 w-full rounded-lg border border-input bg-white px-2">{items.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>;
  return <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 p-4"><form onSubmit={save} className="mx-auto my-6 max-w-3xl rounded-2xl bg-white p-6 shadow-xl"><div className="flex justify-between gap-4"><div><h2 className="text-xl font-bold">{editing ? "Edit destination" : "Add destination"}</h2><p className="text-sm text-muted-foreground">Fields follow the imported destination dataset.</p></div><Button type="button" variant="ghost" size="icon" onClick={close}><X /></Button></div><div className="mt-6 grid gap-4 sm:grid-cols-2">{input("name", "Destination name", { required: true, maxLength: 200 })}{input("district", "District", { required: true, maxLength: 100 })}{input("province", "Province")}{input("best_season", "Best season")}{select("main_category", "Category", MAIN_CATEGORIES)}{select("difficulty_level", "Difficulty", DIFFICULTY_LEVELS)}{select("crowd_level", "Crowd level", CROWD_LEVELS)}{select("budget_level", "Budget level", BUDGET_LEVELS)}{input("latitude", "Latitude", { required: true, type: "number", step: 0.0001 })}{input("longitude", "Longitude", { required: true, type: "number", step: 0.0001 })}{input("image_url", "Image URL or data image")}{input("tags", "Tags (comma separated)")}{input("activities", "Activities")}{input("accessibility", "Accessibility")}{input("transportation", "Transportation")}{input("ratings", "Rating", { type: "number", step: 0.1 })}{input("popularity", "Popularity", { type: "number", step: 0.1 })}{input("attraction_total_reviews", "Dataset review total", { type: "number", min: 0 })}<label className="sm:col-span-2 text-sm font-semibold">Description<textarea value={String(form.description)} onChange={(event) => update("description", event.target.value)} className="mt-1 min-h-24 w-full rounded-lg border border-input p-2" /></label><label className="sm:col-span-2 flex items-center gap-3 rounded-xl bg-light-blue p-3 text-sm font-semibold"><input type="checkbox" checked={Boolean(form.is_featured)} onChange={(event) => update("is_featured", event.target.checked)} />Show in popular destinations</label></div><div className="mt-6 flex justify-end gap-2"><Button type="button" variant="outline" onClick={close}>Cancel</Button><Button type="submit">{editing ? "Save changes" : "Publish destination"}</Button></div></form></div>;
}