import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Truck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import ShippingForm, { ShippingFormData } from "@/components/checkout/ShippingForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  
  const [formData, setFormData] = useState<ShippingFormData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingFormData, string>>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingFormData, string>> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length > 100) {
      newErrors.fullName = "Name must be less than 100 characters";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[+]?[\d\s-]{10,15}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    } else if (formData.address.trim().length > 500) {
      newErrors.address = "Address must be less than 500 characters";
    }
    
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }
    
    if (!formData.pincode.trim()) {
      newErrors.pincode = "PIN code is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit PIN code";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateOrderId = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `VRH-${timestamp}-${random}`;
  };

  const getEstimatedDelivery = () => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5 + Math.floor(Math.random() * 3));
    return deliveryDate.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const orderData = {
      orderId: generateOrderId(),
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
      })),
      shippingDetails: formData,
      subtotal: totalPrice,
      shippingCost,
      total: finalTotal,
      estimatedDelivery: getEstimatedDelivery(),
      orderDate: new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
    
    clearCart();
    navigate("/order-confirmation", { state: orderData });
    
    setIsProcessing(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="font-display text-3xl text-foreground mb-4">Your Cart is Empty</h1>
          <p className="font-body text-muted-foreground mb-8">
            Add some beautiful ethnic wear to your cart before checkout.
          </p>
          <Link to="/">
            <Button className="bg-primary hover:bg-primary/90">
              <ArrowLeft size={16} className="mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const shippingCost = totalPrice >= 999 ? 0 : 99;
  const finalTotal = totalPrice + shippingCost;

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
          <span className="text-foreground">Checkout</span>
        </nav>

        <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-8">
          Checkout
        </h1>

        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-body text-sm font-medium">
              1
            </div>
            <span className="font-body text-sm font-medium text-foreground hidden sm:inline">
              Shipping
            </span>
          </div>
          <div className="flex-1 h-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-body text-sm font-medium">
              2
            </div>
            <span className="font-body text-sm text-muted-foreground hidden sm:inline">
              Payment
            </span>
          </div>
          <div className="flex-1 h-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-body text-sm font-medium">
              3
            </div>
            <span className="font-body text-sm text-muted-foreground hidden sm:inline">
              Confirmation
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-8">
            <ShippingForm 
              formData={formData} 
              onChange={setFormData} 
              errors={errors}
            />

            {/* Payment Section (Placeholder) */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Payment Method
              </h2>
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <CreditCard size={32} className="mx-auto text-muted-foreground mb-2" />
                <p className="font-body text-sm text-muted-foreground">
                  Payment options will be available on the next step
                </p>
              </div>
            </div>

            {/* Place Order Button */}
            <Button
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 font-body text-base h-14"
              onClick={handlePlaceOrder}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                <>Place Order — ₹{finalTotal.toLocaleString()}</>
              )}
            </Button>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <Truck size={24} className="mx-auto text-primary mb-2" />
                <p className="font-body text-xs text-muted-foreground">Free Shipping on ₹999+</p>
              </div>
              <div className="text-center">
                <Shield size={24} className="mx-auto text-primary mb-2" />
                <p className="font-body text-xs text-muted-foreground">Secure Checkout</p>
              </div>
              <div className="text-center">
                <CreditCard size={24} className="mx-auto text-primary mb-2" />
                <p className="font-body text-xs text-muted-foreground">Multiple Payment Options</p>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <OrderSummary />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
