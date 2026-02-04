import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AdminProduct } from "@/hooks/useAdminProducts";
import { useLocalCartStore } from "@/stores/localCartStore";
import { toast } from "sonner";
import { Product } from "@/data/products";

interface AdminProductCardProps {
  product: AdminProduct;
}

const AdminProductCard = ({ product }: AdminProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const addItem = useLocalCartStore((state) => state.addItem);

  const imageUrl = product.images?.[0] || "/placeholder.svg";
  const isOnSale = product.compare_at_price && product.compare_at_price > product.price;
  const discountPercent = isOnSale 
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Convert AdminProduct to Product format for cart compatibility
    const cartProduct: Product = {
      id: product.id,
      name: product.title,
      price: product.price,
      originalPrice: product.compare_at_price || undefined,
      image: imageUrl,
      category: product.category || "General",
      description: product.description || "",
      details: [],
      sizes: ["Free Size"],
      colors: [{ name: "Default", hex: "#000000", image: imageUrl }],
      fabric: "",
      careInstructions: [],
    };

    addItem({
      product: cartProduct,
      selectedSize: "Free Size",
    });
    toast.success("Added to cart!");
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <motion.div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/product/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted mb-4">
          <img
            src={imageUrl}
            alt={product.title}
            className={cn(
              "w-full h-full object-cover transition-transform duration-700",
              isHovered && "scale-110"
            )}
          />
          
          {/* Overlay gradient on hover */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300",
            isHovered && "opacity-100"
          )} />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isOnSale && (
              <Badge className="bg-coral text-primary-foreground font-body text-xs px-2.5 py-1">
                -{discountPercent}%
              </Badge>
            )}
            {product.stock_quantity && product.stock_quantity < 10 && (
              <Badge className="bg-primary text-primary-foreground font-body text-xs px-2.5 py-1">
                Low Stock
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <motion.button
            className={cn(
              "absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-sm transition-all duration-300",
              isWishlisted 
                ? "bg-coral text-primary-foreground" 
                : "bg-background/80 text-foreground hover:bg-background"
            )}
            onClick={handleWishlist}
            whileTap={{ scale: 0.9 }}
          >
            <Heart 
              size={18} 
              className={cn(isWishlisted && "fill-current")} 
            />
          </motion.button>

          {/* Quick Actions */}
          <motion.div 
            className="absolute bottom-3 left-3 right-3 flex gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              y: isHovered ? 0 : 20 
            }}
            transition={{ duration: 0.3 }}
          >
            <Button
              size="sm"
              className="flex-1 bg-background/95 backdrop-blur-sm text-foreground hover:bg-background font-body text-xs gap-1.5 h-10 rounded-xl shadow-lg"
              onClick={handleAddToCart}
            >
              <ShoppingBag size={14} />
              Add to Cart
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="bg-background/95 backdrop-blur-sm hover:bg-background font-body h-10 w-10 p-0 rounded-xl shadow-lg"
            >
              <Eye size={14} />
            </Button>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          {product.category && (
            <p className="font-body text-xs uppercase tracking-wider text-muted-foreground">
              {product.category}
            </p>
          )}
          <h3 className="font-display text-base md:text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-bold text-foreground">
              ₹{product.price.toLocaleString()}
            </span>
            {isOnSale && (
              <span className="font-body text-sm text-muted-foreground line-through">
                ₹{product.compare_at_price?.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default AdminProductCard;
