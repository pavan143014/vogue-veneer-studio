import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Heart, Trash2, ShoppingBag, X } from "lucide-react";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const WishlistDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem: addToCart, isLoading } = useCartStore();

  const handleAddToCart = async (product: typeof items[0]) => {
    const firstVariant = product.node.variants?.edges?.[0]?.node;
    if (!firstVariant) {
      toast.error("This product is not available");
      return;
    }

    await addToCart({
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions || [],
    });

    toast.success("Added to cart!", {
      description: product.node.title,
    });
  };

  const handleRemove = (productId: string, productTitle: string) => {
    removeItem(productId);
    toast.success("Removed from wishlist", {
      description: productTitle,
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Heart className="h-5 w-5" />
          <AnimatePresence>
            {items.length > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                  {items.length}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary fill-primary" />
            My Wishlist
          </SheetTitle>
          <SheetDescription>
            {items.length === 0
              ? "Your wishlist is empty"
              : `${items.length} item${items.length !== 1 ? "s" : ""} saved`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col flex-1 pt-6 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                </motion.div>
                <p className="text-muted-foreground font-body">
                  Save items you love by clicking the heart icon
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setIsOpen(false)}
                  asChild
                >
                  <Link to="/shop">Browse Products</Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                <AnimatePresence mode="popLayout">
                  <div className="space-y-4">
                    {items.map((item) => {
                      const imageUrl = item.node.images?.edges?.[0]?.node?.url;
                      const price = parseFloat(
                        item.node.priceRange.minVariantPrice.amount
                      );
                      const currencyCode =
                        item.node.priceRange.minVariantPrice.currencyCode;
                      const firstVariant = item.node.variants?.edges?.[0]?.node;

                      return (
                        <motion.div
                          key={item.node.id}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex gap-4 p-3 bg-muted/30 rounded-xl border border-border hover:border-primary/30 transition-colors"
                        >
                          <Link
                            to={`/product/${item.node.handle}`}
                            onClick={() => setIsOpen(false)}
                            className="w-20 h-20 bg-background rounded-lg overflow-hidden flex-shrink-0"
                          >
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={item.node.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingBag className="w-8 h-8 text-muted-foreground/50" />
                              </div>
                            )}
                          </Link>

                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/product/${item.node.handle}`}
                              onClick={() => setIsOpen(false)}
                            >
                              <h4 className="font-display font-medium text-foreground truncate hover:text-primary transition-colors">
                                {item.node.title}
                              </h4>
                            </Link>
                            <p className="font-body font-semibold text-foreground mt-1">
                              {currencyCode} {price.toFixed(2)}
                            </p>

                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                variant="default"
                                className="flex-1 text-xs"
                                onClick={() => handleAddToCart(item)}
                                disabled={
                                  isLoading || !firstVariant?.availableForSale
                                }
                              >
                                <ShoppingBag className="w-3 h-3 mr-1" />
                                {firstVariant?.availableForSale
                                  ? "Add to Cart"
                                  : "Out of Stock"}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() =>
                                  handleRemove(item.node.id, item.node.title)
                                }
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </AnimatePresence>
              </div>

              {items.length > 0 && (
                <div className="flex-shrink-0 pt-4 border-t bg-background">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      clearWishlist();
                      toast.success("Wishlist cleared");
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear Wishlist
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default WishlistDrawer;
