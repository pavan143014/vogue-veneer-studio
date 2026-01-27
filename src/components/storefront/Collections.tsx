import { ArrowRight } from "lucide-react";

const Collections = () => {
  const collections = [
    {
      title: "Kurthis",
      subtitle: "Traditional elegance for every occasion",
      itemCount: 156,
      gradient: "bg-gradient-to-br from-coral to-coral-dark",
      textColor: "text-primary-foreground",
      icon: "👘",
    },
    {
      title: "Dresses",
      subtitle: "Contemporary styles with ethnic touch",
      itemCount: 89,
      gradient: "bg-gradient-to-br from-teal to-teal-dark",
      textColor: "text-secondary-foreground",
      icon: "👗",
    },
    {
      title: "Festive",
      subtitle: "Celebration-ready ensembles",
      itemCount: 67,
      gradient: "bg-gradient-to-br from-gold to-gold-dark",
      textColor: "text-accent-foreground",
      icon: "✨",
    },
    {
      title: "Casual",
      subtitle: "Everyday comfort meets style",
      itemCount: 124,
      gradient: "bg-gradient-to-br from-plum to-plum-light",
      textColor: "text-primary-foreground",
      icon: "🌸",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-background" id="collections">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block font-body text-sm tracking-[0.3em] uppercase text-primary font-medium bg-primary/10 px-4 py-2 rounded-full">
            Curated For You
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-6 mb-4">
            Shop by <span className="text-gradient">Collection</span>
          </h2>
          <p className="font-body text-muted-foreground max-w-lg mx-auto text-lg">
            Explore our carefully curated collections designed to celebrate 
            the beauty of Indian craftsmanship
          </p>
        </div>

        {/* Collection Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {collections.map((collection, index) => (
            <a
              key={collection.title}
              href={`#${collection.title.toLowerCase()}`}
              className={`group relative overflow-hidden rounded-3xl ${collection.gradient} ${collection.textColor} p-6 md:p-8 min-h-[320px] flex flex-col justify-between transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl cursor-pointer animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Decorative pattern */}
              <div className="absolute top-0 right-0 w-40 h-40 opacity-20">
                <div className="w-full h-full border-[4px] border-current rounded-full transform translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="absolute bottom-0 left-0 w-32 h-32 opacity-10">
                <div className="w-full h-full border-[4px] border-current rounded-full transform -translate-x-1/2 translate-y-1/2" />
              </div>
              
              {/* Icon */}
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">{collection.icon}</div>
              
              {/* Content */}
              <div>
                <h3 className="font-display text-2xl md:text-3xl font-bold mb-2 group-hover:translate-x-1 transition-transform">
                  {collection.title}
                </h3>
                <p className="font-body text-sm opacity-80 mb-4">{collection.subtitle}</p>
                
                <div className="flex items-center justify-between">
                  <span className="font-body text-xs tracking-wide opacity-70 bg-background/20 px-3 py-1 rounded-full">
                    {collection.itemCount} Items
                  </span>
                  <span className="flex items-center gap-2 font-body text-sm font-medium group-hover:gap-3 transition-all">
                    Explore
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collections;
