import { useState } from "react";
import { Search, ShoppingBag, Heart, Menu, X, User, ChevronDown } from "lucide-react";
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
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      {/* Top banner */}
      <div className="bg-accent text-accent-foreground text-center py-2 text-xs md:text-sm font-body tracking-wide">
        ✨ Free Shipping on Orders Above ₹999 | Use Code: ETHNIC20 for 20% Off ✨
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
            <Link to="/" className="inline-block">
              <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground tracking-wide">
                <span className="text-primary">Aroma</span>
                <span className="text-accent"> Ethnic</span>
              </h1>
            </Link>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-1 md:gap-2">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <User size={20} />
            </Button>
            <ThemeToggle />
            <Button variant="ghost" size="icon">
              <Heart size={20} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center gap-1 py-2 border-t border-border/50">
          {categories.map((category) => (
            <div
              key={category.name}
              className="relative group"
              onMouseEnter={() => setActiveCategory(category.name)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              <Link
                to={category.href}
                className="flex items-center gap-1 px-4 py-2 font-body text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                {category.name}
                <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
              </Link>

              {/* Dropdown */}
              {activeCategory === category.name && (
                <div className="absolute top-full left-0 w-56 bg-background border border-border rounded-lg shadow-xl py-2 animate-fade-in z-50">
                  {category.subcategories.map((sub) => (
                    <Link
                      key={sub.name}
                      to={sub.href}
                      className="block px-4 py-2 font-body text-sm text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border animate-fade-in max-h-[70vh] overflow-y-auto">
          <nav className="container mx-auto px-4 py-4">
            {categories.map((category) => (
              <div key={category.name} className="border-b border-border/50">
                <button
                  onClick={() => 
                    setMobileExpandedCategory(
                      mobileExpandedCategory === category.name ? null : category.name
                    )
                  }
                  className="flex items-center justify-between w-full py-3 font-body text-base font-medium text-foreground"
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
                  <div className="pb-3 pl-4 space-y-2 animate-fade-in">
                    <Link
                      to={category.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-1 font-body text-sm text-primary font-medium"
                    >
                      View All {category.name}
                    </Link>
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub.name}
                        to={sub.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="block py-1 font-body text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            <div className="flex items-center gap-4 pt-4 mt-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Search size={16} className="mr-2" />
                Search
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
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
