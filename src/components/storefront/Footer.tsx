import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useStorefrontContent, FooterContent } from "@/hooks/useStorefrontContent";

const socialIconMap: Record<string, any> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
};

const defaultFooter: FooterContent = {
  brand_name_1: "Aroma",
  brand_name_2: "Ethnic",
  brand_description: "Celebrating the timeless beauty of Indian craftsmanship through contemporary ethnic wear for the modern woman.",
  email: "hello@aromaethnic.com",
  phone: "+91 98765 43210",
  address: "Mumbai, Maharashtra, India",
  social_links: [
    { platform: "facebook", url: "#" },
    { platform: "instagram", url: "#" },
    { platform: "twitter", url: "#" },
    { platform: "youtube", url: "#" },
  ],
  shop_links: [
    { name: "New Arrivals", href: "#new" },
    { name: "Kurthis", href: "#kurthis" },
    { name: "Dresses", href: "#dresses" },
    { name: "Festive Collection", href: "#festive" },
    { name: "Sale", href: "#sale" },
  ],
  help_links: [
    { name: "Contact Us", href: "/contact" },
    { name: "Shipping Info", href: "#shipping" },
    { name: "Returns & Exchanges", href: "#returns" },
    { name: "Size Guide", href: "#size-guide" },
    { name: "Track Order", href: "/track-order" },
  ],
  company_links: [
    { name: "About Us", href: "/about" },
    { name: "Our Artisans", href: "/about#artisans" },
    { name: "Sustainability", href: "#sustainability" },
    { name: "Careers", href: "#careers" },
    { name: "Press", href: "#press" },
  ],
  copyright_text: "© 2026 Aroma Ethnic. Made with ❤️ in India",
  bottom_links: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
  ],
  newsletter_title: "Stay in Style",
  newsletter_subtitle: "Subscribe for exclusive offers, new arrivals & styling tips",
};

const FooterLinkItem = ({ link }: { link: { name: string; href: string } }) => {
  const isInternal = link.href.startsWith('/');
  const className = "font-body text-sm opacity-70 hover:opacity-100 hover:text-accent transition-all";
  return isInternal ? (
    <Link to={link.href} className={className}>{link.name}</Link>
  ) : (
    <a href={link.href} className={className}>{link.name}</a>
  );
};

const Footer = () => {
  const { content } = useStorefrontContent();
  const f = (content.footer as FooterContent) || defaultFooter;

  const brandName1 = f.brand_name_1 || defaultFooter.brand_name_1;
  const brandName2 = f.brand_name_2 || defaultFooter.brand_name_2;
  const brandDesc = f.brand_description || defaultFooter.brand_description;
  const email = f.email || defaultFooter.email;
  const phone = f.phone || defaultFooter.phone;
  const address = f.address || defaultFooter.address;
  const socialLinks = f.social_links?.length ? f.social_links : defaultFooter.social_links;
  const shopLinks = f.shop_links?.length ? f.shop_links : defaultFooter.shop_links;
  const helpLinks = f.help_links?.length ? f.help_links : defaultFooter.help_links;
  const companyLinks = f.company_links?.length ? f.company_links : defaultFooter.company_links;
  const copyrightText = f.copyright_text || defaultFooter.copyright_text;
  const bottomLinks = f.bottom_links?.length ? f.bottom_links : defaultFooter.bottom_links;
  const newsletterTitle = f.newsletter_title || defaultFooter.newsletter_title;
  const newsletterSubtitle = f.newsletter_subtitle || defaultFooter.newsletter_subtitle;

  return (
    <footer className="bg-secondary text-secondary-foreground relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-light/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />

      {/* Newsletter Section */}
      <div className="border-b border-secondary-foreground/10 relative z-10">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="font-display text-3xl md:text-4xl font-bold mb-3">{newsletterTitle}</h3>
              <p className="font-body text-base opacity-80">{newsletterSubtitle}</p>
            </div>
            <div className="flex gap-3 w-full lg:w-auto max-w-lg">
              <input type="email" placeholder="Your email address" className="flex-1 px-5 py-4 rounded-xl bg-background/10 backdrop-blur-sm border border-secondary-foreground/20 placeholder:text-secondary-foreground/50 font-body focus:outline-none focus:ring-2 focus:ring-accent" />
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-body font-semibold px-6 shadow-lg">
                Subscribe<ArrowRight className="ml-2 w-4 h-4" />
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
              <span className="text-coral-light">{brandName1}</span> {brandName2}
            </h2>
            <p className="font-body text-base opacity-80 mb-6 max-w-xs">{brandDesc}</p>
            
            <div className="space-y-3 mb-6">
              <a href={`mailto:${email}`} className="flex items-center gap-3 font-body text-sm opacity-80 hover:opacity-100 hover:text-accent transition-all">
                <div className="w-10 h-10 rounded-xl bg-secondary-foreground/10 flex items-center justify-center"><Mail size={18} /></div>
                {email}
              </a>
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-3 font-body text-sm opacity-80 hover:opacity-100 hover:text-accent transition-all">
                <div className="w-10 h-10 rounded-xl bg-secondary-foreground/10 flex items-center justify-center"><Phone size={18} /></div>
                {phone}
              </a>
              <div className="flex items-center gap-3 font-body text-sm opacity-80">
                <div className="w-10 h-10 rounded-xl bg-secondary-foreground/10 flex items-center justify-center"><MapPin size={18} /></div>
                <span>{address}</span>
              </div>
            </div>

            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = socialIconMap[social.platform] || Facebook;
                return (
                  <a key={social.platform} href={social.url} aria-label={social.platform} className="w-12 h-12 rounded-xl bg-secondary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all duration-300">
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-display text-xl font-semibold mb-5">Shop</h4>
            <ul className="space-y-3">
              {shopLinks.map((link) => <li key={link.name}><FooterLinkItem link={link} /></li>)}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="font-display text-xl font-semibold mb-5">Help</h4>
            <ul className="space-y-3">
              {helpLinks.map((link) => <li key={link.name}><FooterLinkItem link={link} /></li>)}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-display text-xl font-semibold mb-5">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => <li key={link.name}><FooterLinkItem link={link} /></li>)}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-foreground/10 relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="font-body text-sm opacity-70 flex items-center gap-1">
              {copyrightText}
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {bottomLinks.map((link) => (
                <a key={link.name} href={link.href} className="font-body text-sm opacity-70 hover:opacity-100 hover:text-accent transition-all">
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
