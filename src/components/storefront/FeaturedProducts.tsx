import ShopifyProductCard from "./ShopifyProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Loader2, Sparkles } from "lucide-react";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { motion } from "framer-motion";

const FeaturedProducts = () => {
  const { data: products, isLoading, error } = useShopifyProducts(20);

  return (
    <section className="py-16 md:py-24 bg-muted/30" id="new">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <motion.div 
              className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 text-primary" />
              </motion.div>
              <span className="font-body text-sm tracking-wider uppercase text-primary font-medium">
                Handpicked For You
              </span>
            </motion.div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
              Featured <span className="text-gradient">Products</span>
            </h2>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              variant="ghost" 
              className="mt-6 md:mt-0 font-body text-sm text-primary hover:text-primary-foreground hover:bg-primary group px-6"
            >
              View All Products
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative">
              <motion.div 
                className="w-16 h-16 rounded-full bg-primary/20 absolute inset-0"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <Loader2 className="w-16 h-16 animate-spin text-primary relative z-10" />
            </div>
            <p className="font-body text-muted-foreground mt-4">Loading beautiful products...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div 
            className="text-center py-20 bg-destructive/10 rounded-3xl border border-destructive/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="text-destructive font-body text-lg">Failed to load products. Please try again.</p>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !error && (!products || products.length === 0) && (
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
            <h3 className="font-display text-3xl font-bold text-foreground mb-3">No products found</h3>
            <p className="font-body text-muted-foreground max-w-md mx-auto text-lg">
              Your store doesn't have any products yet. Create your first product by telling me what you'd like to sell!
            </p>
          </motion.div>
        )}

        {/* Products Grid */}
        {products && products.length > 0 && (
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.08
                }
              }
            }}
          >
            {products.map((product) => (
              <motion.div
                key={product.node.id}
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.95 },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: { duration: 0.5, ease: "easeOut" }
                  }
                }}
              >
                <ShopifyProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Newsletter CTA Banner */}
        <motion.div 
          className="mt-20 relative overflow-hidden rounded-3xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-coral via-gold to-teal" />
          <div className="absolute inset-0 opacity-30">
            <motion.div 
              className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl"
              animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div 
              className="absolute bottom-0 left-0 w-80 h-80 bg-white/20 rounded-full blur-3xl"
              animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
              transition={{ duration: 10, repeat: Infinity }}
            />
          </div>
          
          <div className="relative z-10 p-8 md:p-16 text-center text-primary-foreground">
            <motion.h3 
              className="font-display text-3xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              New to Aroma Ethnic?
            </motion.h3>
            <motion.p 
              className="font-body text-base md:text-lg opacity-90 mb-8 max-w-lg mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Sign up now and get 15% off on your first order plus exclusive access to new arrivals!
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-4 rounded-xl bg-background/20 backdrop-blur-sm border border-primary-foreground/30 placeholder:text-primary-foreground/60 text-primary-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary-foreground/50 transition-all duration-300"
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  className="bg-background text-foreground hover:bg-background/90 font-body font-semibold px-8 py-4 text-base shadow-xl"
                >
                  Subscribe
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
