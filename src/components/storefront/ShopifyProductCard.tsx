import { Heart, ShoppingBag, Star, Eye, Check, Zap } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore, ShopifyProduct } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { toast } from "sonner";
import QuickViewModal from "./QuickViewModal";
import { cn } from "@/lib/utils";
import { createShopifyCartForCheckout } from "@/lib/shopify";

interface ShopifyProductCardProps {
  product: ShopifyProduct;
}

// Color mapping for visual swatches
const colorMap: Record<string, string> = {
  "red": "bg-red-500",
  "burgundy red": "bg-red-800",
  "royal blue": "bg-blue-700",
  "blue": "bg-blue-500",
  "navy": "bg-blue-900",
  "green": "bg-green-500",
  "emerald green": "bg-emerald-600",
  "olive green": "bg-olive",
  "black": "bg-gray-900",
  "white": "bg-white border-2 border-gray-300",
  "cream": "bg-amber-50 border border-gray-200",
  "ivory": "bg-amber-50 border border-gray-200",
  "beige": "bg-amber-100",
  "gold": "bg-yellow-500",
  "golden": "bg-yellow-500",
  "silver": "bg-gray-300",
  "pink": "bg-pink-400",
  "rose": "bg-rose-400",
  "purple": "bg-purple-500",
  "maroon": "bg-red-900",
  "yellow": "bg-yellow-400",
  "orange": "bg-orange-500",
  "brown": "bg-amber-700",
  "grey": "bg-gray-500",
  "gray": "bg-gray-500",
  "teal": "bg-teal-500",
  "turquoise": "bg-cyan-400",
  "multi": "bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500",
  "multicolor": "bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500",
};

const getColorClass = (colorName: string): string => {
  const lowerColor = colorName.toLowerCase();
  return colorMap[lowerColor] || "bg-gradient-to-br from-coral/50 to-gold/50";
};

const ShopifyProductCard = ({ product }: ShopifyProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const isLiked = isInWishlist(product.node.id);
  const { addItem, isLoading } = useCartStore();

  const { node } = product;
  const imageUrl = node.images?.edges?.[0]?.node?.url;
  const currencyCode = node.priceRange.minVariantPrice.currencyCode;

  // Get product options (size, color, etc.)
  const productOptions = useMemo(() => {
    return node.options?.filter(opt => opt.name.toLowerCase() !== "title") || [];
  }, [node.options]);

  // Initialize selected options with first values
  useMemo(() => {
    if (Object.keys(selectedOptions).length === 0 && productOptions.length > 0) {
      const initialOptions: Record<string, string> = {};
      productOptions.forEach(opt => {
        if (opt.values.length > 0) {
          initialOptions[opt.name] = opt.values[0];
        }
      });
      setSelectedOptions(initialOptions);
    }
  }, [productOptions, selectedOptions]);

  // Find the variant that matches selected options
  const selectedVariant = useMemo(() => {
    if (!node.variants?.edges) return null;
    
    return node.variants.edges.find(({ node: variant }) => {
      if (!variant.selectedOptions) return false;
      return variant.selectedOptions.every(opt => 
        selectedOptions[opt.name] === opt.value
      );
    })?.node || node.variants.edges[0]?.node;
  }, [node.variants, selectedOptions]);

  const price = selectedVariant 
    ? parseFloat(selectedVariant.price.amount) 
    : parseFloat(node.priceRange.minVariantPrice.amount);

  const handleOptionSelect = (optionName: string, value: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedOptions(prev => ({ ...prev, [optionName]: value }));
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!selectedVariant) {
      toast.error("Please select all options");
      return;
    }

    await addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || []
    });

    toast.success("Added to cart!", {
      description: `${node.title} - ${Object.values(selectedOptions).join(", ")}`,
    });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!selectedVariant) {
      toast.error("Please select all options");
      return;
    }

    setIsBuyingNow(true);
    try {
      const result = await createShopifyCartForCheckout({
        variantId: selectedVariant.id,
        quantity: 1
      });
      
      if (result?.checkoutUrl) {
        window.open(result.checkoutUrl, '_blank');
      } else {
        toast.error("Failed to create checkout");
      }
    } catch (error) {
      console.error('Buy now error:', error);
      toast.error("Failed to proceed to checkout");
    } finally {
      setIsBuyingNow(false);
    }
  };

  const isColorOption = (optionName: string) => {
    return optionName.toLowerCase().includes("color") || optionName.toLowerCase().includes("colour");
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

          {/* Variant Selectors */}
          {productOptions.length > 0 && (
            <div className="space-y-3 mb-4">
              {productOptions.map((option) => (
                <div key={option.name} onClick={(e) => e.stopPropagation()}>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">
                    {option.name}: <span className="text-foreground">{selectedOptions[option.name]}</span>
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {isColorOption(option.name) ? (
                      // Color swatches
                      option.values.map((value) => (
                        <button
                          key={value}
                          onClick={(e) => handleOptionSelect(option.name, value, e)}
                          className={cn(
                            "w-7 h-7 rounded-full transition-all duration-200 flex items-center justify-center",
                            getColorClass(value),
                            selectedOptions[option.name] === value
                              ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110"
                              : "hover:scale-105 opacity-80 hover:opacity-100"
                          )}
                          title={value}
                        >
                          {selectedOptions[option.name] === value && (
                            <Check size={14} className={cn(
                              "text-white",
                              value.toLowerCase() === "white" || value.toLowerCase() === "cream" || value.toLowerCase() === "ivory" 
                                ? "text-gray-800" 
                                : ""
                            )} />
                          )}
                        </button>
                      ))
                    ) : (
                      // Size/other option pills
                      option.values.map((value) => (
                        <button
                          key={value}
                          onClick={(e) => handleOptionSelect(option.name, value, e)}
                          className={cn(
                            "px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-200",
                            selectedOptions[option.name] === value
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                          )}
                        >
                          {value}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              variant="outline"
              className="flex-1 font-body text-sm font-semibold transition-all duration-300 hover:shadow-md active:scale-[0.98]"
              onClick={handleAddToCart}
              disabled={isLoading || !selectedVariant?.availableForSale}
            >
              <ShoppingBag size={16} className="mr-1.5" />
              {isLoading ? "Adding..." : "Add to Cart"}
            </Button>
            <Button 
              className="flex-1 bg-gradient-to-r from-primary to-coral hover:from-primary/90 hover:to-coral/90 font-body text-sm font-semibold shadow-md transition-all duration-300 hover:shadow-lg active:scale-[0.98]"
              onClick={handleBuyNow}
              disabled={isBuyingNow || !selectedVariant?.availableForSale}
            >
              <Zap size={16} className="mr-1.5" />
              {isBuyingNow ? "Processing..." : !selectedVariant?.availableForSale ? "Out of Stock" : "Buy Now"}
            </Button>
          </div>
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
