export const MAIN_CATEGORIES = [
  { value: "natural", label: "Natural Attractions" },
  { value: "village_rural", label: "Village & Rural Tourism" },
  { value: "cultural_religious", label: "Cultural & Religious Sites" },
  { value: "urban_modern", label: "Urban & Modern Attractions" },
  { value: "trekking_adventure", label: "Trekking & Adventure" },
  { value: "wildlife_conservation", label: "Wildlife & Conservation" },
  { value: "wellness_relaxation", label: "Wellness & Relaxation" },
];

export const DIFFICULTY_LEVELS = [
  { value: "easy", label: "Easy" },
  { value: "moderate", label: "Moderate" },
  { value: "hard", label: "Hard" },
  { value: "very_hard", label: "Very Hard" },
];

export const CROWD_LEVELS = [
  { value: "very_low", label: "Very Low" },
  { value: "low", label: "Low" },
  { value: "moderate", label: "Moderate" },
  { value: "high", label: "High" },
  { value: "very_high", label: "Very High" },
];

export const BUDGET_LEVELS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];
export interface ProvinceInfo {
  value: string;
  label: string;
  description: string;
  image: string;
}

// `value` must match Destination.province exactly (case-insensitive match is
// handled server-side, but keep these matching the DB's actual casing).
export const PROVINCES: ProvinceInfo[] = [
  { value: "Koshi", label: "Koshi", description: "mountains, hills and eastern plains", image: "/images/koshi.png" },
  { value: "Madhesh", label: "Madhesh", description: "southern plains and Terai lowlands", image: "/images/madhesh.png" },
  { value: "Bagmati", label: "Bagmati", description: "Kathmandu valley, temples and central hills", image: "/images/bagmati.png" },
  { value: "Gandaki", label: "Gandaki", description: "Annapurna range, lakes and trekking trails", image: "/images/gandaki.png" },
  { value: "Lumbini", label: "Lumbini", description: "birthplace of Buddha and western plains", image: "/images/lumbini.jpg" },
  { value: "Karnali", label: "Karnali", description: "remote highlands and untouched wilderness", image: "/images/karnali.jpg" },
  { value: "Sudurpashchim", label: "Sudurpashchim", description: "far-western hills, lakes and forests", image: "/images/sudurpachim.jpg" },
];