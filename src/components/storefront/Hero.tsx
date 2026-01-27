import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroModel from "@/assets/hero-model.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-cream via-cream-dark to-gold-light opacity-60" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-rose-light/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gold/20 rounded-full blur-3xl" />
      
      {/* Decorative border pattern */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-gold to-accent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div className="text-center md:text-left space-y-6 animate-fade-in">
            <span className="inline-block font-body text-sm tracking-[0.3em] uppercase text-primary font-medium">
              New Collection 2024
            </span>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-semibold text-foreground leading-tight">
              Embrace Your
              <span className="block text-primary italic">Ethnic Elegance</span>
            </h1>
            
            <p className="font-body text-base md:text-lg text-muted-foreground max-w-md mx-auto md:mx-0 leading-relaxed">
              Discover our exquisite collection of handcrafted kurthis and dresses, 
              where traditional artistry meets contemporary style.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
              <Button 
                size="lg" 
                className="font-body text-sm tracking-wide bg-primary hover:bg-primary/90 group"
              >
                Shop New Arrivals
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="font-body text-sm tracking-wide border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              >
                Explore Collections
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 justify-center md:justify-start pt-6 text-muted-foreground">
              <div className="text-center">
                <p className="font-display text-2xl font-semibold text-foreground">500+</p>
                <p className="font-body text-xs tracking-wide">Designs</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="font-display text-2xl font-semibold text-foreground">10K+</p>
                <p className="font-body text-xs tracking-wide">Happy Customers</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="font-display text-2xl font-semibold text-foreground">4.9★</p>
                <p className="font-body text-xs tracking-wide">Rating</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative hidden md:block animate-scale-in">
            <div className="relative aspect-[3/4] max-w-md mx-auto">
              {/* Main image frame */}
              <div className="absolute inset-0 rounded-t-full border-4 border-gold/30 overflow-hidden shadow-2xl">
                <img 
                  src={heroModel} 
                  alt="Featured ethnic dress" 
                  className="w-full h-full object-cover object-top"
                />
              </div>
              
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-accent text-accent-foreground px-6 py-3 rounded-lg shadow-lg">
                <p className="font-body text-xs tracking-wide">Starting from</p>
                <p className="font-display text-2xl font-semibold">₹999</p>
              </div>
              
              {/* Decorative ring */}
              <div className="absolute -top-6 -right-6 w-24 h-24 border-4 border-primary/30 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
