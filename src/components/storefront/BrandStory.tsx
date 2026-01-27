import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const BrandStory = () => {
  return (
    <section className="py-16 md:py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Image Side */}
          <div className="relative order-2 md:order-1">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-gold-light to-cream-dark">
              {/* Placeholder for brand story image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-display text-4xl text-primary">🪷</span>
                  </div>
                  <p className="font-display text-xl text-foreground italic">Our Story</p>
                </div>
              </div>
              
              {/* Play button overlay */}
              <button className="absolute inset-0 flex items-center justify-center bg-foreground/10 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                  <Play size={24} className="ml-1" />
                </div>
              </button>
            </div>

            {/* Floating accent */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary/10 rounded-full blur-2xl" />
            
            {/* Stats card */}
            <div className="absolute -bottom-4 -left-4 md:bottom-8 md:-left-8 bg-accent text-accent-foreground p-6 rounded-xl shadow-xl">
              <p className="font-display text-3xl font-semibold">5+</p>
              <p className="font-body text-sm">Years of Excellence</p>
            </div>
          </div>

          {/* Content Side */}
          <div className="order-1 md:order-2 space-y-6">
            <span className="font-body text-sm tracking-[0.3em] uppercase text-primary font-medium">
              Our Story
            </span>
            
            <h2 className="font-display text-3xl md:text-5xl font-semibold text-foreground leading-tight">
              Crafting Elegance,
              <span className="text-primary block">One Stitch at a Time</span>
            </h2>
            
            <div className="space-y-4 font-body text-muted-foreground leading-relaxed">
              <p>
                Born from a passion for preserving India's rich textile heritage, 
                Aroma Ethnic brings you handcrafted pieces that tell stories of 
                tradition and artisanship.
              </p>
              <p>
                Each kurthi and dress in our collection is thoughtfully designed, 
                combining age-old techniques with contemporary aesthetics. We work 
                directly with skilled artisans across India, ensuring fair practices 
                and authentic craftsmanship.
              </p>
            </div>

            <div className="flex flex-wrap gap-8 py-4">
              <div>
                <p className="font-display text-3xl font-semibold text-foreground">500+</p>
                <p className="font-body text-sm text-muted-foreground">Unique Designs</p>
              </div>
              <div>
                <p className="font-display text-3xl font-semibold text-foreground">50+</p>
                <p className="font-body text-sm text-muted-foreground">Artisan Partners</p>
              </div>
              <div>
                <p className="font-display text-3xl font-semibold text-foreground">15K+</p>
                <p className="font-body text-sm text-muted-foreground">Happy Customers</p>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="font-body text-sm border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Learn More About Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
