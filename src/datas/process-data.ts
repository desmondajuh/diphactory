// keep accent colors and step as static config — these are design decisions not content
export const PANEL_CONFIG = [
  { step: 1, accent: "#e63025" },
  { step: 2, accent: "#f4a261" },
  { step: 3, accent: "#2a9d8f" },
  { step: 4, accent: "#c77dff" },
];

// fallback panels if DB has no data
export const FALLBACK_PANELS = [
  {
    step: 1,
    label: "Book Your Session",
    sub: "Choose your preferred date and photography package. I'll confirm availability and lock in your booking.",
    tag: "Discovery",
    accent: "#e63025",
    imageUrl: "/images/gallery/2.jpg",
  },
  {
    step: 2,
    label: "Creative Direction",
    sub: "We align on mood boards, locations, wardrobe, and the visual language that tells your story.",
    tag: "Planning",
    accent: "#f4a261",
    imageUrl: "/images/gallery/3.jpg",
  },
  {
    step: 3,
    label: "The Shoot",
    sub: "A focused, immersive session where every frame is crafted with intention. You bring the energy.",
    tag: "Execution",
    accent: "#2a9d8f",
    imageUrl: "/images/gallery/4.jpg",
  },
  {
    step: 4,
    label: "Final Delivery",
    sub: "Retouched selects delivered in a private gallery within 7 days. Yours to keep, forever.",
    tag: "Delivery",
    accent: "#c77dff",
    imageUrl: "/images/gallery/5.jpg",
  },
];
