import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";

const CartDrawer = () => {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md bg-background border-l border-border">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="font-display text-2xl flex items-center gap-2">
            <ShoppingBag size={24} className="text-primary" />
            Your Cart ({totalItems})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <ShoppingBag size={32} className="text-muted-foreground" />
            </div>
            <p className="font-display text-xl text-foreground mb-2">Your cart is empty</p>
            <p className="font-body text-sm text-muted-foreground mb-6">
              Add some beautiful ethnic wear to get started!
            </p>
            <Button onClick={() => setIsCartOpen(false)} className="bg-primary hover:bg-primary/90">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-[calc(100vh-120px)]">
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}`}
                  className="flex gap-4 p-4 bg-card rounded-lg border border-border"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-display text-base font-medium text-foreground line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="font-body text-xs text-muted-foreground">
                          Size: {item.size} | Color: {item.color}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.size, item.color)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-muted rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                          className="p-2 hover:bg-background rounded-l-lg transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-body text-sm w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                          className="p-2 hover:bg-background rounded-r-lg transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Price */}
                      <p className="font-body font-semibold text-foreground">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Footer */}
            <div className="border-t border-border pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-body text-muted-foreground">Subtotal</span>
                <span className="font-display text-xl font-semibold text-foreground">
                  ₹{totalPrice.toLocaleString()}
                </span>
              </div>
              <p className="font-body text-xs text-muted-foreground">
                Shipping and taxes calculated at checkout
              </p>
              <Button className="w-full bg-primary hover:bg-primary/90 font-body text-sm h-12">
                Proceed to Checkout
              </Button>
              <Button
                variant="outline"
                className="w-full font-body text-sm"
                onClick={() => setIsCartOpen(false)}
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

export default CartDrawer;
