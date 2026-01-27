import { useState } from "react";
import { Search, Package, Truck, MapPin, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import { supabase } from "@/integrations/supabase/client";

interface OrderItem {
  id: string;
  product_title: string;
  variant_title: string | null;
  price: number;
  quantity: number;
  image_url: string | null;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  full_name: string;
  email: string;
  phone: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  currency: string;
  estimated_delivery: string | null;
  created_at: string;
}

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      // Fetch order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("order_number", orderNumber.trim().toUpperCase())
        .maybeSingle();

      if (orderError) throw orderError;

      if (!orderData) {
        setOrder(null);
        setOrderItems([]);
        setError("Order not found. Please check your order ID and try again.");
        return;
      }

      setOrder(orderData);

      // Fetch order items
      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderData.id);

      if (itemsError) throw itemsError;
      setOrderItems(itemsData || []);
    } catch (err) {
      console.error("Error fetching order:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusStep = (status: string) => {
    const statusMap: Record<string, number> = {
      pending: 0,
      confirmed: 1,
      processing: 1,
      shipped: 2,
      delivered: 3,
    };
    return statusMap[status.toLowerCase()] ?? 0;
  };

  const trackingSteps = [
    { label: "Order Placed", icon: CheckCircle },
    { label: "Processing", icon: Package },
    { label: "Shipped", icon: Truck },
    { label: "Delivered", icon: MapPin },
  ];

  const currentStep = order ? getStatusStep(order.status) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-3">
            Track Your Order
          </h1>
          <p className="font-body text-muted-foreground max-w-md mx-auto">
            Enter your order ID to check the current status of your order
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto mb-12">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter Order ID (e.g., AE-XXXXXX)"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="flex-1 h-12 font-body"
            />
            <Button type="submit" className="h-12 px-6" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Track
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Error State */}
        {error && hasSearched && (
          <Card className="max-w-2xl mx-auto border-destructive/50">
            <CardContent className="flex items-center gap-4 py-6">
              <AlertCircle className="w-8 h-8 text-destructive flex-shrink-0" />
              <div>
                <p className="font-body font-medium text-foreground">{error}</p>
                <p className="font-body text-sm text-muted-foreground mt-1">
                  Make sure you're using the order ID from your confirmation email.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order Details */}
        {order && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            {/* Order ID Card */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <CardTitle className="font-display text-xl">
                    Order #{order.order_number}
                  </CardTitle>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize w-fit">
                    {order.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-body text-muted-foreground">Order Date</p>
                    <p className="font-body font-medium text-foreground">
                      {new Date(order.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="font-body text-muted-foreground">Total</p>
                    <p className="font-body font-medium text-foreground">
                      {order.currency} {order.total.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="font-body text-muted-foreground">Items</p>
                    <p className="font-body font-medium text-foreground">
                      {orderItems.reduce((sum, item) => sum + item.quantity, 0)} items
                    </p>
                  </div>
                  {order.estimated_delivery && (
                    <div>
                      <p className="font-body text-muted-foreground">Est. Delivery</p>
                      <p className="font-body font-medium text-primary">
                        {order.estimated_delivery}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tracking Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-xl">Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  {trackingSteps.map((step, index) => (
                    <div key={step.label} className="flex flex-col items-center flex-1">
                      <div className="relative flex items-center justify-center w-full">
                        {index > 0 && (
                          <div
                            className={`absolute right-1/2 w-full h-0.5 -translate-y-1/2 top-5 ${
                              index <= currentStep ? "bg-primary" : "bg-border"
                            }`}
                          />
                        )}
                        <div
                          className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${
                            index < currentStep
                              ? "bg-primary text-primary-foreground"
                              : index === currentStep
                              ? "bg-primary/20 text-primary border-2 border-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <step.icon size={18} />
                        </div>
                      </div>
                      <p
                        className={`font-body text-xs mt-2 text-center ${
                          index > currentStep ? "text-muted-foreground" : "text-foreground"
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-xl">Order Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        {item.image_url && (
                          <img
                            src={item.image_url}
                            alt={item.product_title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-body text-sm font-medium text-foreground line-clamp-1">
                          {item.product_title}
                        </h4>
                        {item.variant_title && (
                          <p className="font-body text-xs text-muted-foreground">
                            {item.variant_title}
                          </p>
                        )}
                        <p className="font-body text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                        <p className="font-body text-sm font-semibold text-foreground mt-1">
                          {order.currency} {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Separator />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between font-body">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">
                        {order.currency} {order.subtotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between font-body">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className={order.shipping_cost === 0 ? "text-primary" : "text-foreground"}>
                        {order.shipping_cost === 0 ? "FREE" : `${order.currency} ${order.shipping_cost}`}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-display text-lg font-semibold">
                      <span className="text-foreground">Total</span>
                      <span className="text-primary">
                        {order.currency} {order.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-xl">Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 font-body text-sm">
                  <p className="font-medium text-foreground">{order.full_name}</p>
                  <p className="text-muted-foreground">{order.address}</p>
                  <p className="text-muted-foreground">
                    {order.city}, {order.state} - {order.pincode}
                  </p>
                  <Separator />
                  {order.phone && (
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="text-foreground">{order.phone}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="text-foreground">{order.email}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Empty State - Before Search */}
        {!hasSearched && (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Package size={32} className="text-muted-foreground" />
            </div>
            <p className="font-body text-muted-foreground">
              Enter your order ID above to track your order
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default TrackOrder;
