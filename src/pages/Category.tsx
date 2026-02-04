import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import ProductCard from "@/components/storefront/ProductCard";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import { useCategories, CategoryWithChildren } from "@/hooks/useCategories";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ChevronRight, Grid3X3, LayoutGrid, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const [gridView, setGridView] = useState<"grid" | "large">("grid");
  
  const { products: adminProducts, loading: productsLoading } = useAdminProducts();
  const { categories, categoryTree, loading: categoriesLoading } = useCategories();

  // Find current category by slug
  const currentCategory = useMemo(() => {
    return categories.find(c => c.slug === slug);
  }, [categories, slug]);

  // Find parent category if this is a subcategory
  const parentCategory = useMemo(() => {
    if (!currentCategory?.parent_id) return null;
    return categories.find(c => c.id === currentCategory.parent_id);
  }, [currentCategory, categories]);

  // Get all descendant category slugs (for filtering products in subcategories too)
  const getAllDescendantSlugs = (categoryId: string): string[] => {
    const slugs: string[] = [];
    const cat = categories.find(c => c.id === categoryId);
    if (cat) slugs.push(cat.slug);
    
    const children = categories.filter(c => c.parent_id === categoryId);
    children.forEach(child => {
      slugs.push(...getAllDescendantSlugs(child.id));
    });
    return slugs;
  };

  // Get subcategories of current category
  const subcategories = useMemo(() => {
    if (!currentCategory) return [];
    return categories.filter(c => c.parent_id === currentCategory.id && c.is_active);
  }, [currentCategory, categories]);

  // Filter products by current category and all its subcategories
  const filteredProducts = useMemo(() => {
    if (!currentCategory) return [];
    const validSlugs = getAllDescendantSlugs(currentCategory.id);
    return adminProducts.filter(product => 
      product.category && validSlugs.includes(product.category)
    );
  }, [currentCategory, adminProducts, categories]);

  const loading = productsLoading || categoriesLoading;

  if (!loading && !currentCategory) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto"
            >
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-muted-foreground" />
              </div>
              <h1 className="font-display text-3xl font-bold mb-4">Category Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The category you're looking for doesn't exist or has been removed.
              </p>
              <Button asChild>
                <Link to="/shop">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Shop
                </Link>
              </Button>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-16">
        {/* Hero Section */}
        <motion.section 
          className="relative py-12 md:py-16 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Background Image or Gradient */}
          {currentCategory?.image_url ? (
            <div className="absolute inset-0">
              <img 
                src={currentCategory.image_url} 
                alt={currentCategory.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-coral/10 via-background to-gold/10">
              <motion.div 
                className="absolute top-10 right-10 w-64 h-64 bg-coral/10 rounded-full blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 6, repeat: Infinity }}
              />
            </div>
          )}
          
          <div className="container mx-auto px-4 relative z-10">
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/shop" className="text-muted-foreground hover:text-foreground">Shop</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {parentCategory && (
                    <>
                      <BreadcrumbSeparator>
                        <ChevronRight className="h-4 w-4" />
                      </BreadcrumbSeparator>
                      <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                          <Link to={`/category/${parentCategory.slug}`} className="text-muted-foreground hover:text-foreground">
                            {parentCategory.name}
                          </Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    </>
                  )}
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-foreground font-medium">
                      {loading ? <Skeleton className="h-4 w-20" /> : currentCategory?.name}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </motion.div>

            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {loading ? (
                <Skeleton className="h-12 w-64 mx-auto mb-4" />
              ) : (
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                  {currentCategory?.name}
                </h1>
              )}
              {loading ? (
                <Skeleton className="h-6 w-48 mx-auto" />
              ) : currentCategory?.description ? (
                <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto">
                  {currentCategory.description}
                </p>
              ) : (
                <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto">
                  Explore our collection of {currentCategory?.name?.toLowerCase()}
                </p>
              )}
            </motion.div>
          </div>
        </motion.section>

        {/* Subcategories */}
        {subcategories.length > 0 && (
          <section className="py-8 border-b border-border">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4 justify-center"
              >
                {subcategories.map((sub) => (
                  <Link
                    key={sub.id}
                    to={`/category/${sub.slug}`}
                    className="group flex items-center gap-3 px-4 py-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {sub.image_url && (
                      <img 
                        src={sub.image_url} 
                        alt={sub.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <span className="font-body text-sm">{sub.name}</span>
                  </Link>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* Products Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Toolbar */}
            <motion.div 
              className="flex items-center justify-between mb-6 bg-card rounded-2xl p-4 border border-border"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="font-body text-muted-foreground">
                {loading ? (
                  <Skeleton className="h-5 w-32" />
                ) : (
                  <>
                    <span className="text-foreground font-medium">{filteredProducts.length}</span> products
                  </>
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

            {/* Loading State */}
            {loading && (
              <div className={`grid gap-4 md:gap-6 ${
                gridView === "grid" 
                  ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
                  : "grid-cols-1 md:grid-cols-2"
              }`}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[3/4] rounded-2xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredProducts.length === 0 && (
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
                  No products yet
                </h3>
                <p className="font-body text-muted-foreground max-w-md mx-auto text-lg mb-6">
                  We're working on adding products to this category. Check back soon!
                </p>
                <Button asChild>
                  <Link to="/shop">Browse All Products</Link>
                </Button>
              </motion.div>
            )}

            {/* Products Grid */}
            {!loading && filteredProducts.length > 0 && (
              <motion.div 
                className={`grid gap-4 md:gap-6 ${
                  gridView === "grid" 
                    ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
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
                      name={product.title}
                      price={product.price}
                      originalPrice={product.compare_at_price || undefined}
                      image={product.images?.[0] || "/placeholder.svg"}
                      category={product.category || "Uncategorized"}
                      isNew={new Date(product.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000}
                      isSale={!!product.compare_at_price && product.compare_at_price > product.price}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Category;
