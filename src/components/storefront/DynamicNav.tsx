import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavMenuItem } from "@/hooks/useNavigationMenu";

interface DynamicNavItemProps {
  item: NavMenuItem;
  index: number;
}

export const DynamicNavItem = ({ item, index }: DynamicNavItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <motion.div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link
        to={item.href}
        className="flex items-center gap-1 px-4 py-2.5 font-body text-sm font-medium text-foreground hover:text-primary transition-all duration-300 rounded-xl hover:bg-gradient-to-r hover:from-primary/10 hover:to-gold/10 relative overflow-hidden group"
      >
        <span className="relative z-10">{item.label}</span>
        {hasChildren && (
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown size={14} />
          </motion.div>
        )}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-coral to-gold"
          initial={{ width: 0 }}
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.3 }}
        />
      </Link>

      {/* Dropdown for children */}
      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div
            className="absolute top-full left-0 w-56 bg-card/98 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Background gradient */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-coral/5 via-transparent to-gold/5 pointer-events-none"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {item.children!.map((child, childIndex) => (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: childIndex * 0.03, duration: 0.2 }}
              >
                <Link
                  to={child.href}
                  className="block px-4 py-2.5 font-body text-sm text-muted-foreground hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-transparent transition-all duration-200 relative group/item"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover/item:opacity-100 transition-opacity"
                    />
                    {child.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface DynamicNavProps {
  items: NavMenuItem[];
  startIndex?: number;
}

export const DynamicNav = ({ items, startIndex = 0 }: DynamicNavProps) => {
  if (!items || items.length === 0) return null;

  return (
    <>
      {items.map((item, index) => (
        <DynamicNavItem key={item.id} item={item} index={startIndex + index} />
      ))}
    </>
  );
};
