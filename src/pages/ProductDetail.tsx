import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingBag, Truck, Shield, RefreshCw, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProductById, products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import ProductCard from "@/components/storefront/ProductCard";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || "");
  const { addToCart } = useCart();
  
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>(product?.colors[0]?.name || "");
  const [selectedImage, setSelectedImage] = useState<string>(product?.image || "");
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showSizeError, setShowSizeError] = useState(false);
  const [showColorError, setShowColorError] = useState(false);

  if (!product) {
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

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleColorSelect = (colorName: string, colorImage: string) => {
    setSelectedColor(colorName);
    setSelectedImage(colorImage);
    setShowColorError(false);
  };

  const handleAddToCart = () => {
    let hasError = false;
    
    if (!selectedSize) {
      setShowSizeError(true);
      hasError = true;
    }
    if (!selectedColor) {
      setShowColorError(true);
      hasError = true;
    }
    
    if (hasError) return;
    
    setShowSizeError(false);
    setShowColorError(false);
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: selectedImage,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      category: product.category,
    });
    
    toast.success("Added to cart!", {
      description: `${product.name} (${selectedColor}, ${selectedSize}) x ${quantity}`,
    });
  };

  // Related products (same category, different product)
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

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
          <Link to="/#collections" className="text-muted-foreground hover:text-primary transition-colors">
            {product.category}
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Product Section */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-16">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-muted">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && (
                <span className="bg-primary text-primary-foreground text-xs font-body font-medium px-3 py-1 rounded-full">
                  New
                </span>
              )}
              {product.isSale && discount > 0 && (
                <span className="bg-accent text-accent-foreground text-xs font-body font-medium px-3 py-1 rounded-full">
                  -{discount}% OFF
                </span>
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
            
            {/* Color Thumbnails */}
            {product.colors.length > 1 && (
              <div className="flex gap-2 mt-4 justify-center">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => handleColorSelect(color.name, color.image)}
                    className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedColor === color.name
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={color.image}
                      alt={color.name}
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
              <p className="font-body text-sm text-primary uppercase tracking-wide mb-2">
                {product.category}
              </p>
              <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-gold text-gold" />
                  ))}
                </div>
                <span className="font-body text-sm text-muted-foreground">
                  4.9 (127 reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="font-display text-3xl font-semibold text-foreground">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="font-body text-lg text-muted-foreground line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="bg-primary/10 text-primary text-sm font-body font-medium px-2 py-1 rounded">
                      Save ₹{(product.originalPrice - product.price).toLocaleString()}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="font-body text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Color Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="font-body text-sm font-medium text-foreground">
                  Select Color: <span className="text-primary">{selectedColor}</span>
                </label>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => handleColorSelect(color.name, color.image)}
                    className={`group relative w-10 h-10 rounded-full transition-all ${
                      selectedColor === color.name
                        ? "ring-2 ring-primary ring-offset-2"
                        : "hover:ring-2 hover:ring-primary/50 hover:ring-offset-1"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColor === color.name && (
                      <Check 
                        size={16} 
                        className={`absolute inset-0 m-auto ${
                          color.hex === "#FFFFFF" || color.hex === "#FBD5E0" || color.hex === "#E8DCC4" || color.hex === "#E6E6FA" || color.hex === "#FFDAB9" || color.hex === "#B0E0E6" || color.hex === "#98FF98" || color.hex === "#87CEEB" || color.hex === "#98FB98" || color.hex === "#F8B4C4" || color.hex === "#F4B4C4"
                            ? "text-foreground" 
                            : "text-white"
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>
              {showColorError && (
                <p className="font-body text-sm text-destructive mt-2">
                  Please select a color
                </p>
              )}
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="font-body text-sm font-medium text-foreground">
                  Select Size
                </label>
                <button className="font-body text-xs text-primary hover:underline">
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setShowSizeError(false);
                    }}
                    className={`min-w-[48px] h-12 px-3 rounded-lg font-body text-sm font-medium transition-all ${
                      selectedSize === size
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground hover:border-primary border-2 border-transparent"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {showSizeError && (
                <p className="font-body text-sm text-destructive mt-2">
                  Please select a size
                </p>
              )}
            </div>

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
              >
                <ShoppingBag size={18} className="mr-2" />
                Add to Cart — ₹{(product.price * quantity).toLocaleString()}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-body text-sm px-6"
              >
                Buy Now
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

        {/* Product Details Accordion */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 py-8 border-y border-border">
          <div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-4">
              Product Details
            </h3>
            <ul className="space-y-2">
              {product.details.map((detail, index) => (
                <li key={index} className="flex items-start gap-2 font-body text-sm text-muted-foreground">
                  <Check size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-4">
              Fabric
            </h3>
            <p className="font-body text-sm text-muted-foreground">
              {product.fabric}
            </p>
          </div>
          
          <div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-4">
              Care Instructions
            </h3>
            <ul className="space-y-2">
              {product.careInstructions.map((instruction, index) => (
                <li key={index} className="flex items-start gap-2 font-body text-sm text-muted-foreground">
                  <Check size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  {instruction}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mb-16">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  id={relatedProduct.id}
                  name={relatedProduct.name}
                  price={relatedProduct.price}
                  originalPrice={relatedProduct.originalPrice}
                  image={relatedProduct.image}
                  category={relatedProduct.category}
                  isNew={relatedProduct.isNew}
                  isSale={relatedProduct.isSale}
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

export default ProductDetail;
