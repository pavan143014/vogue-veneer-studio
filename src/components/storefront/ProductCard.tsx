import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  id?: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
}

const ProductCard = ({ 
  id,
  name, 
  price, 
  originalPrice, 
  image,
  category, 
  isNew = false, 
  isSale = false 
}: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const discount = originalPrice 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;

  const CardContent = (
    <div 
      className="group relative bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] bg-gradient-to-br from-cream-dark to-muted overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <span className="bg-primary text-primary-foreground text-xs font-body font-medium px-3 py-1 rounded-full">
              New
            </span>
          )}
          {isSale && discount > 0 && (
            <span className="bg-accent text-accent-foreground text-xs font-body font-medium px-3 py-1 rounded-full">
              -{discount}%
            </span>
          )}
        </div>

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

        {/* Quick Actions - Show on Hover */}
        <div 
          className={`absolute inset-x-3 bottom-3 flex gap-2 transition-all duration-300 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Button 
            size="sm" 
            className="flex-1 bg-primary hover:bg-primary/90 font-body text-xs"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Eye size={14} className="mr-1" />
            Quick View
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <p className="font-body text-xs text-muted-foreground uppercase tracking-wide mb-1">
          {category}
        </p>
        <h3 className="font-display text-lg font-medium text-foreground line-clamp-1 mb-2 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-body font-semibold text-foreground">
            ₹{price.toLocaleString()}
          </span>
          {originalPrice && (
            <span className="font-body text-sm text-muted-foreground line-through">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (id) {
    return <Link to={`/product/${id}`}>{CardContent}</Link>;
  }

  return CardContent;
};

export default ProductCard;
