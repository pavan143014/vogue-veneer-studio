import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, MapPin, User, Phone, Mail, Building, ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocalCartStore } from "@/stores/localCartStore";
import { toast } from "sonner";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import LocalCartDrawer from "@/components/storefront/LocalCartDrawer";

interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useLocalCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const subtotal = totalPrice();
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  const handleInputChange = (field: keyof ShippingDetails, value: string) => {
    setShippingDetails(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!shippingDetails.fullName.trim()) {
      toast.error("Please enter your full name");
      return false;
    }
    if (!shippingDetails.email.trim() || !shippingDetails.email.includes("@")) {
      toast.error("Please enter a valid email");
      return false;
    }
    if (!shippingDetails.phone.trim() || shippingDetails.phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return false;
    }
    if (!shippingDetails.address.trim()) {
      toast.error("Please enter your address");
      return false;
    }
    if (!shippingDetails.city.trim()) {
      toast.error("Please enter your city");
      return false;
    }
    if (!shippingDetails.state.trim()) {
      toast.error("Please enter your state");
      return false;
    }
    if (!shippingDetails.pincode.trim() || shippingDetails.pincode.length !== 6) {
      toast.error("Please enter a valid 6-digit pincode");
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    try {
      // Generate order number
      const orderNumber = `AE${Date.now().toString(36).toUpperCase()}`;
      
      // For now, simulate successful order (Razorpay integration will be added)
      // In production, this would call an edge function to create Razorpay order
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Order placed successfully!", {
        description: `Order #${orderNumber}`,
      });
      
      clearCart();
      navigate(`/order-confirmation?order=${orderNumber}`);
      
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <LocalCartDrawer />
        <main className="flex-1 container mx-auto px-4 py-16 flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
            <ShoppingBag size={40} className="text-muted-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Your cart is empty</h1>
          <p className="font-body text-muted-foreground mb-6">Add some products to continue shopping</p>
          <Button onClick={() => navigate("/shop")} className="bg-primary hover:bg-primary/90">
            Browse Products
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <LocalCartDrawer />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} className="mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Shipping Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-display text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <MapPin size={20} className="text-primary" />
                Shipping Details
              </h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName" className="font-body text-sm">
                    Full Name *
                  </Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={shippingDetails.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="font-body text-sm">
                      Email *
                    </Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={shippingDetails.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone" className="font-body text-sm">
                      Phone *
                    </Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={shippingDetails.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="address" className="font-body text-sm">
                    Address *
                  </Label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="address"
                      placeholder="House/Flat No., Street, Locality"
                      value={shippingDetails.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city" className="font-body text-sm">
                      City *
                    </Label>
                    <div className="relative mt-1">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="city"
                        placeholder="City"
                        value={shippingDetails.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="state" className="font-body text-sm">
                      State *
                    </Label>
                    <Input
                      id="state"
                      placeholder="State"
                      value={shippingDetails.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode" className="font-body text-sm">
                      Pincode *
                    </Label>
                    <Input
                      id="pincode"
                      placeholder="6-digit"
                      value={shippingDetails.pincode}
                      onChange={(e) => handleInputChange("pincode", e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <CreditCard size={20} className="text-primary" />
                Payment Method
              </h2>
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-body font-medium text-foreground">Razorpay</p>
                    <p className="font-body text-xs text-muted-foreground">
                      UPI, Cards, Net Banking, Wallets
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:sticky lg:top-24 h-fit"
          >
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-display text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <ShoppingBag size={20} className="text-primary" />
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-4 max-h-80 overflow-y-auto mb-6">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}`}
                    className="flex gap-3"
                  >
                    <div className="w-16 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-body text-sm font-medium text-foreground line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="font-body text-xs text-muted-foreground">
                        Size: {item.selectedSize} • Qty: {item.quantity}
                      </p>
                      <p className="font-body text-sm font-semibold text-foreground mt-1">
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="font-body text-muted-foreground">Subtotal</span>
                  <span className="font-body text-foreground">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-muted-foreground">Shipping</span>
                  <span className="font-body text-foreground">
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${shipping}`
                    )}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="text-xs text-green-600 font-body">
                    ✓ Free shipping on orders above ₹999
                  </p>
                )}
                <div className="flex justify-between pt-3 border-t border-border">
                  <span className="font-display text-lg font-bold text-foreground">Total</span>
                  <span className="font-display text-lg font-bold text-primary">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Pay Button */}
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full mt-6 bg-gradient-to-r from-primary to-coral hover:from-primary/90 hover:to-coral/90 font-body h-14 text-base"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Pay ₹{total.toLocaleString()}
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground mt-4 font-body">
                🔒 Your payment is secure and encrypted
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
