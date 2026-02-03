import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import ProductCard from "@/components/storefront/ProductCard";
import ProductSearch from "@/components/storefront/ProductSearch";
import ProductFilters, { FilterState } from "@/components/storefront/ProductFilters";
import { products } from "@/data/products";
import { ShoppingBag, Sparkles, Grid3X3, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [gridView, setGridView] = useState<"grid" | "large">("grid");
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 10000],
    categories: [],
    sortBy: "relevance",
  });

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }
    
    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter(product => 
        filters.categories.includes(product.category)
      );
    }
    
    // Price filter
    result = result.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );
    
    // Sort
    switch (filters.sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result = result.filter(p => p.isNew).concat(result.filter(p => !p.isNew));
        break;
    }
    
    return result;
  }, [searchQuery, filters]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      setSearchParams({ search: query });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-16">
        {/* Hero Section */}
        <motion.section 
          className="relative py-16 md:py-24 bg-gradient-to-br from-coral/10 via-background to-gold/10 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              className="absolute top-10 right-10 w-64 h-64 bg-coral/10 rounded-full blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
            <motion.div 
              className="absolute bottom-10 left-10 w-80 h-80 bg-gold/10 rounded-full blur-3xl"
              animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="text-center mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="font-body text-sm tracking-wider uppercase text-primary font-medium">
                  Discover Your Style
                </span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                Shop <span className="text-gradient">Collection</span>
              </h1>
              <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto">
                Explore our curated collection of handcrafted ethnic wear
              </p>
            </motion.div>
            
            {/* Search Bar */}
            <motion.div 
              className="max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ProductSearch onSearch={handleSearch} showDropdown={false} />
            </motion.div>
          </div>
        </motion.section>

        {/* Products Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filters */}
              <aside className="lg:w-72 flex-shrink-0">
                <ProductFilters 
                  filters={filters} 
                  onFilterChange={setFilters}
                  maxPrice={10000}
                />
              </aside>
              
              {/* Products Grid */}
              <div className="flex-1">
                {/* Toolbar */}
                <motion.div 
                  className="flex items-center justify-between mb-6 bg-card rounded-2xl p-4 border border-border"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="font-body text-muted-foreground">
                    Showing <span className="text-foreground font-medium">{filteredProducts.length}</span> products
                    {searchQuery && (
                      <span className="text-foreground"> for "{searchQuery}"</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant={gridView === "grid" ? "default" : "ghost"}
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => setGridView("grid")}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={gridView === "large" ? "default" : "ghost"}
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => setGridView("large")}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                  <motion.div 
                    className="text-center py-20 bg-card rounded-3xl border-2 border-dashed border-border"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <motion.div 
                      className="w-24 h-24 rounded-full bg-gradient-to-br from-coral/20 to-gold/20 flex items-center justify-center mx-auto mb-6"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <ShoppingBag size={40} className="text-primary" />
                    </motion.div>
                    <h3 className="font-display text-3xl font-bold text-foreground mb-3">
                      No products found
                    </h3>
                    <p className="font-body text-muted-foreground max-w-md mx-auto text-lg mb-6">
                      {searchQuery 
                        ? `No products match "${searchQuery}". Try a different search term.`
                        : "No products match your filters. Try adjusting your criteria."}
                    </p>
                    <Button 
                      onClick={() => {
                        setSearchQuery("");
                        setFilters({ priceRange: [0, 10000], categories: [], sortBy: "relevance" });
                        setSearchParams({});
                      }}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Clear all filters
                    </Button>
                  </motion.div>
                )}

                {/* Products Grid */}
                {filteredProducts.length > 0 && (
                  <motion.div 
                    className={`grid gap-4 md:gap-6 ${
                      gridView === "grid" 
                        ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-3" 
                        : "grid-cols-1 md:grid-cols-2"
                    }`}
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: {
                        transition: { staggerChildren: 0.05 }
                      }
                    }}
                  >
                    {filteredProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        variants={{
                          hidden: { opacity: 0, y: 20, scale: 0.95 },
                          visible: { 
                            opacity: 1, 
                            y: 0, 
                            scale: 1,
                            transition: { duration: 0.4 }
                          }
                        }}
                      >
                        <ProductCard 
                          id={product.id}
                          name={product.name}
                          price={product.price}
                          originalPrice={product.originalPrice}
                          image={product.image}
                          category={product.category}
                          isNew={product.isNew}
                          isSale={product.isSale}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Shop;
