export interface Product {
  id: string;
  name: string;
  slug: string;
  category: "earrings" | "rings";
  collection: string;
  price: number;
  metalType: string;
  finish: string;
  size: string;
  description: string;
  images: string[];
}

// We'll import images in the components directly
export const products: Product[] = [
  {
    id: "1",
    name: "Antique Hoop Earring",
    slug: "antique-hoop-earring",
    category: "earrings",
    collection: "ADIVA",
    price: 499,
    metalType: "Gilat (White Metal)",
    finish: "Antique Finish",
    size: "2 inch",
    description: "Traditional Gond-inspired hoop earrings featuring raw metal textures and rhythmic details. Perfect for both Indian attire and Indo-western styles.",
    images: [],
  },
  {
    id: "2",
    name: "Antique 25P Earring",
    slug: "antique-25p-earring",
    category: "earrings",
    collection: "ADIVA",
    price: 529,
    metalType: "Gilat (White Metal)",
    finish: "Antique Finish",
    size: "3 inch",
    description: "Statement earrings with aged coin-inspired detailing. A bold yet grounded aesthetic for those who wear culture with confidence.",
    images: [],
  },
  {
    id: "3",
    name: "Adiva Ghungroo Earring",
    slug: "adiva-ghungroo-earring",
    category: "earrings",
    collection: "ADIVA",
    price: 299,
    metalType: "Gilat (White Metal)",
    finish: "Antique Finish",
    size: "1.8 inch",
    description: "Delicate ghungroo-inspired earrings that blend tribal artistry with modern elegance.",
    images: [],
  },
  {
    id: "4",
    name: "Adiva 25P/50P Ring",
    slug: "adiva-25p-50p-ring",
    category: "rings",
    collection: "ADIVA",
    price: 759,
    metalType: "Gilat (White Metal)",
    finish: "Antique Finish",
    size: "Adjustable",
    description: "Bold coin-inspired statement ring with raw textures and indigenous craftsmanship.",
    images: [],
  },
  {
    id: "5",
    name: "Adiva Phool Ring",
    slug: "adiva-phool-ring",
    category: "rings",
    collection: "ADIVA",
    price: 649,
    metalType: "Gilat (White Metal)",
    finish: "Antique Finish",
    size: "Adjustable",
    description: "Floral-inspired statement ring with intricate petal detailing and aged finish.",
    images: [],
  },
  {
    id: "6",
    name: "Khanak Sikka Ring",
    slug: "khanak-sikka-ring",
    category: "rings",
    collection: "ADIVA",
    price: 399,
    metalType: "Gilat (White Metal)",
    finish: "Antique Finish",
    size: "Adjustable",
    description: "A grounded ring featuring clustered bead work and coin motifs rooted in tribal aesthetics.",
    images: [],
  },
  {
    id: "7",
    name: "Spiral Khanak Ring",
    slug: "spiral-khanak-ring",
    category: "rings",
    collection: "ADIVA",
    price: 499,
    metalType: "Gilat (White Metal)",
    finish: "Antique Finish",
    size: "Adjustable",
    description: "Spiral band ring with ghungroo accents. A statement piece that feels bold yet grounded.",
    images: [],
  },
  {
    id: "8",
    name: "Spring Ghungroo Ring",
    slug: "spring-ghungroo-ring",
    category: "rings",
    collection: "ADIVA",
    price: 349,
    metalType: "Gilat (White Metal)",
    finish: "Gold Finish",
    size: "Adjustable",
    description: "Playful spring-coiled ring with ghungroo clusters in a warm gold finish.",
    images: [],
  },
  {
    id: "9",
    name: "Mini Ghungroo Ring",
    slug: "mini-ghungroo-ring",
    category: "rings",
    collection: "ADIVA",
    price: 399,
    metalType: "Gilat (White Metal)",
    finish: "Antique Finish",
    size: "Adjustable",
    description: "Compact ghungroo ring with coin-inspired detailing. Stackable and photo-friendly.",
    images: [],
  },
];
