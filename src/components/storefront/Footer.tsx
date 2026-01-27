import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Footer = () => {
  const footerLinks = {
    shop: [
      { name: "New Arrivals", href: "#new" },
      { name: "Kurthis", href: "#kurthis" },
      { name: "Dresses", href: "#dresses" },
      { name: "Festive Collection", href: "#festive" },
      { name: "Sale", href: "#sale" },
    ],
    help: [
      { name: "Contact Us", href: "#contact" },
      { name: "Shipping Info", href: "#shipping" },
      { name: "Returns & Exchanges", href: "#returns" },
      { name: "Size Guide", href: "#size-guide" },
      { name: "Track Order", href: "/track-order" },
    ],
    company: [
      { name: "About Us", href: "#about" },
      { name: "Our Artisans", href: "#artisans" },
      { name: "Sustainability", href: "#sustainability" },
      { name: "Careers", href: "#careers" },
      { name: "Press", href: "#press" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "Youtube" },
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-light/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />

      {/* Newsletter Section */}
      <div className="border-b border-secondary-foreground/10 relative z-10">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="font-display text-3xl md:text-4xl font-bold mb-3">
                Stay in Style
              </h3>
              <p className="font-body text-base opacity-80">
                Subscribe for exclusive offers, new arrivals & styling tips
              </p>
            </div>
            <div className="flex gap-3 w-full lg:w-auto max-w-lg">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-5 py-4 rounded-xl bg-background/10 backdrop-blur-sm border border-secondary-foreground/20 placeholder:text-secondary-foreground/50 font-body focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-body font-semibold px-6 shadow-lg">
                Subscribe
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-2">
            <h2 className="font-display text-3xl font-bold mb-4">
              <span className="text-coral-light">Aroma</span> Ethnic
            </h2>
            <p className="font-body text-base opacity-80 mb-6 max-w-xs">
              Celebrating the timeless beauty of Indian craftsmanship through 
              contemporary ethnic wear for the modern woman.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a href="mailto:hello@aromaethnic.com" className="flex items-center gap-3 font-body text-sm opacity-80 hover:opacity-100 hover:text-accent transition-all">
                <div className="w-10 h-10 rounded-xl bg-secondary-foreground/10 flex items-center justify-center">
                  <Mail size={18} />
                </div>
                hello@aromaethnic.com
              </a>
              <a href="tel:+919876543210" className="flex items-center gap-3 font-body text-sm opacity-80 hover:opacity-100 hover:text-accent transition-all">
                <div className="w-10 h-10 rounded-xl bg-secondary-foreground/10 flex items-center justify-center">
                  <Phone size={18} />
                </div>
                +91 98765 43210
              </a>
              <div className="flex items-center gap-3 font-body text-sm opacity-80">
                <div className="w-10 h-10 rounded-xl bg-secondary-foreground/10 flex items-center justify-center">
                  <MapPin size={18} />
                </div>
                <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-12 h-12 rounded-xl bg-secondary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-display text-xl font-semibold mb-5">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="font-body text-sm opacity-70 hover:opacity-100 hover:text-accent transition-all">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="font-display text-xl font-semibold mb-5">Help</h4>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  {link.href.startsWith('/') ? (
                    <Link to={link.href} className="font-body text-sm opacity-70 hover:opacity-100 hover:text-accent transition-all">
                      {link.name}
                    </Link>
                  ) : (
                    <a href={link.href} className="font-body text-sm opacity-70 hover:opacity-100 hover:text-accent transition-all">
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-display text-xl font-semibold mb-5">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="font-body text-sm opacity-70 hover:opacity-100 hover:text-accent transition-all">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-foreground/10 relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="font-body text-sm opacity-70 flex items-center gap-1">
              © 2026 Aroma Ethnic. Made with <Heart className="w-4 h-4 text-coral-light fill-current" /> in India
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="#" className="font-body text-sm opacity-70 hover:opacity-100 hover:text-accent transition-all">
                Privacy Policy
              </a>
              <a href="#" className="font-body text-sm opacity-70 hover:opacity-100 hover:text-accent transition-all">
                Terms of Service
              </a>
              <a href="#" className="font-body text-sm opacity-70 hover:opacity-100 hover:text-accent transition-all">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
