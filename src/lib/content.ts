export type Locale = "en" | "ar";

export const destinations = [
  {
    name: "Nile Valley",
    arabicName: "وادي النيل",
    region: "Luxor · Aswan",
    image:
      "https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=1200&q=85",
    description:
      "Sail between ancient temples, quiet villages, and the river landscapes that shaped Egypt.",
  },
  {
    name: "Red Sea",
    arabicName: "البحر الأحمر",
    region: "Hurghada · Marsa Alam",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=85",
    description:
      "Slow mornings, coral gardens, and desert horizons meet in Egypt's most vivid coastline.",
  },
  {
    name: "Sinai",
    arabicName: "سيناء",
    region: "Dahab · Saint Catherine",
    image:
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1200&q=85",
    description:
      "Trade the everyday for mountain trails, Bedouin hospitality, and clear desert skies.",
  },
];

export const trips = [
  {
    title: "The Slow Nile",
    arabicTitle: "رحلة النيل الهادئة",
    location: "Luxor to Aswan",
    duration: "5 days · 4 nights",
    date: "October 18–22, 2026",
    price: "EGP 24,500",
    deposit: "30% deposit",
    image:
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1200&q=85",
    status: "12 seats left",
  },
  {
    title: "Blue Hour Dahab",
    arabicTitle: "دهب في الساعة الزرقاء",
    location: "South Sinai",
    duration: "4 days · 3 nights",
    date: "November 6–9, 2026",
    price: "EGP 16,800",
    deposit: "30% deposit",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85",
    status: "Almost full",
  },
  {
    title: "Oasis After Dark",
    arabicTitle: "الواحة بعد الغروب",
    location: "Siwa Oasis",
    duration: "3 days · 2 nights",
    date: "December 12–14, 2026",
    price: "EGP 11,900",
    deposit: "25% deposit",
    image:
      "https://images.unsplash.com/photo-1489493585363-d69421e0edd3?auto=format&fit=crop&w=1200&q=85",
    status: "18 seats left",
  },
];

export const copy = {
  en: {
    nav: ["Destinations", "Journeys", "Stories", "Shop"],
    heroEyebrow: "Travel with intention",
    heroTitle: "Egypt, beyond the postcard.",
    heroBody:
      "Small-group journeys shaped by local knowledge, generous hospitality, and the places that stay with you.",
    explore: "Explore journeys",
    story: "Our story",
    searchPlaceholder: "Where do you want to go?",
    searchButton: "Find your journey",
  },
  ar: {
    nav: ["الوجهات", "الرحلات", "حكايات", "المتجر"],
    heroEyebrow: "سافر بإحساس",
    heroTitle: "مصر، أبعد من الصورة.",
    heroBody:
      "رحلات بمجموعات صغيرة، مستوحاة من المعرفة المحلية والضيافة الدافئة والأماكن التي لا تُنسى.",
    explore: "اكتشف الرحلات",
    story: "قصتنا",
    searchPlaceholder: "إلى أين تريد أن تذهب؟",
    searchButton: "ابحث عن رحلتك",
  },
} as const;
