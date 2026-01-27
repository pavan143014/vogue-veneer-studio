import { useState } from "react";
import { Search, ShoppingBag, Heart, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();

  const navLinks = [
    { name: "New Arrivals", href: "/#new" },
    { name: "Kurthis", href: "/#kurthis" },
    { name: "Dresses", href: "/#dresses" },
    { name: "Collections", href: "/#collections" },
    { name: "Sale", href: "/#sale" },
  ];

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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-body text-sm font-medium text-foreground hover:text-primary transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

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
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border animate-fade-in">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                className="font-body text-base font-medium text-foreground hover:text-primary transition-colors py-2 border-b border-border/50"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="flex items-center gap-4 pt-2">
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
