import { X, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useLocalCartStore } from "@/stores/localCartStore";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const LocalCartDrawer = () => {
  const { 
    items, 
    isCartOpen, 
    setCartOpen, 
    removeItem, 
    updateQuantity, 
    totalItems,
    totalPrice
  } = useLocalCartStore();
  const navigate = useNavigate();

  const itemCount = totalItems();
  const total = totalPrice();

  const handleCheckout = () => {
    setCartOpen(false);
    navigate('/checkout');
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="w-full sm:max-w-md bg-background border-l border-border flex flex-col h-full">
        <SheetHeader className="border-b border-border pb-4 flex-shrink-0">
          <SheetTitle className="font-display text-2xl flex items-center gap-2">
            <ShoppingBag size={24} className="text-primary" />
            Your Cart ({itemCount})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <ShoppingBag size={32} className="text-muted-foreground" />
            </div>
            <p className="font-display text-xl text-foreground mb-2">Your cart is empty</p>
            <p className="font-body text-sm text-muted-foreground mb-6">
              Add some beautiful ethnic wear to get started!
            </p>
            <Button onClick={() => setCartOpen(false)} className="bg-primary hover:bg-primary/90">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="flex flex-col flex-1 min-h-0">
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={`${item.product.id}-${item.selectedSize}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 p-4 bg-card rounded-lg border border-border"
                  >
                    <div className="w-20 h-24 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-display text-base font-medium text-foreground line-clamp-1">
                            {item.product.name}
                          </h4>
                          <p className="font-body text-xs text-muted-foreground">
                            Size: {item.selectedSize}
                            {item.selectedColor && ` • ${item.selectedColor}`}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id, item.selectedSize)}
                          className="text-muted-foreground hover:text-destructive transition-colors ml-2 flex-shrink-0"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-muted rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                            className="p-2 hover:bg-background rounded-l-lg transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-body text-sm w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                            className="p-2 hover:bg-background rounded-r-lg transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Price */}
                        <p className="font-body font-semibold text-foreground">
                          ₹{(item.product.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Cart Footer */}
            <div className="border-t border-border pt-4 space-y-4 flex-shrink-0 bg-background">
              <div className="flex justify-between items-center">
                <span className="font-body text-muted-foreground">Subtotal</span>
                <span className="font-display text-xl font-semibold text-foreground">
                  ₹{total.toLocaleString()}
                </span>
              </div>
              <p className="font-body text-xs text-muted-foreground">
                Shipping calculated at checkout
              </p>
              <Button 
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-primary to-coral hover:from-primary/90 hover:to-coral/90 font-body text-sm h-12"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                className="w-full font-body text-sm"
                onClick={() => setCartOpen(false)}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default LocalCartDrawer;
