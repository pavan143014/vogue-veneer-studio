import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingBag, Truck, Shield, RefreshCw, Loader2, Share2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminProduct } from "@/hooks/useAdminProduct";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import { useLocalCartStore } from "@/stores/localCartStore";
import { Product } from "@/data/products";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import SizeGuide from "@/components/storefront/SizeGuide";
import StockIndicator from "@/components/storefront/StockIndicator";
import ProductCard from "@/components/storefront/ProductCard";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const AdminProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error } = useAdminProduct(id);
  const { products: relatedProducts } = useAdminProducts(4);
  const { addItem } = useLocalCartStore();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  const defaultSizes = ["S", "M", "L", "XL"];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <Skeleton className="aspect-[3/4] rounded-2xl" />
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={40} className="text-muted-foreground" />
            </div>
            <h1 className="font-display text-3xl text-foreground mb-4">Product Not Found</h1>
            <p className="font-body text-muted-foreground mb-8">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/shop">
              <Button className="bg-primary hover:bg-primary/90">
                <ArrowLeft size={16} className="mr-2" />
                Back to Shop
              </Button>
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images || [];
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0;
  const savings = hasDiscount ? product.compare_at_price! - product.price : 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    // Create a Product object for the cart
    const cartProduct: Product = {
      id: product.id,
      name: product.title,
      price: product.price,
      originalPrice: product.compare_at_price || undefined,
      image: images[0] || "/placeholder.svg",
      category: product.category || "Uncategorized",
      isNew: new Date(product.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000,
      isSale: hasDiscount || false,
      description: product.description || "",
      details: [],
      sizes: defaultSizes,
      colors: [],
      fabric: "",
      careInstructions: []
    };

    addItem({
      product: cartProduct,
      selectedSize,
      quantity
    });

    toast.success("Added to cart!", {
      description: `${product.title} - Size ${selectedSize} × ${quantity}`,
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

  // Filter out current product from related products
  const filteredRelated = relatedProducts.filter(p => p.id !== product.id).slice(0, 4);

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
          <span className="text-foreground truncate max-w-[200px]">{product.title}</span>
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
                {images[selectedImage] ? (
                  <motion.img
                    key={selectedImage}
                    src={images[selectedImage]}
                    alt={product.title}
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

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {hasDiscount && (
                <Badge className="bg-destructive text-destructive-foreground">
                  {discountPercentage}% OFF
                </Badge>
              )}
              {new Date(product.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 && (
                <Badge className="bg-primary text-primary-foreground">
                  New
                </Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => setIsLiked(!isLiked)}
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
                      src={img}
                      alt={`${product.title} ${index + 1}`}
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
              {product.category && (
                <p className="font-body text-sm text-primary uppercase tracking-wider mb-2">
                  {product.category}
                </p>
              )}
              <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
                {product.title}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                <span className="font-display text-3xl font-semibold text-foreground">
                  ₹{product.price.toLocaleString()}
                </span>
                {hasDiscount && (
                  <>
                    <span className="font-body text-lg text-muted-foreground line-through">
                      ₹{product.compare_at_price?.toLocaleString()}
                    </span>
                    <span className="text-sm font-medium text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full">
                      Save ₹{savings.toLocaleString()}
                    </span>
                  </>
                )}
              </div>

              {/* Stock Indicator */}
              <StockIndicator 
                availableForSale={(product.stock_quantity || 0) > 0}
                quantityAvailable={product.stock_quantity}
              />
            </div>

            {/* Description */}
            {product.description && (
              <p className="font-body text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="font-body">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* SKU */}
            {product.sku && (
              <p className="font-body text-sm text-muted-foreground">
                SKU: <span className="text-foreground">{product.sku}</span>
              </p>
            )}

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="font-body text-sm font-medium text-foreground">
                  Size: <span className="text-muted-foreground">{selectedSize || "Select"}</span>
                </label>
                <SizeGuide />
              </div>
              <div className="flex flex-wrap gap-2">
                {defaultSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "min-w-[48px] h-12 px-4 rounded-lg font-body text-sm font-medium transition-all",
                      selectedSize === size
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground hover:border-primary border-2 border-transparent"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="font-body text-sm font-medium text-foreground block mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-3 bg-muted rounded-lg w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-background rounded-l-lg transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="font-body text-base w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock_quantity || 10, quantity + 1))}
                  className="p-3 hover:bg-background rounded-r-lg transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-4 pt-4">
              <Button
                size="lg"
                className="flex-1 bg-primary hover:bg-primary/90 font-body text-sm h-14"
                onClick={handleAddToCart}
                disabled={(product.stock_quantity || 0) <= 0 || !selectedSize}
              >
                <ShoppingBag size={18} className="mr-2" />
                {(product.stock_quantity || 0) > 0 
                  ? `Add to Cart — ₹${(product.price * quantity).toLocaleString()}`
                  : "Out of Stock"
                }
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
        {filteredRelated.length > 0 && (
          <section className="mb-16">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {filteredRelated.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  id={relatedProduct.id}
                  name={relatedProduct.title}
                  price={relatedProduct.price}
                  originalPrice={relatedProduct.compare_at_price || undefined}
                  image={relatedProduct.images?.[0] || "/placeholder.svg"}
                  category={relatedProduct.category || "Uncategorized"}
                  isNew={new Date(relatedProduct.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000}
                  isSale={!!relatedProduct.compare_at_price && relatedProduct.compare_at_price > relatedProduct.price}
                />
              ))}
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminProductDetail;
