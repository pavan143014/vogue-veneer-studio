import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronDown, Menu, X, ExternalLink } from "lucide-react";
import { useState } from "react";
import { MenuItem } from "./SortableMenuItem";
import { motion, AnimatePresence } from "framer-motion";

interface MenuPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menuType: "header" | "footer";
  items: MenuItem[];
}

const HeaderPreview = ({ items }: { items: MenuItem[] }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <div className="bg-background rounded-xl border border-border overflow-hidden">
      {/* Promo banner simulation */}
      <div className="bg-gradient-to-r from-coral via-gold to-teal text-primary-foreground text-center py-2 text-xs font-medium">
        ✨ Free Shipping on Orders Above ₹999 ✨
      </div>

      {/* Header simulation */}
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Mobile menu icon */}
          <div className="lg:hidden">
            <Menu className="h-5 w-5 text-muted-foreground" />
          </div>

          {/* Logo */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <span className="font-display text-lg font-bold">
              <span className="text-primary">Aroma</span>
              <span className="text-secondary"> Ethnic</span>
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {items.map((item) => (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() =>
                  item.children?.length
                    ? setActiveDropdown(item.id)
                    : setActiveDropdown(null)
                }
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/10">
                  {item.label}
                  {item.children && item.children.length > 0 && (
                    <ChevronDown
                      className={`h-3 w-3 transition-transform ${
                        activeDropdown === item.id ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {activeDropdown === item.id &&
                    item.children &&
                    item.children.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute top-full left-0 mt-1 w-40 bg-card border border-border rounded-lg shadow-lg py-1 z-10"
                      >
                        {item.children.map((child) => (
                          <div
                            key={child.id}
                            className="px-3 py-2 text-xs text-foreground hover:bg-muted hover:text-primary transition-colors cursor-pointer"
                          >
                            {child.label}
                          </div>
                        ))}
                      </motion.div>
                    )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-muted" />
            <div className="w-5 h-5 rounded-full bg-muted" />
          </div>
        </div>
      </div>

      {/* Content placeholder */}
      <div className="p-8 text-center">
        <div className="text-muted-foreground text-sm">
          Page content would appear here
        </div>
      </div>
    </div>
  );
};

const FooterPreview = ({ items }: { items: MenuItem[] }) => {
  return (
    <div className="bg-secondary text-secondary-foreground rounded-xl overflow-hidden">
      {/* Newsletter section */}
      <div className="border-b border-secondary-foreground/10 px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-lg font-bold">Stay in Style</h3>
            <p className="text-xs opacity-70">Subscribe for exclusive offers</p>
          </div>
          <div className="flex gap-2">
            <div className="w-32 h-8 rounded-lg bg-background/10" />
            <div className="w-20 h-8 rounded-lg bg-accent" />
          </div>
        </div>
      </div>

      {/* Links from database */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-1">
            <h2 className="font-display text-lg font-bold mb-2">
              <span className="text-coral-light">Aroma</span> Ethnic
            </h2>
            <p className="text-xs opacity-70 mb-3">
              Celebrating Indian craftsmanship through contemporary ethnic wear.
            </p>
          </div>

          {/* Dynamic menu items */}
          <div>
            <h4 className="font-display text-sm font-semibold mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {items.slice(0, 5).map((item) => (
                <li key={item.id}>
                  <span className="text-xs opacity-70 hover:opacity-100 cursor-pointer flex items-center gap-1">
                    {item.label}
                    <ExternalLink className="h-2.5 w-2.5" />
                  </span>
                  {item.children && item.children.length > 0 && (
                    <ul className="ml-3 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <span className="text-[10px] opacity-50">
                            {child.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* More items if available */}
          {items.length > 5 && (
            <div>
              <h4 className="font-display text-sm font-semibold mb-3">More</h4>
              <ul className="space-y-2">
                {items.slice(5, 10).map((item) => (
                  <li key={item.id}>
                    <span className="text-xs opacity-70">{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-secondary-foreground/10 px-6 py-4">
        <p className="text-xs opacity-50 text-center">
          © 2026 Aroma Ethnic. Made with ♥ in India
        </p>
      </div>
    </div>
  );
};

export const MenuPreviewDialog = ({
  open,
  onOpenChange,
  menuType,
  items,
}: MenuPreviewDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            {menuType === "header" ? "Header" : "Footer"} Preview
            <span className="text-xs font-normal text-muted-foreground px-2 py-0.5 bg-muted rounded-full">
              {items.length} items
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-4">
            This is how your menu will appear on the storefront. Hover over
            items with sub-menus to see dropdowns.
          </p>
          {menuType === "header" ? (
            <HeaderPreview items={items} />
          ) : (
            <FooterPreview items={items} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
