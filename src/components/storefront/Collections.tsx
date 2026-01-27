import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

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

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section className="py-16 md:py-24 bg-background" id="collections">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.span 
            className="inline-block font-body text-sm tracking-[0.3em] uppercase text-primary font-medium bg-primary/10 px-4 py-2 rounded-full"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Curated For You
          </motion.span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-6 mb-4">
            Shop by <span className="text-gradient">Collection</span>
          </h2>
          <p className="font-body text-muted-foreground max-w-lg mx-auto text-lg">
            Explore our carefully curated collections designed to celebrate 
            the beauty of Indian craftsmanship
          </p>
        </motion.div>

        {/* Collection Grid */}
        <motion.div 
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {collections.map((collection) => (
            <motion.a
              key={collection.title}
              href={`#${collection.title.toLowerCase()}`}
              className={`group relative overflow-hidden rounded-3xl ${collection.gradient} ${collection.textColor} p-6 md:p-8 min-h-[320px] flex flex-col justify-between cursor-pointer`}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.03, 
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Decorative pattern */}
              <motion.div 
                className="absolute top-0 right-0 w-40 h-40 opacity-20"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-full h-full border-[4px] border-current rounded-full transform translate-x-1/2 -translate-y-1/2" />
              </motion.div>
              <motion.div 
                className="absolute bottom-0 left-0 w-32 h-32 opacity-10"
                animate={{ rotate: -360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-full h-full border-[4px] border-current rounded-full transform -translate-x-1/2 translate-y-1/2" />
              </motion.div>
              
              {/* Icon */}
              <motion.div 
                className="text-6xl mb-4"
                whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {collection.icon}
              </motion.div>
              
              {/* Content */}
              <div>
                <motion.h3 
                  className="font-display text-2xl md:text-3xl font-bold mb-2"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {collection.title}
                </motion.h3>
                <p className="font-body text-sm opacity-80 mb-4">{collection.subtitle}</p>
                
                <div className="flex items-center justify-between">
                  <span className="font-body text-xs tracking-wide opacity-70 bg-background/20 px-3 py-1 rounded-full">
                    {collection.itemCount} Items
                  </span>
                  <motion.span 
                    className="flex items-center gap-2 font-body text-sm font-medium"
                    whileHover={{ gap: "12px" }}
                  >
                    Explore
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <ArrowRight size={18} />
                    </motion.div>
                  </motion.span>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Collections;
