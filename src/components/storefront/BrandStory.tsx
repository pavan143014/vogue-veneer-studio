import { Button } from "@/components/ui/button";
import { Play, Award, Heart, Leaf } from "lucide-react";
import brandStoryImg from "@/assets/brand-story.jpg";

const BrandStory = () => {
  const values = [
    { icon: Award, label: "Premium Quality", color: "text-coral bg-coral/10" },
    { icon: Heart, label: "Made with Love", color: "text-teal bg-teal/10" },
    { icon: Leaf, label: "Sustainable", color: "text-gold-dark bg-gold/10" },
  ];

  return (
    <section className="py-16 md:py-24 bg-background overflow-hidden relative">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--foreground)) 1px, transparent 0)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={brandStoryImg} 
                alt="Indian artisans hand embroidering traditional fabric" 
                className="w-full h-full object-cover"
              />
              
              {/* Play button overlay */}
              <button className="absolute inset-0 flex items-center justify-center bg-foreground/20 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-2xl glow-coral">
                  <Play size={28} className="ml-1" />
                </div>
              </button>
            </div>

            {/* Floating accents */}
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-gradient-to-br from-coral/20 to-gold/20 rounded-full blur-3xl" />
            
            {/* Stats card */}
            <div className="absolute -bottom-6 -left-6 lg:bottom-12 lg:-left-12 bg-secondary text-secondary-foreground p-6 md:p-8 rounded-2xl shadow-2xl glow-teal">
              <p className="font-display text-4xl md:text-5xl font-bold">5+</p>
              <p className="font-body text-sm">Years of Excellence</p>
            </div>

            {/* Decorative rings */}
            <div className="absolute -top-6 -right-6 w-24 h-24 border-4 border-coral/30 rounded-full" />
            <div className="absolute top-1/4 -right-4 w-16 h-16 border-4 border-gold/30 rounded-full" />
          </div>

          {/* Content Side */}
          <div className="order-1 lg:order-2 space-y-8">
            <span className="inline-block font-body text-sm tracking-[0.3em] uppercase text-primary font-medium bg-primary/10 px-4 py-2 rounded-full">
              Our Story
            </span>
            
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Crafting Elegance,
              <span className="text-gradient block">One Stitch at a Time</span>
            </h2>
            
            <div className="space-y-5 font-body text-muted-foreground leading-relaxed text-lg">
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

            {/* Values */}
            <div className="flex flex-wrap gap-3">
              {values.map((value) => (
                <div 
                  key={value.label}
                  className={`flex items-center gap-2 ${value.color} px-4 py-2 rounded-full`}
                >
                  <value.icon className="w-5 h-5" />
                  <span className="font-body text-sm font-medium">{value.label}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 py-6">
              {[
                { value: "500+", label: "Unique Designs" },
                { value: "50+", label: "Artisan Partners" },
                { value: "15K+", label: "Happy Customers" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-3xl md:text-4xl font-bold text-foreground">{stat.value}</p>
                  <p className="font-body text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            <Button 
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-body font-semibold px-8 shadow-lg glow-teal"
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
