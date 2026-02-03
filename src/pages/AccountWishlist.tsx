import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Package, Heart, Settings, ShoppingBag, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";
import { motion } from "framer-motion";

const AccountWishlist = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { items, loading: wishlistLoading, removeFromWishlist } = useWishlist();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [authLoading, isAuthenticated, navigate]);

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
          <span className="text-foreground">Wishlist</span>
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
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors font-body text-muted-foreground"
                >
                  <Package className="h-4 w-4" />
                  My Orders
                </Link>
                <Link
                  to="/account/wishlist"
                  className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 text-primary font-body"
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
                  <Heart className="h-6 w-6 text-primary" />
                  My Wishlist
                  <span className="text-base font-normal text-muted-foreground">
                    ({items.length} items)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {wishlistLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : items.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <Heart className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-display text-xl text-foreground mb-2">
                      Your wishlist is empty
                    </h3>
                    <p className="font-body text-muted-foreground mb-6">
                      Save items you love by clicking the heart icon
                    </p>
                    <Button asChild className="bg-primary hover:bg-primary/90">
                      <Link to="/shop">Start Shopping</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative bg-card rounded-xl border border-border overflow-hidden"
                      >
                        <Link to={`/product/${item.product_handle}`}>
                          <div className="aspect-[3/4] bg-muted overflow-hidden">
                            {item.product_image ? (
                              <img
                                src={item.product_image}
                                alt={item.product_title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                        </Link>
                        
                        <button
                          onClick={() => removeFromWishlist(item.product_id)}
                          className="absolute top-2 right-2 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                        <div className="p-4">
                          <Link to={`/product/${item.product_handle}`}>
                            <h4 className="font-display text-sm font-medium text-foreground line-clamp-1 hover:text-primary transition-colors">
                              {item.product_title}
                            </h4>
                          </Link>
                          <p className="font-body text-primary font-semibold mt-1">
                            {item.currency_code} {item.product_price.toFixed(2)}
                          </p>
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

export default AccountWishlist;
