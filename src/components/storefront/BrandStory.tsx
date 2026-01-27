import { Button } from "@/components/ui/button";
import { Play, Award, Heart, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import brandStoryImg from "@/assets/brand-story.jpg";
import { ScrollReveal, Parallax } from "@/components/ScrollReveal";

const BrandStory = () => {
  const values = [
    { icon: Award, label: "Premium Quality", color: "text-coral bg-coral/10" },
    { icon: Heart, label: "Made with Love", color: "text-teal bg-teal/10" },
    { icon: Leaf, label: "Sustainable", color: "text-gold-dark bg-gold/10" },
  ];

  const stats = [
    { value: "500+", label: "Unique Designs" },
    { value: "50+", label: "Artisan Partners" },
    { value: "15K+", label: "Happy Customers" },
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
          <ScrollReveal variant="fadeLeft" className="relative order-2 lg:order-1">
            <Parallax speed={0.2} direction="down">
              <motion.div 
                className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl"
                initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <motion.img 
                  src={brandStoryImg} 
                  alt="Indian artisans hand embroidering traditional fabric" 
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                />
                
                {/* Play button overlay */}
                <motion.button 
                  className="absolute inset-0 flex items-center justify-center bg-foreground/20 opacity-0 hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                >
                  <motion.div 
                    className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-2xl glow-coral"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Play size={28} className="ml-1" />
                  </motion.div>
                </motion.button>
              </motion.div>
            </Parallax>

            {/* Floating accents */}
            <motion.div 
              className="absolute -bottom-8 -right-8 w-64 h-64 bg-gradient-to-br from-coral/20 to-gold/20 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Stats card */}
            <motion.div 
              className="absolute -bottom-6 -left-6 lg:bottom-12 lg:-left-12 bg-secondary text-secondary-foreground p-6 md:p-8 rounded-2xl shadow-2xl glow-teal"
              initial={{ opacity: 0, x: -50, y: 50 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4, type: "spring" }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <motion.p 
                className="font-display text-4xl md:text-5xl font-bold"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              >
                5+
              </motion.p>
              <p className="font-body text-sm">Years of Excellence</p>
            </motion.div>

            {/* Decorative rings */}
            <motion.div 
              className="absolute -top-6 -right-6 w-24 h-24 border-4 border-coral/30 rounded-full"
              initial={{ opacity: 0, scale: 0, rotate: -90 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <motion.div 
              className="absolute top-1/4 -right-4 w-16 h-16 border-4 border-gold/30 rounded-full"
              initial={{ opacity: 0, scale: 0, rotate: 90 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
          </ScrollReveal>

          {/* Content Side */}
          <div className="order-1 lg:order-2 space-y-8">
            <ScrollReveal variant="fadeRight" delay={0.1}>
              <motion.span 
                className="inline-block font-body text-sm tracking-[0.3em] uppercase text-primary font-medium bg-primary/10 px-4 py-2 rounded-full"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Our Story
              </motion.span>
            </ScrollReveal>
            
            <ScrollReveal variant="fadeRight" delay={0.2}>
              <motion.h2 
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Crafting Elegance,
                <motion.span 
                  className="text-gradient block"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  One Stitch at a Time
                </motion.span>
              </motion.h2>
            </ScrollReveal>
            
            <ScrollReveal variant="fadeRight" delay={0.3}>
              <div className="space-y-5 font-body text-muted-foreground leading-relaxed text-lg">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Born from a passion for preserving India's rich textile heritage, 
                  Aroma Ethnic brings you handcrafted pieces that tell stories of 
                  tradition and artisanship.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  Each kurthi and dress in our collection is thoughtfully designed, 
                  combining age-old techniques with contemporary aesthetics. We work 
                  directly with skilled artisans across India, ensuring fair practices 
                  and authentic craftsmanship.
                </motion.p>
              </div>
            </ScrollReveal>

            {/* Values */}
            <ScrollReveal variant="fadeRight" delay={0.4}>
              <div className="flex flex-wrap gap-3">
                {values.map((value, index) => (
                  <motion.div 
                    key={value.label}
                    className={`flex items-center gap-2 ${value.color} px-4 py-2 rounded-full cursor-default`}
                    initial={{ opacity: 0, scale: 0.8, x: 20 }}
                    whileInView={{ opacity: 1, scale: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.08, y: -2 }}
                  >
                    <value.icon className="w-5 h-5" />
                    <span className="font-body text-sm font-medium">{value.label}</span>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>

            {/* Stats */}
            <ScrollReveal variant="fadeRight" delay={0.5}>
              <div className="flex flex-wrap gap-8 py-6">
                {stats.map((stat, index) => (
                  <motion.div 
                    key={stat.label}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <motion.p 
                      className="font-display text-3xl md:text-4xl font-bold text-foreground"
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 200 }}
                    >
                      {stat.value}
                    </motion.p>
                    <p className="font-body text-sm text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fadeRight" delay={0.6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Button 
                  asChild
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-body font-semibold px-8 shadow-lg glow-teal"
                >
                  <Link to="/about">
                    <motion.span
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      Learn More About Us
                    </motion.span>
                  </Link>
                </Button>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
