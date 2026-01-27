import { Home, ShoppingBag, Heart, User, Store } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Store, label: "Shop", href: "/shop" },
  { icon: ShoppingBag, label: "Cart", href: "#cart", isCart: true },
  { icon: Heart, label: "Wishlist", href: "#wishlist", isWishlist: true },
  { icon: User, label: "Account", href: "/contact" },
];

const MobileBottomNav = () => {
  const location = useLocation();
  const { totalItems, setCartOpen } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const cartCount = totalItems();
  const wishlistCount = wishlistItems.length;

  const handleNavClick = (item: typeof navItems[0], e: React.MouseEvent) => {
    if (item.isCart) {
      e.preventDefault();
      setCartOpen(true);
    }
    // Wishlist will be handled by the WishlistDrawer trigger
  };

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-xl border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.1)]"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex items-center justify-around h-16 px-2 safe-area-inset-bottom">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          const badgeCount = item.isCart ? cartCount : item.isWishlist ? wishlistCount : 0;

          if (item.isWishlist) {
            // Wishlist uses the existing drawer - we'll trigger it differently
            return (
              <Link
                key={item.label}
                to="/shop"
                onClick={(e) => {
                  // For now, navigate to shop - wishlist drawer can be opened from header
                }}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full gap-0.5 relative transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <div className="relative">
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  {badgeCount > 0 && (
                    <motion.span
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-coral text-[10px] font-bold text-white rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      {badgeCount > 9 ? "9+" : badgeCount}
                    </motion.span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            );
          }

          return (
            <Link
              key={item.label}
              to={item.isCart ? "#" : item.href}
              onClick={(e) => handleNavClick(item, e)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-0.5 relative transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {badgeCount > 0 && (
                  <motion.span
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-coral text-[10px] font-bold text-white rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    {badgeCount > 9 ? "9+" : badgeCount}
                  </motion.span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"
                  layoutId="activeTab"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default MobileBottomNav;
