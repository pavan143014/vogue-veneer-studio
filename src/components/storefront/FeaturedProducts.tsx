import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

// Import product images
import anarkaliKurthi from "@/assets/products/anarkali-kurthi.jpg";
import cottonDress from "@/assets/products/cotton-dress.jpg";
import silkKurthi from "@/assets/products/silk-kurthi.jpg";
import chikankariKurthi from "@/assets/products/chikankari-kurthi.jpg";
import georgetteDress from "@/assets/products/georgette-dress.jpg";
import blockPrintKurthi from "@/assets/products/block-print-kurthi.jpg";
import mirrorWorkDress from "@/assets/products/mirror-work-dress.jpg";
import rayonKurthi from "@/assets/products/rayon-kurthi.jpg";

const FeaturedProducts = () => {
  const products = [
    {
      name: "Embroidered Anarkali Kurthi",
      price: 1499,
      originalPrice: 2499,
      image: anarkaliKurthi,
      category: "Kurthis",
      isNew: true,
      isSale: true,
    },
    {
      name: "Cotton Printed A-Line Dress",
      price: 1299,
      image: cottonDress,
      category: "Dresses",
      isNew: true,
    },
    {
      name: "Silk Blend Festive Kurthi",
      price: 2199,
      originalPrice: 2999,
      image: silkKurthi,
      category: "Festive",
      isSale: true,
    },
    {
      name: "Casual Chikankari Kurthi",
      price: 999,
      image: chikankariKurthi,
      category: "Kurthis",
    },
    {
      name: "Georgette Floor Length Dress",
      price: 2499,
      image: georgetteDress,
      category: "Dresses",
      isNew: true,
    },
    {
      name: "Block Print Cotton Kurthi",
      price: 899,
      originalPrice: 1299,
      image: blockPrintKurthi,
      category: "Casual",
      isSale: true,
    },
    {
      name: "Mirror Work Party Dress",
      price: 3299,
      image: mirrorWorkDress,
      category: "Festive",
      isNew: true,
    },
    {
      name: "Rayon Daily Wear Kurthi",
      price: 699,
      image: rayonKurthi,
      category: "Casual",
    },
  ];

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

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <div
              key={index}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>

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
