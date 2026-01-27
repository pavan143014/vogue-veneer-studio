import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      { name: "FAQs", href: "#faqs" },
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
    <footer className="bg-accent text-accent-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-accent-foreground/10">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="font-display text-2xl md:text-3xl font-semibold mb-2">
                Stay in Style
              </h3>
              <p className="font-body text-sm opacity-80">
                Subscribe for exclusive offers, new arrivals & styling tips
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto max-w-md">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-lg bg-background/10 backdrop-blur-sm border border-accent-foreground/20 placeholder:text-accent-foreground/50 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button className="bg-primary hover:bg-primary/90 font-body text-sm px-6">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-2">
            <h2 className="font-display text-2xl font-semibold mb-4">
              <span className="text-primary">Aroma</span> Ethnic
            </h2>
            <p className="font-body text-sm opacity-80 mb-6 max-w-xs">
              Celebrating the timeless beauty of Indian craftsmanship through 
              contemporary ethnic wear for the modern woman.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a href="mailto:hello@aromaethnic.com" className="flex items-center gap-3 font-body text-sm opacity-80 hover:opacity-100 transition-opacity">
                <Mail size={16} />
                hello@aromaethnic.com
              </a>
              <a href="tel:+919876543210" className="flex items-center gap-3 font-body text-sm opacity-80 hover:opacity-100 transition-opacity">
                <Phone size={16} />
                +91 98765 43210
              </a>
              <div className="flex items-start gap-3 font-body text-sm opacity-80">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
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
                  className="w-10 h-10 rounded-full bg-accent-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="font-body text-sm opacity-80 hover:opacity-100 hover:text-primary transition-all">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Help</h4>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="font-body text-sm opacity-80 hover:opacity-100 hover:text-primary transition-all">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="font-body text-sm opacity-80 hover:opacity-100 hover:text-primary transition-all">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-accent-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="font-body text-xs opacity-70">
              © 2024 Aroma Ethnic. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <a href="#" className="font-body text-xs opacity-70 hover:opacity-100 transition-opacity">
                Privacy Policy
              </a>
              <a href="#" className="font-body text-xs opacity-70 hover:opacity-100 transition-opacity">
                Terms of Service
              </a>
              <a href="#" className="font-body text-xs opacity-70 hover:opacity-100 transition-opacity">
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
