import { useAdminData } from "@/hooks/useAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { products, orders, loading } = useAdminData();

  // Calculate stats
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.is_active).length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const stats = [
    {
      name: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      change: "+12.5%",
      trend: "up",
      icon: IndianRupee,
      color: "from-green-500 to-emerald-600",
    },
    {
      name: "Total Orders",
      value: totalOrders.toString(),
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
      color: "from-blue-500 to-cyan-600",
    },
    {
      name: "Active Products",
      value: `${activeProducts}/${totalProducts}`,
      change: "+3",
      trend: "up",
      icon: Package,
      color: "from-purple-500 to-pink-600",
    },
    {
      name: "Avg Order Value",
      value: `₹${averageOrderValue.toFixed(0)}`,
      change: "-2.1%",
      trend: "down",
      icon: TrendingUp,
      color: "from-orange-500 to-red-600",
    },
  ];

  const recentOrders = orders.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Dashboard
        </h1>
        <p className="font-body text-muted-foreground mt-1">
          Welcome back! Here's what's happening with your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-lg">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10`}
              />
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                  >
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      stat.trend === "up"
                        ? "text-green-600 border-green-200 bg-green-50 dark:bg-green-950/50"
                        : "text-red-600 border-red-200 bg-red-50 dark:bg-red-950/50"
                    }
                  >
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {stat.change}
                  </Badge>
                </div>
                <div className="mt-4">
                  <h3 className="font-display text-2xl font-bold text-foreground">
                    {stat.value}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground mt-1">
                    {stat.name}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-display text-lg">
                Recent Orders
              </CardTitle>
              <Link
                to="/admin/orders"
                className="text-sm font-body text-primary hover:underline"
              >
                View all
              </Link>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground font-body">
                  No orders yet
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <ShoppingCart className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-body font-medium text-foreground">
                            #{order.order_number}
                          </p>
                          <p className="font-body text-sm text-muted-foreground">
                            {order.full_name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-display font-semibold text-foreground">
                          ₹{order.total?.toLocaleString("en-IN")}
                        </p>
                        <Badge
                          variant="outline"
                          className={
                            order.status === "delivered"
                              ? "text-green-600 bg-green-50 border-green-200"
                              : order.status === "pending"
                              ? "text-yellow-600 bg-yellow-50 border-yellow-200"
                              : "text-blue-600 bg-blue-50 border-blue-200"
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="font-display text-lg">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link
                to="/admin/products"
                className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-body font-medium text-foreground">
                    Add Product
                  </p>
                  <p className="font-body text-xs text-muted-foreground">
                    Create new product listing
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>

              <Link
                to="/admin/banners"
                className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-purple-500/5 hover:from-purple-500/20 hover:to-purple-500/10 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-body font-medium text-foreground">
                    Update Banners
                  </p>
                  <p className="font-body text-xs text-muted-foreground">
                    Manage homepage banners
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-purple-500 transition-colors" />
              </Link>

              <Link
                to="/admin/menus"
                className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-orange-500/5 hover:from-orange-500/20 hover:to-orange-500/10 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-body font-medium text-foreground">
                    Edit Menus
                  </p>
                  <p className="font-body text-xs text-muted-foreground">
                    Update navigation menus
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-orange-500 transition-colors" />
              </Link>

              <Link
                to="/"
                target="_blank"
                className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-green-500/5 hover:from-green-500/20 hover:to-green-500/10 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-body font-medium text-foreground">
                    View Store
                  </p>
                  <p className="font-body text-xs text-muted-foreground">
                    Open storefront in new tab
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-green-500 transition-colors" />
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Pending Actions */}
      {pendingOrders > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-200">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-500 flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {pendingOrders} Pending Orders
                  </h3>
                  <p className="font-body text-sm text-muted-foreground">
                    Orders waiting to be processed
                  </p>
                </div>
              </div>
              <Link
                to="/admin/orders"
                className="px-4 py-2 rounded-lg bg-yellow-500 text-white font-body font-medium hover:bg-yellow-600 transition-colors"
              >
                Review Orders
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default AdminDashboard;
