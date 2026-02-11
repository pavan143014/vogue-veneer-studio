import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Eye, ShoppingBag, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { toast } from "sonner";
import { Product } from "@/data/products";
import { useLocalCartStore } from "@/stores/localCartStore";

const COLOR_MAP: Record<string, string> = {
  red: "#DC2626", blue: "#2563EB", green: "#16A34A", black: "#000000",
  white: "#FFFFFF", yellow: "#EAB308", pink: "#EC4899", orange: "#EA580C",
  purple: "#9333EA", brown: "#92400E", grey: "#6B7280", gray: "#6B7280",
  navy: "#1E3A5F", maroon: "#800000", beige: "#D4C5A9", teal: "#0D9488",
  gold: "#D4AF37", cream: "#FFFDD0", coral: "#FF6B6B", plum: "#7B2D8E",
};

interface VariantStock {
  size?: string;
  color?: string;
  stock?: number;
}

interface ProductCardProps {
  id?: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
  sizes?: string[];
  colors?: { name: string; hex: string; image: string }[];
  variantStocks?: VariantStock[];
}

const ProductCard = ({ 
  id,
  name, 
  price, 
  originalPrice, 
  image,
  category, 
  isNew = false, 
  isSale = false,
  sizes = ["S", "M", "L", "XL"],
  colors = [],
  variantStocks = []
}: ProductCardProps) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [imageZoomed, setImageZoomed] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(colors[0]?.name || null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const { addItem } = useLocalCartStore();

  const discount = originalPrice 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;

  // Stock summary for badge
  const stockSummary = (() => {
    if (!variantStocks.length) return null;
    const outOfStock = variantStocks.filter(v => (v.stock ?? 0) === 0).length;
    const lowStock = variantStocks.filter(v => (v.stock ?? 0) > 0 && (v.stock ?? 0) <= 5).length;
    if (outOfStock === variantStocks.length) return "sold-out";
    if ((outOfStock + lowStock) / variantStocks.length >= 0.5) return "limited";
    return null;
  })();

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    setIsAddingToCart(true);
    
    // Create product object for cart
    const product: Product = {
      id: id || name.toLowerCase().replace(/\s+/g, '-'),
      name,
      price,
      originalPrice,
      image,
      category,
      isNew,
      isSale,
      description: "A beautiful piece from our exclusive collection.",
      details: [],
      sizes,
      colors,
      fabric: "",
      careInstructions: []
    };
    
    addItem({
      product,
      selectedSize,
      selectedColor: selectedColor || undefined,
      quantity
    });
    
    toast.success("Added to cart!", {
      description: `${name} - Size ${selectedSize} × ${quantity}`,
    });
    
    setIsAddingToCart(false);
    setIsQuickViewOpen(false);
    
    // Reset selections
    setQuantity(1);
    setSelectedSize(null);
  };

  return (
    <>
      <div 
        className="group relative bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          // Navigate to product detail page if id is provided
          if (id) {
            navigate(`/p/${id}`);
          } else {
            setIsQuickViewOpen(true);
          }
        }}
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] bg-gradient-to-br from-cream-dark to-muted overflow-hidden">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isNew && (
              <span className="bg-secondary text-secondary-foreground text-xs font-body font-semibold px-3 py-1.5 rounded-full shadow-md">
                ✨ New
              </span>
            )}
            {isSale && discount > 0 && (
              <motion.span 
                className="bg-destructive text-destructive-foreground text-sm font-body font-bold px-3 py-1.5 rounded-full shadow-lg"
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                -{discount}% OFF
              </motion.span>
            )}
            {stockSummary === "sold-out" && (
              <span className="bg-destructive text-destructive-foreground text-xs font-body font-semibold px-3 py-1.5 rounded-full shadow-md">
                Sold Out
              </span>
            )}
            {stockSummary === "limited" && (
              <motion.span
                className="bg-amber-500 text-white text-xs font-body font-semibold px-3 py-1.5 rounded-full shadow-md"
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🔥 Limited Stock
              </motion.span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="absolute top-3 right-3 w-9 h-9 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
          >
            <Heart 
              size={18} 
              className={`transition-colors ${isLiked ? "fill-primary text-primary" : "text-foreground"}`}
            />
          </button>

          {/* Quick Actions - Show on Hover */}
          <div 
            className={`absolute inset-x-3 bottom-3 flex gap-2 transition-all duration-300 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Button 
              size="sm" 
              className="flex-1 bg-primary hover:bg-primary/90 font-body text-xs"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsQuickViewOpen(true);
              }}
            >
              <Eye size={14} className="mr-1" />
              Quick View
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <p className="font-body text-xs text-muted-foreground uppercase tracking-wide mb-1">
            {category}
          </p>
          <h3 className="font-display text-lg font-medium text-foreground line-clamp-1 mb-2 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-body font-bold text-lg ${isSale ? 'text-destructive' : 'text-foreground'}`}>
              ₹{price.toLocaleString()}
            </span>
            {originalPrice && (
              <>
                <span className="font-body text-sm text-muted-foreground line-through">
                  ₹{originalPrice.toLocaleString()}
                </span>
                <span className="bg-accent/20 text-accent-foreground text-xs font-body font-semibold px-2 py-0.5 rounded">
                  Save ₹{(originalPrice - price).toLocaleString()}
                </span>
              </>
            )}
          </div>

          {/* Variant Stock Indicators */}
          {variantStocks.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {variantStocks.map((v, i) => {
                const inStock = (v.stock ?? 0) > 0;
                const lowStock = inStock && (v.stock ?? 0) <= 5;
                const colorHex = v.color ? COLOR_MAP[v.color.toLowerCase()] : undefined;
                const label = [v.size, v.color].filter(Boolean).join("/");
                if (!label) return null;
                return (
                  <span
                    key={`${v.size}-${v.color}-${i}`}
                    className={`inline-flex items-center gap-1 text-[10px] font-body font-medium px-1.5 py-0.5 rounded border ${
                      !inStock
                        ? "border-destructive/30 text-destructive bg-destructive/5 line-through"
                        : lowStock
                        ? "border-amber-500/30 text-amber-600 bg-amber-500/5"
                        : "border-border text-muted-foreground bg-muted/30"
                    }`}
                    title={
                      !inStock
                        ? `${label} - Out of stock`
                        : `${label} - ${v.stock} left`
                    }
                  >
                    {colorHex && (
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 border border-border/50"
                        style={{ backgroundColor: colorHex }}
                      />
                    )}
                    {v.size || v.color}
                    {lowStock && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                    {!inStock && <span className="w-1.5 h-1.5 rounded-full bg-destructive" />}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      <Dialog open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-card border-border rounded-3xl">
          <VisuallyHidden>
            <DialogTitle>Quick View - {name}</DialogTitle>
          </VisuallyHidden>
          
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="grid md:grid-cols-2 gap-0"
            >
              {/* Image Section */}
              <motion.div 
                className="relative bg-gradient-to-br from-muted to-ivory-dark overflow-hidden cursor-zoom-in"
                onClick={() => setImageZoomed(!imageZoomed)}
              >
                <motion.div
                  className="aspect-square"
                  animate={{ scale: imageZoomed ? 1.5 : 1 }}
                  transition={{ type: "spring", damping: 20, stiffness: 200 }}
                >
                  <img 
                    src={image} 
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                
                {/* Zoom Hint */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm text-xs font-body text-muted-foreground"
                >
                  Click to {imageZoomed ? "zoom out" : "zoom in"}
                </motion.div>
              </motion.div>

              {/* Details Section */}
              <div className="p-6 md:p-8 flex flex-col">
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-body text-sm text-muted-foreground uppercase tracking-wide mb-2"
                >
                  {category}
                </motion.p>
                
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4"
                >
                  {name}
                </motion.h2>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="flex items-center gap-3 mb-4"
                >
                  <span className="font-display text-2xl font-bold text-primary">
                    ₹{price.toLocaleString()}
                  </span>
                  {originalPrice && (
                    <>
                      <span className="font-body text-lg text-muted-foreground line-through">
                        ₹{originalPrice.toLocaleString()}
                      </span>
                      <span className="px-2 py-1 bg-accent/20 text-accent-foreground rounded-full text-xs font-body font-semibold">
                        {discount}% OFF
                      </span>
                    </>
                  )}
                </motion.div>

                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="font-body text-muted-foreground mb-4 text-sm"
                >
                  A beautiful piece from our exclusive collection. Crafted with premium materials 
                  and traditional techniques for a perfect blend of style and comfort.
                </motion.p>

                {/* Badges */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="flex gap-2 mb-4"
                >
                  {isNew && (
                    <span className="bg-primary/10 text-primary text-xs font-body font-medium px-3 py-1.5 rounded-full">
                      ✨ New Arrival
                    </span>
                  )}
                  {isSale && (
                    <span className="bg-accent/10 text-accent text-xs font-body font-medium px-3 py-1.5 rounded-full">
                      🔥 On Sale
                    </span>
                  )}
                </motion.div>

                {/* Size Selection */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-4"
                >
                  <p className="font-body font-semibold text-foreground mb-2 text-sm">Select Size:</p>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <motion.button
                        key={size}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg border-2 font-body text-sm transition-all ${
                          selectedSize === size
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Quantity */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="mb-6"
                >
                  <p className="font-body font-semibold text-foreground mb-2 text-sm">Quantity:</p>
                  <div className="flex items-center gap-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border-2 border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                    >
                      <Minus size={16} />
                    </motion.button>
                    <span className="w-12 text-center font-body font-semibold text-lg">
                      {quantity}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg border-2 border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                    >
                      <Plus size={16} />
                    </motion.button>
                  </div>
                </motion.div>

                {/* Add to Cart Button */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-auto"
                >
                  <Button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="w-full bg-gradient-to-r from-primary to-coral hover:from-primary/90 hover:to-coral/90 text-primary-foreground rounded-xl py-6 font-body font-semibold text-base shadow-lg"
                  >
                    <ShoppingBag size={18} className="mr-2" />
                    {isAddingToCart ? "Adding..." : "Add to Cart"}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductCard;
