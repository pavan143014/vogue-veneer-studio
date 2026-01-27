import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ShoppingBag, Plus, Minus, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useCartStore, ShopifyProduct } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface QuickViewModalProps {
  product: ShopifyProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuickViewModal = ({ product, isOpen, onClose }: QuickViewModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageZoomed, setImageZoomed] = useState(false);
  
  const { addItem, isLoading } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  
  if (!product) return null;
  
  const { node } = product;
  const images = node.images?.edges || [];
  const variants = node.variants?.edges || [];
  const selectedVariant = variants[selectedVariantIndex]?.node;
  const currentImage = images[currentImageIndex]?.node;
  const isLiked = isInWishlist(node.id);
  
  const price = selectedVariant 
    ? parseFloat(selectedVariant.price.amount)
    : parseFloat(node.priceRange.minVariantPrice.amount);
  const currencyCode = selectedVariant 
    ? selectedVariant.price.currencyCode 
    : node.priceRange.minVariantPrice.currencyCode;

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    await addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity,
      selectedOptions: selectedVariant.selectedOptions || []
    });

    toast.success("Added to cart!", {
      description: `${node.title} × ${quantity}`,
    });
    
    onClose();
  };

  const handleWishlistToggle = () => {
    const added = toggleItem(product);
    toast.success(added ? "Added to wishlist" : "Removed from wishlist", {
      description: node.title,
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-card border-border rounded-3xl">
        <VisuallyHidden>
          <DialogTitle>Quick View - {node.title}</DialogTitle>
        </VisuallyHidden>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="grid md:grid-cols-2 gap-0"
          >
            {/* Image Section */}
            <div className="relative bg-gradient-to-br from-muted to-ivory-dark overflow-hidden">
              <motion.div
                className="relative aspect-square cursor-zoom-in"
                onClick={() => setImageZoomed(!imageZoomed)}
                animate={{ scale: imageZoomed ? 1.5 : 1 }}
                transition={{ type: "spring", damping: 20, stiffness: 200 }}
              >
                {currentImage ? (
                  <motion.img
                    key={currentImageIndex}
                    src={currentImage.url}
                    alt={currentImage.altText || node.title}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gradient-to-br from-coral/10 to-gold/10">
                    <ShoppingBag size={64} className="text-muted-foreground/50" />
                  </div>
                )}
              </motion.div>

              {/* Image Navigation */}
              {images.length > 1 && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors shadow-lg"
                  >
                    <ChevronLeft size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors shadow-lg"
                  >
                    <ChevronRight size={20} />
                  </motion.button>

                  {/* Image Dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex ? "bg-primary" : "bg-background/60"
                        }`}
                        whileHover={{ scale: 1.3 }}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Wishlist Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleWishlistToggle}
                className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                  isLiked 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-background/90 backdrop-blur-sm text-foreground hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                <Heart size={20} className={isLiked ? "fill-current" : ""} />
              </motion.button>

              {/* Zoom Hint */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm text-xs font-body text-muted-foreground"
              >
                Click to {imageZoomed ? "zoom out" : "zoom in"}
              </motion.div>
            </div>

            {/* Details Section */}
            <div className="p-6 md:p-8 flex flex-col">
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors z-10 md:flex hidden"
              >
                <X size={20} />
              </motion.button>

              {/* Rating */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-1 mb-3"
              >
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
                <span className="font-body text-sm text-muted-foreground ml-2">(4.9 rating)</span>
              </motion.div>

              {/* Title */}
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3"
              >
                {node.title}
              </motion.h2>

              {/* Price */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 mb-4"
              >
                <span className="font-display text-2xl font-bold text-primary">
                  {currencyCode} {price.toFixed(2)}
                </span>
                <span className="font-body text-lg text-muted-foreground line-through">
                  {currencyCode} {(price * 1.3).toFixed(2)}
                </span>
                <span className="px-2 py-1 bg-accent/20 text-accent-foreground rounded-full text-xs font-body font-semibold">
                  23% OFF
                </span>
              </motion.div>

              {/* Description */}
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="font-body text-muted-foreground mb-6 line-clamp-3"
              >
                {node.description || "A beautiful piece from our exclusive collection. Perfect for any occasion."}
              </motion.p>

              {/* Variants */}
              {variants.length > 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6"
                >
                  <p className="font-body font-semibold text-foreground mb-3">Select Option:</p>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((variant, index) => (
                      <motion.button
                        key={variant.node.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedVariantIndex(index)}
                        disabled={!variant.node.availableForSale}
                        className={`px-4 py-2 rounded-xl border-2 font-body text-sm transition-all ${
                          selectedVariantIndex === index
                            ? "border-primary bg-primary/10 text-primary"
                            : variant.node.availableForSale
                            ? "border-border hover:border-primary/50"
                            : "border-border bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
                        }`}
                      >
                        {variant.node.title}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Quantity */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mb-6"
              >
                <p className="font-body font-semibold text-foreground mb-3">Quantity:</p>
                <div className="flex items-center gap-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-xl border-2 border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                  >
                    <Minus size={16} />
                  </motion.button>
                  <span className="w-14 text-center font-body font-semibold text-lg">
                    {quantity}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-xl border-2 border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                  >
                    <Plus size={16} />
                  </motion.button>
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex gap-3 mt-auto"
              >
                <Button
                  onClick={handleAddToCart}
                  disabled={isLoading || !selectedVariant?.availableForSale}
                  className="flex-1 bg-gradient-to-r from-primary to-coral hover:from-primary/90 hover:to-coral/90 text-primary-foreground rounded-xl py-6 font-body font-semibold text-base shadow-lg"
                >
                  <ShoppingBag size={18} className="mr-2" />
                  {isLoading ? "Adding..." : selectedVariant?.availableForSale ? "Add to Cart" : "Out of Stock"}
                </Button>
              </motion.div>

              {/* View Full Details Link */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 text-center"
              >
                <Link 
                  to={`/product/${node.handle}`}
                  onClick={onClose}
                  className="font-body text-sm text-primary hover:underline"
                >
                  View Full Product Details →
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;
