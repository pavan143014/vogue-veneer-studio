import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Package, Heart, Settings, ShoppingBag, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

interface Order {
  id: string;
  order_number: string;
  status: string;
  total: number;
  currency: string;
  created_at: string;
  estimated_delivery: string | null;
}

const AccountOrders = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      // Note: Orders table has restrictive RLS, so this will return empty
      // In a real app, you'd use an edge function to fetch user orders
      const { data } = await supabase
        .from('orders')
        .select('id, order_number, status, total, currency, created_at, estimated_delivery')
        .eq('email', user.email)
        .order('created_at', { ascending: false });
      
      setOrders(data || []);
      setLoading(false);
    };

    if (isAuthenticated) {
      fetchOrders();
    }
  }, [user, isAuthenticated]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      case 'confirmed':
      case 'processing':
        return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'shipped':
        return 'bg-purple-500/20 text-purple-600 border-purple-500/30';
      case 'delivered':
        return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-600 border-red-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

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
          <Link to="/account" className="text-muted-foreground hover:text-primary transition-colors">
            Account
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground">Orders</span>
        </nav>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Card>
              <CardContent className="p-4 space-y-1">
                <Link
                  to="/account"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors font-body text-muted-foreground"
                >
                  <Settings className="h-4 w-4" />
                  Account Settings
                </Link>
                <Link
                  to="/account/orders"
                  className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 text-primary font-body"
                >
                  <Package className="h-4 w-4" />
                  My Orders
                </Link>
                <Link
                  to="/account/wishlist"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors font-body text-muted-foreground"
                >
                  <Heart className="h-4 w-4" />
                  Wishlist
                </Link>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-2xl flex items-center gap-2">
                  <Package className="h-6 w-6 text-primary" />
                  My Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-display text-xl text-foreground mb-2">
                      No orders yet
                    </h3>
                    <p className="font-body text-muted-foreground mb-6">
                      When you place an order, it will appear here
                    </p>
                    <Button asChild className="bg-primary hover:bg-primary/90">
                      <Link to="/shop">Start Shopping</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-muted/50 rounded-xl p-4 border border-border"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-display font-medium text-foreground">
                                Order #{order.order_number}
                              </span>
                              <Badge variant="outline" className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </div>
                            <p className="font-body text-sm text-muted-foreground">
                              Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </p>
                            {order.estimated_delivery && (
                              <p className="font-body text-sm text-muted-foreground">
                                Est. delivery: {order.estimated_delivery}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <span className="font-display text-lg font-semibold text-foreground">
                              {order.currency} {order.total.toFixed(2)}
                            </span>
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/track-order?order=${order.order_number}`}>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Track
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AccountOrders;
