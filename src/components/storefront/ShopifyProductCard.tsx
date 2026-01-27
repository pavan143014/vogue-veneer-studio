import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
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
        className="group relative bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] bg-gradient-to-br from-cream-dark to-muted overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={node.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <ShoppingBag size={48} />
            </div>
          )}

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

          {/* Quick Add to Cart - Show on Hover */}
          <div 
            className={`absolute inset-x-3 bottom-3 flex gap-2 transition-all duration-300 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Button 
              size="sm" 
              className="flex-1 bg-primary hover:bg-primary/90 font-body text-xs"
              onClick={handleAddToCart}
              disabled={isLoading || !firstVariant?.availableForSale}
            >
              <ShoppingBag size={14} className="mr-1" />
              {firstVariant?.availableForSale ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-display text-lg font-medium text-foreground line-clamp-1 mb-2 group-hover:text-primary transition-colors">
            {node.title}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-body font-semibold text-foreground">
              {currencyCode} {price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ShopifyProductCard;
