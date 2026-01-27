import { Truck, Shield, RefreshCw, Headphones, Award, Leaf } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders above ₹999",
      color: "bg-coral/10 text-coral group-hover:bg-coral group-hover:text-primary-foreground",
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "100% secure checkout",
      color: "bg-teal/10 text-teal group-hover:bg-teal group-hover:text-secondary-foreground",
    },
    {
      icon: RefreshCw,
      title: "Easy Returns",
      description: "7-day return policy",
      color: "bg-gold/10 text-gold-dark group-hover:bg-gold group-hover:text-accent-foreground",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Dedicated customer care",
      color: "bg-plum/10 text-plum group-hover:bg-plum group-hover:text-primary-foreground",
    },
  ];

  return (
    <section className="py-10 md:py-14 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="group flex flex-col items-center text-center p-6 rounded-2xl bg-background hover:shadow-xl transition-all duration-300 cursor-pointer border border-transparent hover:border-border"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-4 transition-all duration-300`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-1.5">
                {feature.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
