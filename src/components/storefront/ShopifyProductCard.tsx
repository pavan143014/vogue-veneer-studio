import { Heart, ShoppingBag, Star, Eye } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore, ShopifyProduct } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { toast } from "sonner";
import QuickViewModal from "./QuickViewModal";

interface ShopifyProductCardProps {
  product: ShopifyProduct;
}

const ShopifyProductCard = ({ product }: ShopifyProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const isLiked = isInWishlist(product.node.id);
  const { addItem, isLoading } = useCartStore();

  const { node } = product;
  const imageUrl = node.images?.edges?.[0]?.node?.url;
  const price = parseFloat(node.priceRange.minVariantPrice.amount);
  const currencyCode = node.priceRange.minVariantPrice.currencyCode;
  const firstVariant = node.variants?.edges?.[0]?.node;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!firstVariant) {
      toast.error("This product is not available");
      return;
    }

    await addItem({
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions || []
    });

    toast.success("Added to cart!", {
      description: node.title,
    });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <div 
        className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleQuickView}
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] bg-gradient-to-br from-muted to-ivory-dark overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={node.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gradient-to-br from-coral/10 to-gold/10">
              <ShoppingBag size={48} className="text-muted-foreground/50" />
            </div>
          )}

          {/* Gradient overlay on hover */}
          <div className={`absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

          {/* Sale badge */}
          <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-body font-semibold shadow-lg">
            NEW
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const added = toggleItem(product);
              toast.success(added ? "Added to wishlist" : "Removed from wishlist", {
                description: node.title,
              });
            }}
            className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              isLiked 
                ? "bg-primary text-primary-foreground" 
                : "bg-background/90 backdrop-blur-sm text-foreground hover:bg-primary hover:text-primary-foreground"
            }`}
          >
            <Heart 
              size={18} 
              className={isLiked ? "fill-current" : ""}
            />
          </button>

          {/* Quick Actions - Always visible on mobile, hover on desktop */}
          <div 
            className={`absolute inset-x-4 bottom-4 flex gap-2 transition-all duration-300 md:opacity-0 md:translate-y-4 ${
              isHovered ? "md:opacity-100 md:translate-y-0" : ""
            }`}
          >
            <Button 
              size="lg" 
              variant="secondary"
              className="flex-1 bg-background/95 backdrop-blur-sm hover:bg-background font-body text-xs md:text-sm font-semibold shadow-2xl py-2 md:py-3"
              onClick={handleQuickView}
            >
              <Eye size={16} className="mr-1.5" />
              Quick View
            </Button>
            <Button 
              size="lg" 
              className="flex-1 bg-primary hover:bg-primary/90 font-body text-xs md:text-sm font-semibold shadow-2xl py-2 md:py-3"
              onClick={handleAddToCart}
              disabled={isLoading || !firstVariant?.availableForSale}
            >
              <ShoppingBag size={16} className="mr-1.5" />
              Add
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 md:p-5">
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
            ))}
            <span className="font-body text-xs text-muted-foreground ml-1">(4.9)</span>
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground line-clamp-1 mb-2 group-hover:text-primary transition-colors">
            {node.title}
          </h3>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-body font-bold text-lg text-foreground">
                {currencyCode} {price.toFixed(2)}
              </span>
              <span className="font-body text-sm text-muted-foreground line-through">
                {currencyCode} {(price * 1.3).toFixed(2)}
              </span>
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">
              23% OFF
            </span>
          </div>
          
          {/* Always Visible Add to Cart Button */}
          <Button 
            className="w-full bg-primary hover:bg-primary/90 font-body text-sm font-semibold shadow-md transition-all duration-300 hover:shadow-lg active:scale-[0.98]"
            onClick={handleAddToCart}
            disabled={isLoading || !firstVariant?.availableForSale}
          >
            <ShoppingBag size={16} className="mr-2" />
            {isLoading ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal 
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
};

export default ShopifyProductCard;
