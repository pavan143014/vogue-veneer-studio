import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Sparkles } from "lucide-react";
import heroModel from "@/assets/hero-model.jpg";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  return (
    <section ref={heroRef} className="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden gradient-hero">
      {/* Animated background elements with parallax */}
      <motion.div className="absolute inset-0 overflow-hidden" style={{ y: backgroundY }}>
        <motion.div 
          className="absolute top-20 right-10 w-72 h-72 bg-coral/20 rounded-full blur-3xl"
          animate={{ 
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.35, 0.2]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 left-10 w-96 h-96 bg-gold/20 rounded-full blur-3xl"
          animate={{ 
            y: [0, 40, 0],
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div 
          className="absolute top-1/2 right-1/4 w-48 h-48 bg-teal/15 rounded-full blur-3xl"
          animate={{ 
            x: [0, 20, 0],
            y: [0, -20, 0],
            opacity: [0.15, 0.3, 0.15]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </motion.div>
      
      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--foreground)) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Top decorative border */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-coral via-gold to-teal"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />

      <motion.div className="container mx-auto px-4 relative z-10" style={{ y: contentY, opacity }}>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8">
            <motion.div 
              className="inline-flex items-center gap-2 bg-secondary/10 backdrop-blur-sm border border-secondary/20 px-4 py-2 rounded-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 text-secondary" />
              </motion.div>
              <span className="font-body text-sm tracking-wider uppercase text-secondary font-medium">
                New Collection 2026
              </span>
            </motion.div>
            
            <motion.h1 
              className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground leading-[1.1]"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Where Tradition
              <motion.span 
                className="block text-gradient"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Meets Style
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="font-body text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Discover our exquisite collection of handcrafted ethnic wear — 
              where every stitch tells a story of artistry and elegance.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-body font-semibold text-base px-8 shadow-xl glow-coral relative overflow-hidden group"
                >
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  />
                  <span className="relative z-10 flex items-center">
                    Shop Collection
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-body font-semibold text-base px-8"
                >
                  View Lookbook
                </Button>
              </motion.div>
            </motion.div>

            {/* Social proof */}
            <motion.div 
              className="flex items-center gap-8 justify-center lg:justify-start pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div 
                      key={i} 
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-coral to-gold border-2 border-background"
                      initial={{ scale: 0, x: -20 }}
                      animate={{ scale: 1, x: 0 }}
                      transition={{ delay: 0.9 + i * 0.1, type: "spring", stiffness: 300 }}
                    />
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 1.3 + i * 0.05, type: "spring" }}
                      >
                        <Star className="w-4 h-4 fill-gold text-gold" />
                      </motion.div>
                    ))}
                  </div>
                  <p className="font-body text-xs text-muted-foreground">15K+ Happy Customers</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Hero Image with Parallax */}
          <motion.div 
            className="relative hidden lg:block"
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            style={{ y: imageY }}
          >
            <div className="relative">
              {/* Main image container */}
              <motion.div 
                className="relative aspect-[3/4] max-w-lg mx-auto rounded-t-[200px] overflow-hidden shadow-2xl glow-coral"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{ scale }}
              >
                <img 
                  src={heroModel} 
                  alt="Featured ethnic collection" 
                  className="w-full h-full object-cover object-top"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent" />
              </motion.div>
              
              {/* Floating price badge */}
              <motion.div 
                className="absolute -bottom-4 -left-8 bg-secondary text-secondary-foreground px-8 py-4 rounded-2xl shadow-2xl glow-teal"
                initial={{ opacity: 0, x: -30, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                whileHover={{ scale: 1.05, rotate: -2 }}
              >
                <p className="font-body text-xs tracking-wider uppercase opacity-80">Starting from</p>
                <p className="font-display text-3xl font-bold">₹999</p>
              </motion.div>
              
              {/* Floating discount badge */}
              <motion.div 
                className="absolute top-12 -right-6 bg-accent text-accent-foreground px-6 py-3 rounded-xl shadow-xl"
                initial={{ opacity: 0, x: 30, y: -20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                whileHover={{ scale: 1.1, rotate: 3 }}
              >
                <motion.p 
                  className="font-body text-sm font-bold"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  UPTO 40% OFF
                </motion.p>
              </motion.div>
              
              {/* Decorative rings */}
              <motion.div 
                className="absolute -top-8 -right-8 w-32 h-32 border-4 border-coral/30 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute -bottom-12 right-20 w-24 h-24 border-4 border-gold/30 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom trust bar */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 bg-secondary/5 backdrop-blur-sm border-t border-border py-4"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-8 md:gap-16 text-center">
            {[
              { value: "500+", label: "Designs" },
              { value: "15K+", label: "Happy Customers" },
              { value: "4.9★", label: "Rating" },
              { value: "50+", label: "Artisan Partners", hideOnMobile: true },
            ].map((stat, index) => (
              <motion.div 
                key={stat.label}
                className={stat.hideOnMobile ? "hidden md:block" : ""}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
              >
                {index > 0 && <div className="hidden" />}
                <p className="font-display text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="font-body text-xs text-muted-foreground tracking-wide">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
