import { useState, useEffect } from "react";
import { Search, ShoppingBag, Menu, X, User, ChevronDown, Sparkles, Gift, Percent, Package, LogIn, UserPlus, HelpCircle, Heart, Tag, Clock, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { categories } from "@/data/categories";
import { motion, AnimatePresence } from "framer-motion";
import WishlistDrawer from "./WishlistDrawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const promoMessages = [
  { icon: Sparkles, text: "✨ Free Shipping on Orders Above ₹999 ✨" },
  { icon: Gift, text: "🎁 Buy 2 Get 1 Free on Selected Items 🎁" },
  { icon: Percent, text: "🔥 Use Code: ETHNIC30 for 30% Off 🔥" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mobileExpandedCategory, setMobileExpandedCategory] = useState<string | null>(null);
  const [currentPromo, setCurrentPromo] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { totalItems, setCartOpen } = useCartStore();
  const itemCount = totalItems();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promoMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const CurrentIcon = promoMessages[currentPromo].icon;

  return (
    <motion.header 
      className={`sticky top-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-background/95 backdrop-blur-xl shadow-lg border-b border-border" 
          : "bg-background/80 backdrop-blur-lg border-b border-border/50"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Animated promotional banner */}
      <div className="bg-gradient-to-r from-coral via-gold to-teal text-primary-foreground text-center py-2.5 relative overflow-hidden">
        <div className="absolute inset-0 shimmer opacity-30" />
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentPromo}
            className="relative z-10 flex items-center justify-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <CurrentIcon className="w-4 h-4 animate-pulse" />
            <span className="font-body text-xs md:text-sm font-semibold tracking-wide">
              {promoMessages[currentPromo].text}
            </span>
            <CurrentIcon className="w-4 h-4 animate-pulse" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu button */}
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-primary/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>

          {/* Logo */}
          <motion.div 
            className="flex-1 md:flex-none text-center md:text-left"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Link to="/" className="inline-block group relative">
              <motion.div
                className="absolute -inset-2 bg-gradient-to-r from-coral/20 via-gold/20 to-teal/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight relative">
                <motion.span 
                  className="text-primary inline-block"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  Aroma
                </motion.span>
                <span className="text-secondary"> Ethnic</span>
              </h1>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Link
                to="/shop"
                className="flex items-center gap-1 px-4 py-2.5 font-body text-sm font-medium text-foreground hover:text-primary transition-all duration-300 rounded-xl hover:bg-gradient-to-r hover:from-primary/10 hover:to-gold/10"
              >
                Shop All
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              <Link
                to="/track-order"
                className="flex items-center gap-1.5 px-4 py-2.5 font-body text-sm font-medium text-foreground hover:text-primary transition-all duration-300 rounded-xl hover:bg-gradient-to-r hover:from-primary/10 hover:to-gold/10"
              >
                <Package size={16} />
                Track Order
              </Link>
            </motion.div>
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                className="relative group"
                onMouseEnter={() => setActiveCategory(category.name)}
                onMouseLeave={() => setActiveCategory(null)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index + 1) * 0.1, duration: 0.4 }}
              >
                <Link
                  to={category.href}
                  className="flex items-center gap-1 px-4 py-2.5 font-body text-sm font-medium text-foreground hover:text-primary transition-all duration-300 rounded-xl hover:bg-gradient-to-r hover:from-primary/10 hover:to-gold/10 relative overflow-hidden group"
                >
                  <span className="relative z-10">{category.name}</span>
                  <motion.div
                    animate={{ rotate: activeCategory === category.name ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={14} />
                  </motion.div>
                  <motion.div 
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-coral to-gold"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>

                {/* Animated Dropdown */}
                <AnimatePresence>
                  {activeCategory === category.name && (
                    <motion.div 
                      className="absolute top-full left-0 w-64 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl py-3 z-50 overflow-hidden"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-br from-coral/5 via-transparent to-gold/5"
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                      {category.subcategories.map((sub, subIndex) => (
                        <motion.div
                          key={sub.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: subIndex * 0.05, duration: 0.2 }}
                        >
                          <Link
                            to={sub.href}
                            className="block px-5 py-3 font-body text-sm text-muted-foreground hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-transparent transition-all duration-200 relative group/item"
                          >
                            <span className="relative z-10 flex items-center gap-2">
                              <motion.span 
                                className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover/item:opacity-100"
                                initial={{ scale: 0 }}
                                whileHover={{ scale: 1 }}
                              />
                              {sub.name}
                            </span>
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Search Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:block"
            >
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-gradient-to-br hover:from-primary/10 hover:to-gold/10 hover:text-primary transition-all duration-300 rounded-xl"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search size={20} />
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="hidden md:block"
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="hover:bg-gradient-to-br hover:from-primary/10 hover:to-gold/10 hover:text-primary transition-all duration-300 rounded-xl"
                  >
                    <User size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl">
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/contact" className="flex items-center gap-2">
                      <LogIn size={16} />
                      Sign In
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/contact" className="flex items-center gap-2">
                      <UserPlus size={16} />
                      Create Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/track-order" className="flex items-center gap-2">
                      <Package size={16} />
                      Track Order
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/contact" className="flex items-center gap-2">
                      <HelpCircle size={16} />
                      Help & Support
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <ThemeToggle />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <WishlistDrawer />
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative hover:bg-gradient-to-br hover:from-primary/10 hover:to-gold/10 hover:text-primary transition-all duration-300 rounded-xl"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingBag size={20} />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span 
                      className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-coral to-coral-dark text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center shadow-lg"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Search Bar Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              className="absolute top-full left-0 right-0 bg-card/95 backdrop-blur-xl border-b border-border p-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="container mx-auto">
                <form 
                  className="flex items-center gap-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim()) {
                      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
                      setIsSearchOpen(false);
                      setSearchQuery("");
                    }
                  }}
                >
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search for kurthis, dresses, festive wear..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-border focus:border-primary bg-background font-body text-base outline-none transition-colors"
                      autoFocus
                    />
                  </div>
                  <Button type="submit" className="bg-primary hover:bg-primary/90 px-6">
                    Search
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sub Header Navigation Menu */}
      <div className="hidden md:block border-t border-border/30 bg-muted/30">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-center gap-1">
            <Link
              to="/shop"
              className="flex items-center gap-2 px-4 py-2.5 font-body text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <Tag size={14} />
              New Arrivals
            </Link>
            <span className="text-border">|</span>
            <Link
              to="/shop?collection=bestsellers"
              className="flex items-center gap-2 px-4 py-2.5 font-body text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <Heart size={14} />
              Best Sellers
            </Link>
            <span className="text-border">|</span>
            <Link
              to="/shop?collection=sale"
              className="flex items-center gap-2 px-4 py-2.5 font-body text-xs font-medium text-coral hover:text-coral-dark transition-colors"
            >
              <Percent size={14} />
              Sale
            </Link>
            <span className="text-border">|</span>
            {categories.slice(0, 5).map((category, index) => (
              <div key={category.name} className="flex items-center">
                <Link
                  to={category.href}
                  className="px-4 py-2.5 font-body text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {category.name}
                </Link>
                {index < 4 && <span className="text-border">|</span>}
              </div>
            ))}
            <span className="text-border">|</span>
            <Link
              to="/track-order"
              className="flex items-center gap-2 px-4 py-2.5 font-body text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <Truck size={14} />
              Track Order
            </Link>
            <span className="text-border">|</span>
            <Link
              to="/about"
              className="flex items-center gap-2 px-4 py-2.5 font-body text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              About Us
            </Link>
            <span className="text-border">|</span>
            <Link
              to="/contact"
              className="flex items-center gap-2 px-4 py-2.5 font-body text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="lg:hidden bg-card/95 backdrop-blur-xl border-t border-border max-h-[70vh] overflow-y-auto"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="container mx-auto px-4 py-4">
              {categories.map((category, index) => (
                <motion.div 
                  key={category.name} 
                  className="border-b border-border/30"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <button
                    onClick={() => 
                      setMobileExpandedCategory(
                        mobileExpandedCategory === category.name ? null : category.name
                      )
                    }
                    className="flex items-center justify-between w-full py-4 font-body text-base font-medium text-foreground group"
                  >
                    <span className="flex items-center gap-2">
                      <motion.span 
                        className="w-2 h-2 rounded-full bg-gradient-to-r from-coral to-gold"
                        animate={{ scale: mobileExpandedCategory === category.name ? 1.2 : 1 }}
                      />
                      {category.name}
                    </span>
                    <motion.div
                      animate={{ rotate: mobileExpandedCategory === category.name ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown size={18} />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {mobileExpandedCategory === category.name && (
                      <motion.div 
                        className="pb-4 pl-6 space-y-1"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link
                          to={category.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="block py-2.5 font-body text-sm text-primary font-semibold"
                        >
                          View All {category.name}
                        </Link>
                        {category.subcategories.map((sub, subIndex) => (
                          <motion.div
                            key={sub.name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: subIndex * 0.05 }}
                          >
                            <Link
                              to={sub.href}
                              onClick={() => setIsMenuOpen(false)}
                              className="block py-2.5 font-body text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                            >
                              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                              {sub.name}
                            </Link>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
              
              <motion.div 
                className="space-y-3 pt-6 mt-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  to="/shop"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full"
                >
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 rounded-xl"
                  >
                    <ShoppingBag size={16} className="mr-2" />
                    Shop All Products
                  </Button>
                </Link>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-xl transition-all duration-300"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsSearchOpen(true);
                    }}
                  >
                    <Search size={16} className="mr-2" />
                    Search
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground rounded-xl transition-all duration-300"
                  >
                    <User size={16} className="mr-2" />
                    Account
                  </Button>
                </div>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
