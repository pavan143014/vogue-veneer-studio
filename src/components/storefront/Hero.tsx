import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Sparkles } from "lucide-react";
import heroModel from "@/assets/hero-model.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden gradient-hero">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-coral/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gold/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-teal/15 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>
      
      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--foreground)) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Top decorative border */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-coral via-gold to-teal" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 bg-secondary/10 backdrop-blur-sm border border-secondary/20 px-4 py-2 rounded-full animate-fade-in">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="font-body text-sm tracking-wider uppercase text-secondary font-medium">
                New Collection 2026
              </span>
            </div>
            
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground leading-[1.1] animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Where Tradition
              <span className="block text-gradient">Meets Style</span>
            </h1>
            
            <p className="font-body text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Discover our exquisite collection of handcrafted ethnic wear — 
              where every stitch tells a story of artistry and elegance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-body font-semibold text-base px-8 shadow-xl glow-coral animate-pulse-glow"
              >
                Shop Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-body font-semibold text-base px-8"
              >
                View Lookbook
              </Button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-8 justify-center lg:justify-start pt-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-coral to-gold border-2 border-background" />
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="font-body text-xs text-muted-foreground">15K+ Happy Customers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative hidden lg:block animate-scale-in">
            <div className="relative">
              {/* Main image container */}
              <div className="relative aspect-[3/4] max-w-lg mx-auto rounded-t-[200px] overflow-hidden shadow-2xl glow-coral">
                <img 
                  src={heroModel} 
                  alt="Featured ethnic collection" 
                  className="w-full h-full object-cover object-top"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent" />
              </div>
              
              {/* Floating price badge */}
              <div className="absolute -bottom-4 -left-8 bg-secondary text-secondary-foreground px-8 py-4 rounded-2xl shadow-2xl glow-teal">
                <p className="font-body text-xs tracking-wider uppercase opacity-80">Starting from</p>
                <p className="font-display text-3xl font-bold">₹999</p>
              </div>
              
              {/* Floating discount badge */}
              <div className="absolute top-12 -right-6 bg-accent text-accent-foreground px-6 py-3 rounded-xl shadow-xl animate-float">
                <p className="font-body text-sm font-bold">UPTO 40% OFF</p>
              </div>
              
              {/* Decorative rings */}
              <div className="absolute -top-8 -right-8 w-32 h-32 border-4 border-coral/30 rounded-full" />
              <div className="absolute -bottom-12 right-20 w-24 h-24 border-4 border-gold/30 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom trust bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-secondary/5 backdrop-blur-sm border-t border-border py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-8 md:gap-16 text-center">
            <div>
              <p className="font-display text-2xl md:text-3xl font-bold text-foreground">500+</p>
              <p className="font-body text-xs text-muted-foreground tracking-wide">Designs</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div>
              <p className="font-display text-2xl md:text-3xl font-bold text-foreground">15K+</p>
              <p className="font-body text-xs text-muted-foreground tracking-wide">Happy Customers</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div>
              <p className="font-display text-2xl md:text-3xl font-bold text-foreground">4.9★</p>
              <p className="font-body text-xs text-muted-foreground tracking-wide">Rating</p>
            </div>
            <div className="hidden md:block w-px h-8 bg-border" />
            <div className="hidden md:block">
              <p className="font-display text-2xl md:text-3xl font-bold text-foreground">50+</p>
              <p className="font-body text-xs text-muted-foreground tracking-wide">Artisan Partners</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
