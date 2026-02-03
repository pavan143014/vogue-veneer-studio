import { Home, ShoppingBag, Heart, User, Store } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useLocalCartStore } from "@/stores/localCartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Store, label: "Shop", href: "/shop" },
  { icon: ShoppingBag, label: "Cart", href: "#cart", isCart: true },
  { icon: Heart, label: "Wishlist", href: "#wishlist", isWishlist: true },
  { icon: User, label: "Account", href: "/contact" },
];

const MobileBottomNav = () => {
  const location = useLocation();
  const { totalItems, setCartOpen } = useLocalCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const cartCount = totalItems();
  const wishlistCount = wishlistItems.length;
  const [tappedItem, setTappedItem] = useState<string | null>(null);

  const handleNavClick = (item: typeof navItems[0], e: React.MouseEvent) => {
    // Trigger haptic feedback animation
    setTappedItem(item.label);
    setTimeout(() => setTappedItem(null), 300);

    // Trigger device haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }

    if (item.isCart) {
      e.preventDefault();
      setCartOpen(true);
    }
  };

  const NavItem = ({ item }: { item: typeof navItems[0] }) => {
    const isActive = location.pathname === item.href;
    const Icon = item.icon;
    const badgeCount = item.isCart ? cartCount : item.isWishlist ? wishlistCount : 0;
    const isTapped = tappedItem === item.label;

    return (
      <Link
        key={item.label}
        to={item.isCart || item.isWishlist ? "#" : item.href}
        onClick={(e) => handleNavClick(item, e)}
        className={cn(
          "flex flex-col items-center justify-center flex-1 h-full gap-0.5 relative transition-colors",
          isActive ? "text-primary" : "text-muted-foreground"
        )}
      >
        {/* Ripple effect on tap */}
        <AnimatePresence>
          {isTapped && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-12 h-12 rounded-full bg-primary/20"
                initial={{ scale: 0, opacity: 0.8 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Icon with bounce animation */}
        <motion.div 
          className="relative"
          animate={isTapped ? { 
            scale: [1, 0.8, 1.15, 1],
            rotate: [0, -5, 5, 0]
          } : { scale: 1 }}
          transition={{ 
            duration: 0.3, 
            ease: "easeInOut",
            times: [0, 0.2, 0.6, 1]
          }}
        >
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
        </motion.div>

        {/* Label with scale animation */}
        <motion.span 
          className="text-[10px] font-medium"
          animate={isTapped ? { 
            scale: [1, 0.9, 1.1, 1],
            y: [0, 1, -1, 0]
          } : { scale: 1, y: 0 }}
          transition={{ 
            duration: 0.3, 
            ease: "easeInOut",
            times: [0, 0.2, 0.6, 1]
          }}
        >
          {item.label}
        </motion.span>

        {/* Active indicator */}
        {isActive && (
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"
            layoutId="activeTab"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}

        {/* Glow effect on active tap */}
        <AnimatePresence>
          {isTapped && (
            <motion.div
              className="absolute inset-x-2 bottom-1 h-1 bg-primary/30 blur-md rounded-full"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
      </Link>
    );
  };

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-xl border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.1)]"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex items-center justify-around h-16 px-2 safe-area-inset-bottom">
        {navItems.map((item) => (
          <NavItem key={item.label} item={item} />
        ))}
      </div>
    </motion.nav>
  );
};

export default MobileBottomNav;
