import { useCart } from "@/contexts/CartContext";
import { Separator } from "@/components/ui/separator";

const OrderSummary = () => {
  const { items, totalPrice } = useCart();
  
  const shippingCost = totalPrice >= 999 ? 0 : 99;
  const finalTotal = totalPrice + shippingCost;

  return (
    <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
      <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
        Order Summary
      </h2>

      {/* Cart Items */}
      <div className="space-y-4 max-h-[300px] overflow-y-auto mb-6">
        {items.map((item) => (
          <div
            key={`${item.id}-${item.size}-${item.color}`}
            className="flex gap-3"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-20 object-cover rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-body text-sm font-medium text-foreground line-clamp-1">
                {item.name}
              </h4>
              <p className="font-body text-xs text-muted-foreground">
                {item.color} • {item.size} • Qty: {item.quantity}
              </p>
              <p className="font-body text-sm font-semibold text-foreground mt-1">
                ₹{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-4" />

      {/* Price Breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between font-body text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-foreground">₹{totalPrice.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between font-body text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className={shippingCost === 0 ? "text-primary font-medium" : "text-foreground"}>
            {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
          </span>
        </div>

        {shippingCost > 0 && (
          <p className="font-body text-xs text-muted-foreground bg-muted p-2 rounded">
            Add ₹{(999 - totalPrice).toLocaleString()} more for free shipping
          </p>
        )}

        <Separator />

        <div className="flex justify-between font-display text-lg font-semibold">
          <span className="text-foreground">Total</span>
          <span className="text-primary">₹{finalTotal.toLocaleString()}</span>
        </div>
      </div>

      {/* Promo Code */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <p className="font-body text-xs text-muted-foreground mb-2">
          Have a promo code?
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter code"
            className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button className="px-4 py-2 text-sm font-body font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            Apply
          </button>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-6 flex items-center justify-center gap-4 text-muted-foreground">
        <div className="flex items-center gap-1 font-body text-xs">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Secure Checkout
        </div>
        <div className="flex items-center gap-1 font-body text-xs">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          100% Safe
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
