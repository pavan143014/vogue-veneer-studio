import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useShopifyProducts, ShopifyProduct } from "@/hooks/useShopifyProducts";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface ProductSearchProps {
  onSearch?: (query: string) => void;
  showDropdown?: boolean;
}

const ProductSearch = ({ onSearch, showDropdown = true }: ProductSearchProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Search products
  const { data: products, isLoading } = useShopifyProducts(
    10,
    debouncedQuery ? `title:*${debouncedQuery}*` : undefined
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
    setIsOpen(false);
  };

  const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currencyCode,
    }).format(parseFloat(amount));
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search for kurthis, dresses, festive wear..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (showDropdown) setIsOpen(true);
            }}
            onFocus={() => showDropdown && setIsOpen(true)}
            className="pl-12 pr-12 py-6 text-base rounded-2xl border-2 border-border focus:border-primary bg-background/80 backdrop-blur-sm transition-all duration-300"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-muted"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {showDropdown && isOpen && query && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden z-50"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground font-body">Searching...</span>
              </div>
            ) : products && products.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                {products.slice(0, 5).map((product: ShopifyProduct, index: number) => (
                  <motion.div
                    key={product.node.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={`/product/${product.node.handle}`}
                      className="flex items-center gap-4 p-4 hover:bg-muted transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                        {product.node.images.edges[0] ? (
                          <img
                            src={product.node.images.edges[0].node.url}
                            alt={product.node.images.edges[0].node.altText || product.node.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <Search className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-body font-medium text-foreground truncate">
                          {product.node.title}
                        </h4>
                        <p className="font-display text-primary font-semibold">
                          {formatPrice(
                            product.node.priceRange.minVariantPrice.amount,
                            product.node.priceRange.minVariantPrice.currencyCode
                          )}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
                {products.length > 5 && (
                  <Link
                    to={`/shop?search=${encodeURIComponent(query)}`}
                    className="block p-4 text-center text-primary font-body font-medium hover:bg-muted transition-colors border-t border-border"
                    onClick={() => setIsOpen(false)}
                  >
                    View all {products.length} results →
                  </Link>
                )}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground font-body">No products found for "{query}"</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductSearch;
