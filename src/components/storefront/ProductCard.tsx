import { useState } from "react";
import { Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ProductCardProps {
  id?: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
}

const ProductCard = ({ 
  name, 
  price, 
  originalPrice, 
  image,
  category, 
  isNew = false, 
  isSale = false 
}: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [imageZoomed, setImageZoomed] = useState(false);

  const discount = originalPrice 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;

  return (
    <>
      <div 
        className="group relative bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsQuickViewOpen(true)}
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
              <span className="bg-primary text-primary-foreground text-xs font-body font-medium px-3 py-1 rounded-full">
                New
              </span>
            )}
            {isSale && discount > 0 && (
              <span className="bg-accent text-accent-foreground text-xs font-body font-medium px-3 py-1 rounded-full">
                -{discount}%
              </span>
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
          <div className="flex items-center gap-2">
            <span className="font-body font-semibold text-foreground">
              ₹{price.toLocaleString()}
            </span>
            {originalPrice && (
              <span className="font-body text-sm text-muted-foreground line-through">
                ₹{originalPrice.toLocaleString()}
              </span>
            )}
          </div>
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
                  className="flex items-center gap-3 mb-6"
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
                  className="font-body text-muted-foreground mb-6 flex-1"
                >
                  A beautiful piece from our exclusive collection. Crafted with premium materials 
                  and traditional techniques for a perfect blend of style and comfort.
                </motion.p>

                {/* Badges */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="flex gap-2 mb-6"
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

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    className="w-full bg-gradient-to-r from-primary to-coral hover:from-primary/90 hover:to-coral/90 text-primary-foreground rounded-xl py-6 font-body font-semibold text-base shadow-lg"
                    onClick={() => setIsQuickViewOpen(false)}
                  >
                    View Full Details
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
