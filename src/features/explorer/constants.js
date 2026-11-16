// Tags the explorer checks on every place. `key` is the real OpenStreetMap tag.
export const OSM_FIELDS = [
  { key: "wheelchair", label: "Wheelchair Access", icon: "♿" },
  { key: "internet_access", label: "Wi-Fi Available", icon: "📶" },
  { key: "outdoor_seating", label: "Outdoor Patio", icon: "🌿" },
  { key: "socket", label: "Power Sockets", icon: "🔌" },
  { key: "air_conditioning", label: "Air Conditioning", icon: "❄️" },
  { key: "toilets", label: "Restroom Facility", icon: "🚻" },
];

export const CATEGORIES = [
  { value: "cafe", label: "☕ Café & Coffee House" },
  { value: "restaurant", label: "🍽️ Restaurant & Dining" },
  { value: "coworking_space", label: "💻 Coworking & Work Hub" },
  { value: "pharmacy", label: "💊 Pharmacy & Chemist" },
  { value: "library", label: "📚 Public Library" },
  { value: "pub", label: "🍺 Pub & Bar" },
  { value: "bakery", label: "🥐 Bakery" },
  { value: "gym", label: "🏋️ Gym & Fitness Center" },
];

export const PRESETS = [
  { label: "Bengaluru", value: "Indiranagar, Bengaluru" },
  { label: "London Soho", value: "Soho, London" },
  { label: "Berlin Mitte", value: "Mitte, Berlin" },
  { label: "Tokyo Shibuya", value: "Shibuya, Tokyo" },
  { label: "New York", value: "Williamsburg, New York" },
];

export const SORT_OPTIONS = [
  { value: "distance", label: "Nearest first" },
  { value: "completeness_desc", label: "Most complete" },
  { value: "missing_desc", label: "Most missing tags" },
  { value: "name_asc", label: "Name (A–Z)" },
];

export const DEFAULT_CENTER = { lat: 12.9784, lon: 77.6408, label: "Indiranagar, Bengaluru" };

export const DEFAULT_FORM = { query: DEFAULT_CENTER.label, category: "cafe", radius: 800 };

// Offline demo data (Indiranagar, Bengaluru). Not verified real-world information.
export const SAMPLE_PLACES = [
  { type: "node", id: 101, lat: 12.9784, lon: 77.6408, tags: { name: "Third Wave Coffee Roasters", amenity: "cafe", wheelchair: "yes", internet_access: "wlan", outdoor_seating: "yes", socket: "yes", air_conditioning: "yes", toilets: "yes" } },
  { type: "node", id: 102, lat: 12.9752, lon: 77.6425, tags: { name: "Filter Kaapi Cultural Corner", amenity: "cafe", wheelchair: "no", outdoor_seating: "yes", socket: "no" } },
  { type: "node", id: 103, lat: 12.9799, lon: 77.6385, tags: { name: "The Page & Brew Workspace", amenity: "cafe", internet_access: "wlan", socket: "yes", air_conditioning: "yes" } },
  { type: "node", id: 104, lat: 12.9731, lon: 77.6391, tags: { name: "Greenleaf Organic Bistro", amenity: "restaurant", wheelchair: "yes", outdoor_seating: "no", internet_access: "no", toilets: "yes" } },
  { type: "node", id: 105, lat: 12.9772, lon: 77.645, tags: { name: "The Quiet Cup Library Café", amenity: "cafe" } },
  { type: "node", id: 106, lat: 12.974, lon: 77.6432, tags: { name: "Terrace 12 Artisanal Bakery", amenity: "bakery", wheelchair: "limited", internet_access: "wlan", outdoor_seating: "yes", socket: "yes" } },
  { type: "node", id: 107, lat: 12.981, lon: 77.6415, tags: { name: "Apollo 24/7 Chemist & Care", amenity: "pharmacy", wheelchair: "yes", air_conditioning: "yes" } },
  { type: "node", id: 108, lat: 12.9765, lon: 77.636, tags: { name: "Indiranagar Reading & Public Library", amenity: "library", wheelchair: "yes", internet_access: "wlan", toilets: "yes" } },
];
