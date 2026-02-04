import { ArrowRight, Sparkles, Gift, Zap, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useStorefrontContent } from "@/hooks/useStorefrontContent";

interface PromoBannerProps {
  variant?: "primary" | "secondary" | "accent" | "flash";
}

const PromoBanner = ({ variant = "primary" }: PromoBannerProps) => {
  const { content } = useStorefrontContent();

  if (variant === "flash") {
    const flashContent = content.promo_flash || { text: "⚡ FLASH SALE: Extra 30% OFF Everything! Use Code: FLASH30 ⚡", is_active: true };
    
    if (!flashContent.is_active) return null;
    
    return (
      <motion.section 
        className="relative overflow-hidden py-4 bg-gradient-to-r from-coral via-gold to-coral"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        />
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex items-center justify-center gap-4 text-primary-foreground"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Zap className="w-5 h-5" />
            </motion.div>
            <span className="font-body text-sm md:text-base font-semibold tracking-wide">
              {flashContent.text}
            </span>
            <motion.div
              animate={{ rotate: [0, -15, 15, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Zap className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    );
  }

  if (variant === "secondary") {
    const secondaryContent = content.promo_secondary || {
      badge: "Limited Offer",
      title: "Buy 2, Get 1 Free!",
      subtitle: "On all Kurthis & Dresses • Valid till stocks last",
      cta: "Shop Now"
    };

    return (
      <motion.section 
        className="relative py-12 md:py-16 overflow-hidden bg-secondary"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 opacity-10">
          <motion.div 
            className="absolute top-0 left-1/4 w-96 h-96 bg-teal-light rounded-full blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold rounded-full blur-3xl"
            animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <motion.div 
              className="text-center md:text-left text-secondary-foreground"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Gift className="w-5 h-5" />
                </motion.div>
                <span className="font-body text-sm tracking-widest uppercase opacity-90">{secondaryContent.badge}</span>
              </div>
              <h3 className="font-display text-2xl md:text-4xl font-bold mb-2">
                {secondaryContent.title}
              </h3>
              <p className="font-body text-sm md:text-base opacity-90">
                {secondaryContent.subtitle}
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-body font-semibold px-8 shadow-lg glow-gold"
              >
                {secondaryContent.cta}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>
    );
  }

  if (variant === "accent") {
    return (
      <motion.section 
        className="py-8 md:py-12 bg-gradient-to-r from-plum via-coral to-gold"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-primary-foreground text-center">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Clock className="w-6 h-6" />
              </motion.div>
              <div>
                <p className="font-display text-xl md:text-2xl font-bold">End of Season Sale</p>
                <p className="font-body text-sm opacity-90">Up to 50% Off • Ends in 48 Hours</p>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                variant="secondary"
                size="lg"
                className="bg-background text-foreground hover:bg-background/90 font-body font-semibold"
              >
                Grab the Deals
                <Sparkles className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>
    );
  }

  // Primary variant
  const primaryContent = content.promo_primary || {
    badge: "New Collection Arrived",
    title_line1: "Festive Season",
    title_line2: "Special",
    description: "Celebrate with our exclusive handcrafted pieces. Each design tells a story of tradition and elegance.",
    cta_primary: "Explore Collection",
    cta_secondary: "View Lookbook"
  };

  return (
    <motion.section 
      className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-coral via-coral-dark to-plum"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* Decorative elements */}
      <motion.div 
        className="absolute top-0 right-0 w-80 h-80 bg-gold/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-96 h-96 bg-teal/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary-foreground/10 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-primary-foreground/10 rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="max-w-3xl mx-auto text-center text-primary-foreground"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
            <span className="font-body text-xs tracking-widest uppercase">{primaryContent.badge}</span>
          </motion.div>
          
          <motion.h2 
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            {primaryContent.title_line1}
            <motion.span 
              className="block text-gold"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              {primaryContent.title_line2}
            </motion.span>
          </motion.h2>
          
          <motion.p 
            className="font-body text-lg md:text-xl opacity-90 mb-8 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            {primaryContent.description}
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button 
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-body font-semibold px-8 text-base shadow-xl glow-gold relative overflow-hidden group"
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />
                <span className="relative z-10 flex items-center">
                  {primaryContent.cta_primary}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button 
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-body font-semibold px-8 text-base"
              >
                {primaryContent.cta_secondary}
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default PromoBanner;
