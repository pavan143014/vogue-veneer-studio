import CollectionCard from "./CollectionCard";

const Collections = () => {
  const collections = [
    {
      title: "Kurthis",
      subtitle: "Traditional elegance for every occasion",
      itemCount: 156,
      gradient: "bg-gradient-to-br from-primary/90 to-accent text-primary-foreground",
      icon: "👘",
    },
    {
      title: "Dresses",
      subtitle: "Contemporary styles with ethnic touch",
      itemCount: 89,
      gradient: "bg-gradient-to-br from-gold to-secondary text-secondary-foreground",
      icon: "👗",
    },
    {
      title: "Festive",
      subtitle: "Celebration-ready ensembles",
      itemCount: 67,
      gradient: "bg-gradient-to-br from-accent to-burgundy text-accent-foreground",
      icon: "✨",
    },
    {
      title: "Casual",
      subtitle: "Everyday comfort meets style",
      itemCount: 124,
      gradient: "bg-gradient-to-br from-cream-dark to-gold-light text-foreground",
      icon: "🌸",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-background" id="collections">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="font-body text-sm tracking-[0.3em] uppercase text-primary font-medium">
            Curated For You
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-foreground mt-3 mb-4">
            Shop by Collection
          </h2>
          <p className="font-body text-muted-foreground max-w-lg mx-auto">
            Explore our carefully curated collections designed to celebrate 
            the beauty of Indian craftsmanship
          </p>
        </div>

        {/* Collection Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {collections.map((collection, index) => (
            <div
              key={collection.title}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CollectionCard {...collection} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collections;
