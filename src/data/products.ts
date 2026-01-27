// Product data store
import anarkaliKurthi from "@/assets/products/anarkali-kurthi.jpg";
import cottonDress from "@/assets/products/cotton-dress.jpg";
import silkKurthi from "@/assets/products/silk-kurthi.jpg";
import chikankariKurthi from "@/assets/products/chikankari-kurthi.jpg";
import georgetteDress from "@/assets/products/georgette-dress.jpg";
import blockPrintKurthi from "@/assets/products/block-print-kurthi.jpg";
import mirrorWorkDress from "@/assets/products/mirror-work-dress.jpg";
import rayonKurthi from "@/assets/products/rayon-kurthi.jpg";

export interface ColorVariant {
  name: string;
  hex: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
  description: string;
  details: string[];
  sizes: string[];
  colors: ColorVariant[];
  fabric: string;
  careInstructions: string[];
}

export const products: Product[] = [
  {
    id: "anarkali-kurthi-1",
    name: "Embroidered Anarkali Kurthi",
    price: 1499,
    originalPrice: 2499,
    image: anarkaliKurthi,
    category: "Kurthis",
    isNew: true,
    isSale: true,
    description: "Elevate your ethnic wardrobe with this stunning embroidered Anarkali kurthi. Featuring intricate threadwork and a flowing silhouette, this piece is perfect for festive occasions and celebrations.",
    details: [
      "Intricate gold embroidery on bodice and hem",
      "Flowing Anarkali silhouette",
      "3/4 sleeves with embroidered cuffs",
      "Round neckline with delicate detailing",
      "Comes with matching dupatta"
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Rose Pink", hex: "#F4B4C4", image: anarkaliKurthi },
      { name: "Royal Blue", hex: "#1E40AF", image: anarkaliKurthi },
      { name: "Emerald Green", hex: "#047857", image: anarkaliKurthi },
      { name: "Burgundy", hex: "#722F37", image: anarkaliKurthi },
    ],
    fabric: "Premium Georgette with Net dupatta",
    careInstructions: [
      "Dry clean only",
      "Store in a cool, dry place",
      "Iron on low heat"
    ]
  },
  {
    id: "cotton-dress-1",
    name: "Cotton Printed A-Line Dress",
    price: 1299,
    image: cottonDress,
    category: "Dresses",
    isNew: true,
    description: "A beautiful A-line dress in rich burgundy with traditional gold block prints. This versatile piece transitions effortlessly from day to evening wear.",
    details: [
      "Traditional block print pattern",
      "Comfortable A-line fit",
      "Elbow-length sleeves",
      "V-neckline with button detail",
      "Side pockets for convenience"
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Burgundy", hex: "#722F37", image: cottonDress },
      { name: "Navy Blue", hex: "#1E3A5F", image: cottonDress },
      { name: "Olive Green", hex: "#556B2F", image: cottonDress },
    ],
    fabric: "100% Premium Cotton",
    careInstructions: [
      "Machine wash cold",
      "Do not bleach",
      "Tumble dry low"
    ]
  },
  {
    id: "silk-kurthi-1",
    name: "Silk Blend Festive Kurthi",
    price: 2199,
    originalPrice: 2999,
    image: silkKurthi,
    category: "Festive",
    isSale: true,
    description: "Make a statement with this luxurious silk blend kurthi featuring exquisite gold embroidery. Perfect for weddings, festivals, and special occasions.",
    details: [
      "Rich rose pink silk blend fabric",
      "Heavy gold zari embroidery",
      "Elegant V-neckline",
      "Full sleeves with embroidered cuffs",
      "Includes coordinated pants"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Rose Pink", hex: "#C9184A", image: silkKurthi },
      { name: "Gold", hex: "#D4A574", image: silkKurthi },
      { name: "Teal", hex: "#0D9488", image: silkKurthi },
      { name: "Purple", hex: "#7C3AED", image: silkKurthi },
    ],
    fabric: "Silk Blend with Zari work",
    careInstructions: [
      "Dry clean only",
      "Store flat or hang",
      "Avoid direct sunlight"
    ]
  },
  {
    id: "chikankari-kurthi-1",
    name: "Casual Chikankari Kurthi",
    price: 999,
    image: chikankariKurthi,
    category: "Kurthis",
    description: "Classic Lucknowi Chikankari work on pure white cotton. This elegant kurthi is perfect for everyday wear while maintaining traditional charm.",
    details: [
      "Authentic Chikankari embroidery",
      "Comfortable straight fit",
      "3/4 sleeves",
      "Mandarin collar",
      "Side slits for ease of movement"
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "White", hex: "#FFFFFF", image: chikankariKurthi },
      { name: "Light Pink", hex: "#FBD5E0", image: chikankariKurthi },
      { name: "Sky Blue", hex: "#87CEEB", image: chikankariKurthi },
      { name: "Mint Green", hex: "#98FB98", image: chikankariKurthi },
    ],
    fabric: "100% Cotton",
    careInstructions: [
      "Hand wash recommended",
      "Use mild detergent",
      "Iron while damp"
    ]
  },
  {
    id: "georgette-dress-1",
    name: "Georgette Floor Length Dress",
    price: 2499,
    image: georgetteDress,
    category: "Dresses",
    isNew: true,
    description: "A stunning floor-length dress in warm gold georgette. The flowing silhouette and elegant detailing make this perfect for evening events.",
    details: [
      "Flowing floor-length design",
      "Cinched waist with embellished belt",
      "Balloon sleeves",
      "High collar with silver detailing",
      "Fully lined"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Mustard Gold", hex: "#E3A857", image: georgetteDress },
      { name: "Coral", hex: "#FF6F61", image: georgetteDress },
      { name: "Sage Green", hex: "#9CAF88", image: georgetteDress },
    ],
    fabric: "Premium Georgette",
    careInstructions: [
      "Dry clean only",
      "Store on padded hanger",
      "Steam to remove wrinkles"
    ]
  },
  {
    id: "block-print-kurthi-1",
    name: "Block Print Cotton Kurthi",
    price: 899,
    originalPrice: 1299,
    image: blockPrintKurthi,
    category: "Casual",
    isSale: true,
    description: "Traditional hand block printed kurthi in earthy tones. A comfortable everyday option that celebrates Indian textile heritage.",
    details: [
      "Hand block printed design",
      "Relaxed straight fit",
      "Short sleeves",
      "Notched neckline",
      "Comes with palazzo pants"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Beige", hex: "#E8DCC4", image: blockPrintKurthi },
      { name: "Rust", hex: "#B7410E", image: blockPrintKurthi },
      { name: "Indigo", hex: "#3F51B5", image: blockPrintKurthi },
      { name: "Terracotta", hex: "#E2725B", image: blockPrintKurthi },
    ],
    fabric: "Pure Cotton",
    careInstructions: [
      "Wash separately first time",
      "Machine wash cold",
      "Line dry in shade"
    ]
  },
  {
    id: "mirror-work-dress-1",
    name: "Mirror Work Party Dress",
    price: 3299,
    image: mirrorWorkDress,
    category: "Festive",
    isNew: true,
    description: "A showstopping party dress featuring intricate mirror work and silver embellishments. Perfect for celebrations and festive occasions.",
    details: [
      "Exquisite mirror work throughout",
      "Silver thread embroidery",
      "Fitted bodice with flared skirt",
      "Full sleeves with sheer detail",
      "Tulle underskirt for volume"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Maroon", hex: "#722F37", image: mirrorWorkDress },
      { name: "Midnight Blue", hex: "#191970", image: mirrorWorkDress },
      { name: "Black", hex: "#1A1A1A", image: mirrorWorkDress },
    ],
    fabric: "Net with Satin lining",
    careInstructions: [
      "Professional dry clean only",
      "Handle with care",
      "Store in garment bag"
    ]
  },
  {
    id: "rayon-kurthi-1",
    name: "Rayon Daily Wear Kurthi",
    price: 699,
    image: rayonKurthi,
    category: "Casual",
    description: "A soft and comfortable rayon kurthi in a beautiful blush pink. Perfect for daily wear with effortless style and comfort.",
    details: [
      "Soft rayon fabric",
      "Relaxed A-line fit",
      "3/4 sleeves",
      "Button placket detail",
      "Curved hem"
    ],
    sizes: ["S", "M", "L", "XL", "XXL", "3XL"],
    colors: [
      { name: "Blush Pink", hex: "#F8B4C4", image: rayonKurthi },
      { name: "Lavender", hex: "#E6E6FA", image: rayonKurthi },
      { name: "Peach", hex: "#FFDAB9", image: rayonKurthi },
      { name: "Powder Blue", hex: "#B0E0E6", image: rayonKurthi },
      { name: "Mint", hex: "#98FF98", image: rayonKurthi },
    ],
    fabric: "Premium Rayon",
    careInstructions: [
      "Machine wash cold",
      "Do not wring",
      "Iron on medium heat"
    ]
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id);
};
