import ShopifyProductCard from "./ShopifyProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Loader2 } from "lucide-react";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";

const FeaturedProducts = () => {
  const { data: products, isLoading, error } = useShopifyProducts(20);

  return (
    <section className="py-16 md:py-24 bg-muted/30" id="new">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <span className="font-body text-sm tracking-[0.3em] uppercase text-primary font-medium">
              Handpicked For You
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-semibold text-foreground mt-3">
              Featured Products
            </h2>
          </div>
          <Button 
            variant="ghost" 
            className="mt-4 md:mt-0 font-body text-sm text-primary hover:text-primary/80 group"
          >
            View All Products
            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-destructive font-body">Failed to load products. Please try again.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && (!products || products.length === 0) && (
          <div className="text-center py-20 bg-card rounded-2xl border border-border">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={32} className="text-muted-foreground" />
            </div>
            <h3 className="font-display text-2xl text-foreground mb-2">No products found</h3>
            <p className="font-body text-muted-foreground max-w-md mx-auto">
              Your store doesn't have any products yet. Create your first product by telling me what you'd like to sell!
            </p>
          </div>
        )}

        {/* Products Grid */}
        {products && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, index) => (
              <div
                key={product.node.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ShopifyProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* CTA Banner */}
        <div className="mt-16 bg-gradient-to-r from-accent via-primary to-accent rounded-2xl p-8 md:p-12 text-center text-primary-foreground">
          <h3 className="font-display text-2xl md:text-4xl font-semibold mb-3">
            New to Aroma Ethnic?
          </h3>
          <p className="font-body text-sm md:text-base opacity-90 mb-6 max-w-lg mx-auto">
            Sign up now and get 15% off on your first order plus exclusive access to new arrivals!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-background/20 backdrop-blur-sm border border-primary-foreground/30 placeholder:text-primary-foreground/60 text-primary-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary-foreground/50"
            />
            <Button 
              className="bg-background text-primary hover:bg-background/90 font-body text-sm px-6"
            >
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
