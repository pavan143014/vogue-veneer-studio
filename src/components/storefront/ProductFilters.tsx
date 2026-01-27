import { useState } from "react";
import { Filter, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";

export interface FilterState {
  priceRange: [number, number];
  categories: string[];
  sortBy: string;
}

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  maxPrice?: number;
}

const categories = [
  { id: "kurthis", label: "Kurthis" },
  { id: "dresses", label: "Dresses" },
  { id: "festive", label: "Festive Wear" },
  { id: "casual", label: "Casual Wear" },
  { id: "silk", label: "Silk Collection" },
  { id: "cotton", label: "Cotton Collection" },
];

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
];

const ProductFilters = ({ filters, onFilterChange, maxPrice = 5000 }: ProductFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(["price", "categories"]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const handlePriceChange = (value: number[]) => {
    onFilterChange({ ...filters, priceRange: [value[0], value[1]] });
  };

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter((c) => c !== categoryId)
      : [...filters.categories, categoryId];
    onFilterChange({ ...filters, categories: newCategories });
  };

  const handleSortChange = (sortBy: string) => {
    onFilterChange({ ...filters, sortBy });
  };

  const clearFilters = () => {
    onFilterChange({
      priceRange: [0, maxPrice],
      categories: [],
      sortBy: "relevance",
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < maxPrice ||
    filters.sortBy !== "relevance";

  return (
    <div className="space-y-4">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          className="w-full justify-between"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters & Sort
            {hasActiveFilters && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
        </Button>
      </div>

      {/* Filter Content */}
      <AnimatePresence>
        {(isExpanded || true) && (
          <motion.div
            className={`space-y-6 ${!isExpanded ? "hidden lg:block" : ""}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {/* Clear Filters */}
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={clearFilters}
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear all filters
                </Button>
              </motion.div>
            )}

            {/* Sort By */}
            <div className="bg-card rounded-2xl p-5 border border-border">
              <button
                className="flex items-center justify-between w-full font-body font-medium text-foreground"
                onClick={() => toggleSection("sort")}
              >
                <span>Sort By</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    expandedSections.includes("sort") ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {expandedSections.includes("sort") && (
                  <motion.div
                    className="mt-4 space-y-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        className={`w-full text-left px-3 py-2 rounded-lg font-body text-sm transition-colors ${
                          filters.sortBy === option.value
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted text-muted-foreground"
                        }`}
                        onClick={() => handleSortChange(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Price Range */}
            <div className="bg-card rounded-2xl p-5 border border-border">
              <button
                className="flex items-center justify-between w-full font-body font-medium text-foreground"
                onClick={() => toggleSection("price")}
              >
                <span>Price Range</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    expandedSections.includes("price") ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {expandedSections.includes("price") && (
                  <motion.div
                    className="mt-4 space-y-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Slider
                      value={filters.priceRange}
                      onValueChange={handlePriceChange}
                      min={0}
                      max={maxPrice}
                      step={100}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm font-body text-muted-foreground">
                      <span>₹{filters.priceRange[0]}</span>
                      <span>₹{filters.priceRange[1]}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Categories */}
            <div className="bg-card rounded-2xl p-5 border border-border">
              <button
                className="flex items-center justify-between w-full font-body font-medium text-foreground"
                onClick={() => toggleSection("categories")}
              >
                <span>Categories</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    expandedSections.includes("categories") ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {expandedSections.includes("categories") && (
                  <motion.div
                    className="mt-4 space-y-3"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {categories.map((category) => (
                      <label
                        key={category.id}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <Checkbox
                          checked={filters.categories.includes(category.id)}
                          onCheckedChange={() => handleCategoryToggle(category.id)}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <span className="font-body text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                          {category.label}
                        </span>
                      </label>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductFilters;
