import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore, ShopifyProduct } from "@/stores/cartStore";
import { toast } from "sonner";

interface ShopifyProductCardProps {
  product: ShopifyProduct;
}

const ShopifyProductCard = ({ product }: ShopifyProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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

  return (
    <Link to={`/product/${node.handle}`}>
      <div 
        className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
              setIsLiked(!isLiked);
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

          {/* Quick Add to Cart - Show on Hover */}
          <div 
            className={`absolute inset-x-4 bottom-4 transition-all duration-300 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Button 
              size="lg" 
              className="w-full bg-primary hover:bg-primary/90 font-body text-sm font-semibold shadow-2xl"
              onClick={handleAddToCart}
              disabled={isLoading || !firstVariant?.availableForSale}
            >
              <ShoppingBag size={16} className="mr-2" />
              {firstVariant?.availableForSale ? "Add to Cart" : "Out of Stock"}
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
          <div className="flex items-center gap-2">
            <span className="font-body font-bold text-lg text-foreground">
              {currencyCode} {price.toFixed(2)}
            </span>
            <span className="font-body text-sm text-muted-foreground line-through">
              {currencyCode} {(price * 1.3).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ShopifyProductCard;
