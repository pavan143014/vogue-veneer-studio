import { ArrowRight, Sparkles, Gift, Zap, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PromoBannerProps {
  variant?: "primary" | "secondary" | "accent" | "flash";
}

const PromoBanner = ({ variant = "primary" }: PromoBannerProps) => {
  if (variant === "flash") {
    return (
      <section className="relative overflow-hidden py-4 bg-gradient-to-r from-coral via-gold to-coral">
        <div className="absolute inset-0 shimmer opacity-30" />
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4 text-primary-foreground">
            <Zap className="w-5 h-5 animate-pulse" />
            <span className="font-body text-sm md:text-base font-semibold tracking-wide">
              ⚡ FLASH SALE: Extra 30% OFF Everything! Use Code: FLASH30 ⚡
            </span>
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  if (variant === "secondary") {
    return (
      <section className="relative py-12 md:py-16 overflow-hidden bg-secondary">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-light rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left text-secondary-foreground">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <Gift className="w-5 h-5" />
                <span className="font-body text-sm tracking-widest uppercase opacity-90">Limited Offer</span>
              </div>
              <h3 className="font-display text-2xl md:text-4xl font-bold mb-2">
                Buy 2, Get 1 Free!
              </h3>
              <p className="font-body text-sm md:text-base opacity-90">
                On all Kurthis & Dresses • Valid till stocks last
              </p>
            </div>
            <Button 
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-body font-semibold px-8 shadow-lg glow-gold"
            >
              Shop Now
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "accent") {
    return (
      <section className="py-8 md:py-12 bg-gradient-to-r from-plum via-coral to-gold">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-primary-foreground text-center">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6" />
              <div>
                <p className="font-display text-xl md:text-2xl font-bold">End of Season Sale</p>
                <p className="font-body text-sm opacity-90">Up to 50% Off • Ends in 48 Hours</p>
              </div>
            </div>
            <Button 
              variant="secondary"
              size="lg"
              className="bg-background text-foreground hover:bg-background/90 font-body font-semibold"
            >
              Grab the Deals
              <Sparkles className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Primary variant
  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-coral via-coral-dark to-plum">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gold/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary-foreground/10 rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-primary-foreground/10 rounded-full" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center text-primary-foreground">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="font-body text-xs tracking-widest uppercase">New Collection Arrived</span>
          </div>
          
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Festive Season
            <span className="block text-gold">Special</span>
          </h2>
          
          <p className="font-body text-lg md:text-xl opacity-90 mb-8 max-w-xl mx-auto">
            Celebrate with our exclusive handcrafted pieces. Each design tells a story of tradition and elegance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-body font-semibold px-8 text-base shadow-xl glow-gold"
            >
              Explore Collection
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-body font-semibold px-8 text-base"
            >
              View Lookbook
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
