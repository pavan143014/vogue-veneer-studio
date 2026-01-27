import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingBag, Truck, Shield, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShopifyProduct } from "@/hooks/useShopifyProducts";
import { useCartStore, ShopifyProduct } from "@/stores/cartStore";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import { toast } from "sonner";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const { data: product, isLoading, error } = useShopifyProduct(handle || "");
  const { addItem, isLoading: isAddingToCart } = useCartStore();
  
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
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
  const selectedVariant = variants[selectedVariantIndex]?.node;
  const price = selectedVariant ? parseFloat(selectedVariant.price.amount) : 0;
  const currencyCode = selectedVariant?.price.currencyCode || "INR";

  // Wrap product in ShopifyProduct format for cart
  const shopifyProduct: ShopifyProduct = {
    node: product
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    for (let i = 0; i < quantity; i++) {
      await addItem({
        product: shopifyProduct,
        variantId: selectedVariant.id,
        variantTitle: selectedVariant.title,
        price: selectedVariant.price,
        quantity: 1,
        selectedOptions: selectedVariant.selectedOptions || []
      });
    }

    toast.success("Added to cart!", {
      description: `${product.title} x ${quantity}`,
    });
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
          <span className="text-foreground">{product.title}</span>
        </nav>

        {/* Product Section */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-16">
          {/* Product Images */}
          <div className="relative">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-muted">
              {images[selectedImage]?.node?.url ? (
                <img
                  src={images[selectedImage].node.url}
                  alt={images[selectedImage].node.altText || product.title}
                  className="w-full h-full object-cover transition-all duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <ShoppingBag size={64} />
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="absolute top-4 right-4 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors shadow-lg"
            >
              <Heart
                size={20}
                className={isLiked ? "fill-primary text-primary" : "text-foreground"}
              />
            </button>
            
            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 justify-center overflow-x-auto">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImage === index
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    }`}
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
              <div className="flex items-center gap-3">
                <span className="font-display text-3xl font-semibold text-foreground">
                  {currencyCode} {price.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <p className="font-body text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Variant Selection */}
            {product.options && product.options.length > 0 && product.options[0].name !== "Title" && (
              <div>
                <label className="font-body text-sm font-medium text-foreground block mb-3">
                  Select Option
                </label>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant, index) => (
                    <button
                      key={variant.node.id}
                      onClick={() => setSelectedVariantIndex(index)}
                      disabled={!variant.node.availableForSale}
                      className={`min-w-[48px] h-12 px-4 rounded-lg font-body text-sm font-medium transition-all ${
                        selectedVariantIndex === index
                          ? "bg-primary text-primary-foreground"
                          : variant.node.availableForSale
                          ? "bg-muted text-foreground hover:border-primary border-2 border-transparent"
                          : "bg-muted/50 text-muted-foreground line-through cursor-not-allowed"
                      }`}
                    >
                      {variant.node.title}
                    </button>
                  ))}
                </div>
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
                  onClick={() => setQuantity(quantity + 1)}
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
                <Truck size={20} className="mx-auto text-primary mb-2" />
                <p className="font-body text-xs text-muted-foreground">Free Shipping</p>
              </div>
              <div className="text-center">
                <RefreshCw size={20} className="mx-auto text-primary mb-2" />
                <p className="font-body text-xs text-muted-foreground">7-Day Returns</p>
              </div>
              <div className="text-center">
                <Shield size={20} className="mx-auto text-primary mb-2" />
                <p className="font-body text-xs text-muted-foreground">Secure Payment</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
