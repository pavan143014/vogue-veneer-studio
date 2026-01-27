import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Package, Truck, MapPin, ArrowRight, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

interface OrderData {
  orderId: string;
  items: OrderItem[];
  shippingDetails: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  subtotal: number;
  shippingCost: number;
  total: number;
  estimatedDelivery: string;
  orderDate: string;
}

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state as OrderData | null;

  useEffect(() => {
    if (!orderData) {
      navigate("/");
    }
  }, [orderData, navigate]);

  if (!orderData) {
    return null;
  }

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderData.orderId);
    toast.success("Order ID copied to clipboard");
  };

  const trackingSteps = [
    { label: "Order Placed", status: "completed", icon: CheckCircle },
    { label: "Processing", status: "current", icon: Package },
    { label: "Shipped", status: "pending", icon: Truck },
    { label: "Delivered", status: "pending", icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-3">
            Order Confirmed!
          </h1>
          <p className="font-body text-muted-foreground max-w-md mx-auto">
            Thank you for your order. We've sent a confirmation email to{" "}
            <span className="text-foreground font-medium">{orderData.shippingDetails.email}</span>
          </p>
        </div>

        {/* Order ID */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-muted-foreground mb-1">Order ID</p>
              <p className="font-display text-xl font-semibold text-foreground">
                {orderData.orderId}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={copyOrderId}>
              <Copy size={16} className="mr-2" />
              Copy
            </Button>
          </div>
          <Separator className="my-4" />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-body text-muted-foreground">Order Date</p>
              <p className="font-body font-medium text-foreground">{orderData.orderDate}</p>
            </div>
            <div>
              <p className="font-body text-muted-foreground">Estimated Delivery</p>
              <p className="font-body font-medium text-primary">{orderData.estimatedDelivery}</p>
            </div>
          </div>
        </div>

        {/* Tracking Progress */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-8 max-w-2xl mx-auto">
          <h2 className="font-display text-xl font-semibold text-foreground mb-6">
            Order Status
          </h2>
          <div className="flex items-center justify-between">
            {trackingSteps.map((step, index) => (
              <div key={step.label} className="flex flex-col items-center flex-1">
                <div className="relative flex items-center justify-center w-full">
                  {index > 0 && (
                    <div
                      className={`absolute right-1/2 w-full h-0.5 -translate-y-1/2 top-5 ${
                        step.status === "completed" || trackingSteps[index - 1].status === "completed"
                          ? "bg-primary"
                          : "bg-border"
                      }`}
                    />
                  )}
                  <div
                    className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${
                      step.status === "completed"
                        ? "bg-primary text-primary-foreground"
                        : step.status === "current"
                        ? "bg-primary/20 text-primary border-2 border-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <step.icon size={18} />
                  </div>
                </div>
                <p
                  className={`font-body text-xs mt-2 text-center ${
                    step.status === "pending" ? "text-muted-foreground" : "text-foreground"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Order Items */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              Order Items
            </h2>
            <div className="space-y-4">
              {orderData.items.map((item) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}`}
                  className="flex gap-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
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
            <div className="space-y-2 text-sm">
              <div className="flex justify-between font-body">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">₹{orderData.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-body">
                <span className="text-muted-foreground">Shipping</span>
                <span className={orderData.shippingCost === 0 ? "text-primary" : "text-foreground"}>
                  {orderData.shippingCost === 0 ? "FREE" : `₹${orderData.shippingCost}`}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-display text-lg font-semibold">
                <span className="text-foreground">Total</span>
                <span className="text-primary">₹{orderData.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Shipping Details */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">
              Shipping Address
            </h2>
            <div className="space-y-3 font-body text-sm">
              <p className="font-medium text-foreground">{orderData.shippingDetails.fullName}</p>
              <p className="text-muted-foreground">{orderData.shippingDetails.address}</p>
              <p className="text-muted-foreground">
                {orderData.shippingDetails.city}, {orderData.shippingDetails.state} -{" "}
                {orderData.shippingDetails.pincode}
              </p>
              <Separator />
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p className="text-foreground">{orderData.shippingDetails.phone}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="text-foreground">{orderData.shippingDetails.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link to="/">
            <Button size="lg" className="w-full sm:w-auto">
              Continue Shopping
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>

        {/* Help Section */}
        <div className="text-center mt-12 p-6 bg-muted/50 rounded-2xl max-w-2xl mx-auto">
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            Need Help?
          </h3>
          <p className="font-body text-sm text-muted-foreground mb-4">
            If you have any questions about your order, feel free to contact our support team.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a
              href="mailto:support@vaarahi.com"
              className="font-body text-primary hover:underline"
            >
              support@vaarahi.com
            </a>
            <span className="text-muted-foreground">|</span>
            <a href="tel:+919876543210" className="font-body text-primary hover:underline">
              +91 98765 43210
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
