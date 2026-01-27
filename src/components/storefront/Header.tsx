import { useState } from "react";
import { Search, ShoppingBag, Heart, Menu, X, User, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { categories } from "@/data/categories";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mobileExpandedCategory, setMobileExpandedCategory] = useState<string | null>(null);
  const { totalItems, setCartOpen } = useCartStore();
  const itemCount = totalItems();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      {/* Top promotional banner */}
      <div className="bg-gradient-to-r from-coral via-gold to-teal text-primary-foreground text-center py-2.5 relative overflow-hidden">
        <div className="absolute inset-0 shimmer opacity-20" />
        <div className="relative z-10 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span className="font-body text-xs md:text-sm font-medium tracking-wide">
            ✨ Free Shipping on Orders Above ₹999 | Use Code: ETHNIC30 for 30% Off ✨
          </span>
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>

          {/* Logo */}
          <div className="flex-1 md:flex-none text-center md:text-left">
            <Link to="/" className="inline-block group">
              <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
                <span className="text-primary group-hover:text-coral-dark transition-colors">Aroma</span>
                <span className="text-secondary"> Ethnic</span>
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {categories.map((category) => (
              <div
                key={category.name}
                className="relative group"
                onMouseEnter={() => setActiveCategory(category.name)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <Link
                  to={category.href}
                  className="flex items-center gap-1 px-4 py-2 font-body text-sm font-medium text-foreground hover:text-primary transition-colors rounded-lg hover:bg-muted"
                >
                  {category.name}
                  <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                </Link>

                {/* Dropdown */}
                {activeCategory === category.name && (
                  <div className="absolute top-full left-0 w-60 bg-card border border-border rounded-xl shadow-2xl py-3 animate-fade-in z-50">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub.name}
                        to={sub.href}
                        className="block px-5 py-2.5 font-body text-sm text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-1 md:gap-2">
            <Button variant="ghost" size="icon" className="hidden md:flex hover:bg-muted hover:text-primary">
              <Search size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex hover:bg-muted hover:text-primary">
              <User size={20} />
            </Button>
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="hover:bg-muted hover:text-primary">
              <Heart size={20} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-muted hover:text-primary"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                  {itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border animate-fade-in max-h-[70vh] overflow-y-auto">
          <nav className="container mx-auto px-4 py-4">
            {categories.map((category) => (
              <div key={category.name} className="border-b border-border/50">
                <button
                  onClick={() => 
                    setMobileExpandedCategory(
                      mobileExpandedCategory === category.name ? null : category.name
                    )
                  }
                  className="flex items-center justify-between w-full py-4 font-body text-base font-medium text-foreground"
                >
                  {category.name}
                  <ChevronDown 
                    size={18} 
                    className={`transition-transform ${
                      mobileExpandedCategory === category.name ? "rotate-180" : ""
                    }`} 
                  />
                </button>
                
                {mobileExpandedCategory === category.name && (
                  <div className="pb-4 pl-4 space-y-2 animate-fade-in">
                    <Link
                      to={category.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-2 font-body text-sm text-primary font-medium"
                    >
                      View All {category.name}
                    </Link>
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub.name}
                        to={sub.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="block py-2 font-body text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            <div className="flex items-center gap-4 pt-6 mt-2">
              <Button variant="outline" size="sm" className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Search size={16} className="mr-2" />
                Search
              </Button>
              <Button variant="outline" size="sm" className="flex-1 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground">
                <User size={16} className="mr-2" />
                Account
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
