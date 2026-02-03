import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingBag, Truck, Shield, RefreshCw, Loader2, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShopifyProduct } from "@/hooks/useShopifyProducts";
import { useCartStore, ShopifyProduct } from "@/stores/cartStore";
import { useWishlist } from "@/hooks/useWishlist";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import RelatedProducts from "@/components/storefront/RelatedProducts";
import SizeGuide from "@/components/storefront/SizeGuide";
import StockIndicator from "@/components/storefront/StockIndicator";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Color mapping for visual swatches
const colorMap: Record<string, string> = {
  "red": "bg-red-500",
  "burgundy red": "bg-red-800",
  "royal blue": "bg-blue-700",
  "blue": "bg-blue-500",
  "navy": "bg-blue-900",
  "green": "bg-green-500",
  "emerald green": "bg-emerald-600",
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

const isColorOption = (optionName: string) => {
  return optionName.toLowerCase().includes("color") || optionName.toLowerCase().includes("colour");
};

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const { data: product, isLoading, error } = useShopifyProduct(handle || "");
  const { addItem, isLoading: isAddingToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-24 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="font-display text-3xl text-foreground mb-4">Product Not Found</h1>
          <p className="font-body text-muted-foreground mb-8">
            The product you're looking for doesn't exist.
          </p>
          <Link to="/">
            <Button className="bg-primary hover:bg-primary/90">
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images?.edges || [];
  const variants = product.variants?.edges || [];
  const productOptions = product.options?.filter(opt => opt.name.toLowerCase() !== "title") || [];
  
  // Initialize selected options with first values if not set
  if (Object.keys(selectedOptions).length === 0 && productOptions.length > 0) {
    const initialOptions: Record<string, string> = {};
    productOptions.forEach(opt => {
      if (opt.values.length > 0) {
        initialOptions[opt.name] = opt.values[0];
      }
    });
    if (Object.keys(initialOptions).length > 0) {
      // Use timeout to avoid state update during render
      setTimeout(() => setSelectedOptions(initialOptions), 0);
    }
  }

  // Find the variant that matches selected options
  const selectedVariant = variants.find(({ node: variant }) => {
    if (!variant.selectedOptions) return false;
    return variant.selectedOptions.every(opt => 
      selectedOptions[opt.name] === opt.value
    );
  })?.node || variants[0]?.node;

  const price = selectedVariant ? parseFloat(selectedVariant.price.amount) : 0;
  const currencyCode = selectedVariant?.price.currencyCode || "INR";

  // Wrap product in ShopifyProduct format for cart/wishlist
  const shopifyProduct: ShopifyProduct = {
    node: product
  };

  const isLiked = isInWishlist(product.id);

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error("Please select all options");
      return;
    }

    await addItem({
      product: shopifyProduct,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: quantity,
      selectedOptions: selectedVariant.selectedOptions || []
    });

    toast.success("Added to cart!", {
      description: `${product.title} x ${quantity}`,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 font-body text-sm">
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors">
            Shop
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground">{product.title}</span>
        </nav>

        {/* Product Section */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-16">
          {/* Product Images */}
          <div className="relative">
            <motion.div 
              className="aspect-[3/4] rounded-2xl overflow-hidden bg-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AnimatePresence mode="wait">
                {images[selectedImage]?.node?.url ? (
                  <motion.img
                    key={selectedImage}
                    src={images[selectedImage].node.url}
                    alt={images[selectedImage].node.altText || product.title}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                ) : (
                  <motion.div 
                    key="placeholder"
                    className="w-full h-full flex items-center justify-center text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <ShoppingBag size={64} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => toggleWishlist(shopifyProduct)}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-lg",
                  isLiked 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-background/80 backdrop-blur-sm text-foreground hover:bg-primary hover:text-primary-foreground"
                )}
              >
                <Heart size={20} className={isLiked ? "fill-current" : ""} />
              </button>
              <button
                onClick={handleShare}
                className="w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors shadow-lg"
              >
                <Share2 size={20} />
              </button>
            </div>
            
            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 justify-center overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "w-16 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0",
                      selectedImage === index
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <img
                      src={img.node.url}
                      alt={img.node.altText || `${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
                {product.title}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                <span className="font-display text-3xl font-semibold text-foreground">
                  {currencyCode} {price.toFixed(2)}
                </span>
                <span className="font-body text-lg text-muted-foreground line-through">
                  {currencyCode} {(price * 1.3).toFixed(2)}
                </span>
                <span className="text-sm font-medium text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full">
                  23% OFF
                </span>
              </div>

              {/* Stock Indicator */}
              <StockIndicator 
                availableForSale={selectedVariant?.availableForSale ?? true}
                quantityAvailable={selectedVariant?.quantityAvailable}
              />
            </div>

            {/* Description */}
            {product.description && (
              <p className="font-body text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Variant Selection */}
            {productOptions.length > 0 && (
              <div className="space-y-4">
                {productOptions.map((option) => (
                  <div key={option.name}>
                    <div className="flex items-center justify-between mb-3">
                      <label className="font-body text-sm font-medium text-foreground">
                        {option.name}: <span className="text-muted-foreground">{selectedOptions[option.name]}</span>
                      </label>
                      {option.name.toLowerCase() === "size" && <SizeGuide />}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {isColorOption(option.name) ? (
                        // Color swatches
                        option.values.map((value) => (
                          <button
                            key={value}
                            onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: value }))}
                            className={cn(
                              "w-10 h-10 rounded-full transition-all duration-200 flex items-center justify-center",
                              getColorClass(value),
                              selectedOptions[option.name] === value
                                ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110"
                                : "hover:scale-105 opacity-70 hover:opacity-100"
                            )}
                            title={value}
                          >
                            {selectedOptions[option.name] === value && (
                              <Check size={16} className={cn(
                                "text-white",
                                value.toLowerCase() === "white" || value.toLowerCase() === "cream" || value.toLowerCase() === "ivory" 
                                  ? "text-gray-800" 
                                  : ""
                              )} />
                            )}
                          </button>
                        ))
                      ) : (
                        // Size/other option buttons
                        option.values.map((value) => {
                          // Check if this option value is available in any variant
                          const isAvailable = variants.some(({ node: v }) => 
                            v.availableForSale && v.selectedOptions?.some(o => o.name === option.name && o.value === value)
                          );
                          
                          return (
                            <button
                              key={value}
                              onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: value }))}
                              disabled={!isAvailable}
                              className={cn(
                                "min-w-[48px] h-12 px-4 rounded-lg font-body text-sm font-medium transition-all",
                                selectedOptions[option.name] === value
                                  ? "bg-primary text-primary-foreground"
                                  : isAvailable
                                  ? "bg-muted text-foreground hover:border-primary border-2 border-transparent"
                                  : "bg-muted/50 text-muted-foreground line-through cursor-not-allowed"
                              )}
                            >
                              {value}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="font-body text-sm font-medium text-foreground block mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-3 bg-muted rounded-lg w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-background rounded-l-lg transition-colors font-body text-lg"
                >
                  −
                </button>
                <span className="font-body text-base w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="p-3 hover:bg-background rounded-r-lg transition-colors font-body text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-4 pt-4">
              <Button
                size="lg"
                className="flex-1 bg-primary hover:bg-primary/90 font-body text-sm h-14"
                onClick={handleAddToCart}
                disabled={isAddingToCart || !selectedVariant?.availableForSale}
              >
                {isAddingToCart ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ShoppingBag size={18} className="mr-2" />
                    {selectedVariant?.availableForSale 
                      ? `Add to Cart — ${currencyCode} ${(price * quantity).toFixed(2)}`
                      : "Out of Stock"
                    }
                  </>
                )}
              </Button>
            </div>

            {/* Trust Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Truck size={20} className="text-primary" />
                </div>
                <p className="font-body text-xs text-muted-foreground">Free Shipping</p>
                <p className="font-body text-[10px] text-muted-foreground/70">Orders above ₹999</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <RefreshCw size={20} className="text-primary" />
                </div>
                <p className="font-body text-xs text-muted-foreground">7-Day Returns</p>
                <p className="font-body text-[10px] text-muted-foreground/70">Easy exchanges</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Shield size={20} className="text-primary" />
                </div>
                <p className="font-body text-xs text-muted-foreground">Secure Payment</p>
                <p className="font-body text-[10px] text-muted-foreground/70">100% protected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts currentProductId={product.id} />
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
