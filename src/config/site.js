// Central place for content you are likely to tweak.

// Page background photograph.
// Currently loaded from Pexels (free to use). To use your own photo instead,
// save it as public/images/hero.jpg and set this to "/images/hero.jpg".
export const HERO_PHOTO =
  "https://images.pexels.com/photos/2996211/pexels-photo-2996211.jpeg?auto=compress&cs=tinysrgb&w=1920";

export const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#how", label: "How It Works" },
  { href: "#explore", label: "Explore Map" },
  { href: "#journeys", label: "Journeys" },
  { href: "#about", label: "About" },
];

export const STATS = [
  { icon: "👥", target: 10, suffix: "K+", label: "Active Users" },
  { icon: "🚗", target: 5, suffix: "K+", label: "Rides Shared" },
  { icon: "📦", target: 3, suffix: "K+", label: "Parcels Delivered" },
  { icon: "🌱", target: 40, suffix: "%", label: "Lower Emissions", green: true },
];

// Illustrative demo route shown on the hero map (Koramangala → Electronic City).
export const HERO_ROUTE = {
  from: { name: "Koramangala", coords: [12.9352, 77.6245] },
  to: { name: "Electronic City", coords: [12.8452, 77.6602] },
  via: "Hosur Road",
  path: [
    [12.9352, 77.6245],
    [12.9177, 77.6233],
    [12.9075, 77.6237],
    [12.8930, 77.6407],
    [12.8770, 77.6480],
    [12.8452, 77.6602],
  ],
};

export const MAP_TILES = {
  url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
};
