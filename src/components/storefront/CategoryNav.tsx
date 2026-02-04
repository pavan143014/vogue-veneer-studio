import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCategories, CategoryWithChildren } from "@/hooks/useCategories";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

// Desktop Category Navigation with flyout menus
export function CategoryNav() {
  const { categoryTree, loading } = useCategories();
  const [isOpen, setIsOpen] = useState(false);

  if (loading || categoryTree.length === 0) return null;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <motion.button
          className="flex items-center gap-1 px-4 py-2.5 font-body text-sm font-medium text-foreground hover:text-primary transition-all duration-300 rounded-xl hover:bg-gradient-to-r hover:from-primary/10 hover:to-gold/10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.02 }}
        >
          Categories
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className="w-56 bg-card border border-border rounded-xl shadow-lg p-1"
        sideOffset={8}
      >
        {categoryTree.map((category) => (
          <CategoryMenuItem key={category.id} category={category} onClose={() => setIsOpen(false)} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Recursive category menu item with submenu support
function CategoryMenuItem({ category, onClose }: { category: CategoryWithChildren; onClose: () => void }) {
  const hasChildren = category.children.length > 0;

  if (hasChildren) {
    return (
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-muted cursor-pointer font-body text-sm">
          {category.name}
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className="w-48 bg-card border border-border rounded-xl shadow-lg p-1">
          {/* View All in this category */}
          <DropdownMenuItem asChild className="px-3 py-2 rounded-lg hover:bg-muted cursor-pointer">
            <Link 
              to={`/category/${category.slug}`} 
              onClick={onClose}
              className="font-body text-sm font-medium text-primary"
            >
              View All {category.name}
            </Link>
          </DropdownMenuItem>
          {/* Subcategories */}
          {category.children.map((child) => (
            <CategoryMenuItem key={child.id} category={child} onClose={onClose} />
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    );
  }

  return (
    <DropdownMenuItem asChild className="px-3 py-2 rounded-lg hover:bg-muted cursor-pointer">
      <Link to={`/category/${category.slug}`} onClick={onClose} className="font-body text-sm">
        {category.name}
      </Link>
    </DropdownMenuItem>
  );
}

// Mobile Category Navigation with accordion
export function MobileCategoryNav({ onClose }: { onClose: () => void }) {
  const { categoryTree, loading } = useCategories();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  if (loading || categoryTree.length === 0) return null;

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <motion.div
      className="border-b border-border/30 pb-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15, duration: 0.3 }}
    >
      <p className="px-2 py-2 font-body text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Shop by Category
      </p>
      <div className="space-y-1">
        {categoryTree.map((category) => (
          <MobileCategoryItem
            key={category.id}
            category={category}
            expandedCategories={expandedCategories}
            toggleCategory={toggleCategory}
            onClose={onClose}
            depth={0}
          />
        ))}
      </div>
    </motion.div>
  );
}

function MobileCategoryItem({
  category,
  expandedCategories,
  toggleCategory,
  onClose,
  depth,
}: {
  category: CategoryWithChildren;
  expandedCategories: Set<string>;
  toggleCategory: (id: string) => void;
  onClose: () => void;
  depth: number;
}) {
  const hasChildren = category.children.length > 0;
  const isExpanded = expandedCategories.has(category.id);

  return (
    <div style={{ paddingLeft: depth > 0 ? `${depth * 16}px` : 0 }}>
      <div className="flex items-center">
        {hasChildren ? (
          <button
            onClick={() => toggleCategory(category.id)}
            className="flex items-center justify-between w-full py-3 px-2 font-body text-sm text-foreground hover:text-primary transition-colors rounded-lg hover:bg-muted/50"
          >
            <span>{category.name}</span>
            <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
          </button>
        ) : (
          <Link
            to={`/category/${category.slug}`}
            onClick={onClose}
            className="flex items-center w-full py-3 px-2 font-body text-sm text-foreground hover:text-primary transition-colors rounded-lg hover:bg-muted/50"
          >
            {category.name}
          </Link>
        )}
      </div>

      <AnimatePresence>
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {/* View All link */}
            <Link
              to={`/category/${category.slug}`}
              onClick={onClose}
              className="block py-2 px-2 font-body text-sm text-primary hover:text-primary/80 transition-colors"
              style={{ paddingLeft: `${(depth + 1) * 16}px` }}
            >
              View All {category.name}
            </Link>
            {category.children.map((child) => (
              <MobileCategoryItem
                key={child.id}
                category={child}
                expandedCategories={expandedCategories}
                toggleCategory={toggleCategory}
                onClose={onClose}
                depth={depth + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CategoryNav;
