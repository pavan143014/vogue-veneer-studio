export interface SubCategory {
  name: string;
  href: string;
}

export interface Category {
  name: string;
  href: string;
  subcategories: SubCategory[];
}

export const categories: Category[] = [
  {
    name: "Sarees",
    href: "/category/sarees",
    subcategories: [
      { name: "Silk Sarees", href: "/category/sarees/silk" },
      { name: "Cotton Sarees", href: "/category/sarees/cotton" },
      { name: "Banarasi Sarees", href: "/category/sarees/banarasi" },
      { name: "Kanjivaram Sarees", href: "/category/sarees/kanjivaram" },
      { name: "Georgette Sarees", href: "/category/sarees/georgette" },
      { name: "Chiffon Sarees", href: "/category/sarees/chiffon" },
    ],
  },
  {
    name: "Kurtis",
    href: "/category/kurtis",
    subcategories: [
      { name: "Anarkali Kurtis", href: "/category/kurtis/anarkali" },
      { name: "Straight Kurtis", href: "/category/kurtis/straight" },
      { name: "A-Line Kurtis", href: "/category/kurtis/a-line" },
      { name: "Chikankari Kurtis", href: "/category/kurtis/chikankari" },
      { name: "Cotton Kurtis", href: "/category/kurtis/cotton" },
      { name: "Party Wear Kurtis", href: "/category/kurtis/party-wear" },
    ],
  },
  {
    name: "Tops",
    href: "/category/tops",
    subcategories: [
      { name: "Crop Tops", href: "/category/tops/crop" },
      { name: "Tunics", href: "/category/tops/tunics" },
      { name: "Peplum Tops", href: "/category/tops/peplum" },
      { name: "Embroidered Tops", href: "/category/tops/embroidered" },
      { name: "Casual Tops", href: "/category/tops/casual" },
    ],
  },
  {
    name: "Bottomwear",
    href: "/category/bottomwear",
    subcategories: [
      { name: "Palazzos", href: "/category/bottomwear/palazzos" },
      { name: "Churidars", href: "/category/bottomwear/churidars" },
      { name: "Leggings", href: "/category/bottomwear/leggings" },
      { name: "Skirts", href: "/category/bottomwear/skirts" },
      { name: "Dhoti Pants", href: "/category/bottomwear/dhoti-pants" },
      { name: "Sharara", href: "/category/bottomwear/sharara" },
    ],
  },
  {
    name: "Blouses",
    href: "/category/blouses",
    subcategories: [
      { name: "Ready-made Blouses", href: "/category/blouses/ready-made" },
      { name: "Designer Blouses", href: "/category/blouses/designer" },
      { name: "Padded Blouses", href: "/category/blouses/padded" },
      { name: "Embroidered Blouses", href: "/category/blouses/embroidered" },
      { name: "Backless Blouses", href: "/category/blouses/backless" },
    ],
  },
  {
    name: "Lehengas",
    href: "/category/lehengas",
    subcategories: [
      { name: "Bridal Lehengas", href: "/category/lehengas/bridal" },
      { name: "Party Wear Lehengas", href: "/category/lehengas/party-wear" },
      { name: "Designer Lehengas", href: "/category/lehengas/designer" },
      { name: "Lehenga Choli", href: "/category/lehengas/choli" },
      { name: "Half Saree Lehengas", href: "/category/lehengas/half-saree" },
    ],
  },
  {
    name: "Nightwear",
    href: "/category/nightwear",
    subcategories: [
      { name: "Night Suits", href: "/category/nightwear/suits" },
      { name: "Nightgowns", href: "/category/nightwear/gowns" },
      { name: "Pyjama Sets", href: "/category/nightwear/pyjama-sets" },
      { name: "Loungewear", href: "/category/nightwear/loungewear" },
    ],
  },
  {
    name: "Wedding Collection",
    href: "/category/wedding",
    subcategories: [
      { name: "Bridal Sarees", href: "/category/wedding/bridal-sarees" },
      { name: "Bridal Lehengas", href: "/category/wedding/bridal-lehengas" },
      { name: "Reception Outfits", href: "/category/wedding/reception" },
      { name: "Sangeet Collection", href: "/category/wedding/sangeet" },
      { name: "Mehendi Collection", href: "/category/wedding/mehendi" },
      { name: "Guest Attire", href: "/category/wedding/guest" },
    ],
  },
];
