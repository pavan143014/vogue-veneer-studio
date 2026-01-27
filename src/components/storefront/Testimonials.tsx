import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import customer1 from "@/assets/testimonials/customer1.jpg";
import customer2 from "@/assets/testimonials/customer2.jpg";
import customer3 from "@/assets/testimonials/customer3.jpg";
import customer4 from "@/assets/testimonials/customer4.jpg";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ScrollReveal";

interface TestimonialCardProps {
  name: string;
  location: string;
  image: string;
  rating: number;
  review: string;
  product: string;
  index: number;
}

const TestimonialCard = ({ name, location, image, rating, review, product, index }: TestimonialCardProps) => {
  return (
    <motion.div 
      className="bg-card rounded-3xl p-6 md:p-8 border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group h-full"
      initial={{ opacity: 0, y: 60, rotateX: -10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.7, 
        delay: index * 0.15,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3 }
      }}
    >
      {/* Quote Icon */}
      <motion.div 
        className="w-12 h-12 rounded-2xl bg-gradient-to-br from-coral/20 to-gold/20 flex items-center justify-center mb-5"
        whileHover={{ scale: 1.15, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <Quote size={22} className="text-primary" />
      </motion.div>

      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 + i * 0.05 + 0.3 }}
          >
            <Star
              size={18}
              className={i < rating ? "fill-gold text-gold" : "text-muted"}
            />
          </motion.div>
        ))}
      </div>

      {/* Review */}
      <p className="font-body text-foreground leading-relaxed mb-4 text-base">
        "{review}"
      </p>

      {/* Product */}
      <p className="font-body text-sm text-muted-foreground mb-6">
        Purchased: <span className="text-primary font-semibold">{product}</span>
      </p>

      {/* Customer Info */}
      <div className="flex items-center gap-4 pt-5 border-t border-border">
        <motion.img
          src={image}
          alt={name}
          className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
        <div>
          <p className="font-display text-lg font-semibold text-foreground">{name}</p>
          <p className="font-body text-sm text-muted-foreground">{location}</p>
        </div>
      </div>
    </motion.div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai, Maharashtra",
      image: customer1,
      rating: 5,
      review: "Absolutely stunning quality! The embroidery work on my Anarkali is breathtaking. I've received so many compliments. Will definitely be ordering more!",
      product: "Embroidered Anarkali Kurthi",
    },
    {
      name: "Lakshmi Venkatesh",
      location: "Chennai, Tamil Nadu",
      image: customer2,
      rating: 5,
      review: "The fabric quality exceeded my expectations. Perfect fit and the colors are exactly as shown. Aroma Ethnic has become my go-to for ethnic wear.",
      product: "Silk Blend Festive Kurthi",
    },
    {
      name: "Ananya Reddy",
      location: "Hyderabad, Telangana",
      image: customer3,
      rating: 5,
      review: "Fast delivery and beautiful packaging! The chikankari work is authentic and the kurthi is so comfortable for daily wear. Highly recommend!",
      product: "Casual Chikankari Kurthi",
    },
    {
      name: "Meera Krishnan",
      location: "Bangalore, Karnataka",
      image: customer4,
      rating: 5,
      review: "Wore this for a wedding and everyone asked where I got it! The mirror work is exquisite and the fit is perfect. Worth every rupee.",
      product: "Mirror Work Party Dress",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/50 relative overflow-hidden">
      {/* Animated Decorative elements */}
      <motion.div 
        className="absolute top-0 left-0 w-96 h-96 bg-coral/5 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-0 right-0 w-96 h-96 bg-teal/5 rounded-full blur-3xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <ScrollReveal variant="fadeUp" className="text-center mb-12 md:mb-16">
          <motion.span 
            className="inline-block font-body text-sm tracking-[0.3em] uppercase text-secondary font-medium bg-secondary/10 px-4 py-2 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Customer Love
          </motion.span>
          
          <motion.h2 
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-6 mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            What Our <span className="text-gradient">Customers Say</span>
          </motion.h2>
          
          <motion.p 
            className="font-body text-muted-foreground max-w-lg mx-auto text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Don't just take our word for it — hear from the thousands of happy 
            customers who've found their perfect ethnic wear with us.
          </motion.p>

          {/* Overall Rating */}
          <motion.div 
            className="inline-flex items-center gap-4 mt-8 bg-card px-6 py-4 rounded-2xl border border-border shadow-lg"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, rotate: -180, scale: 0 }}
                  whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.1, type: "spring", stiffness: 200 }}
                >
                  <Star size={28} className="fill-gold text-gold" />
                </motion.div>
              ))}
            </div>
            <div className="text-left">
              <p className="font-display text-3xl font-bold text-foreground">4.9/5</p>
              <p className="font-body text-sm text-muted-foreground">Based on 2,500+ reviews</p>
            </div>
          </motion.div>
        </ScrollReveal>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.name} {...testimonial} index={index} />
          ))}
        </div>

        {/* Trust Badges */}
        <StaggerContainer className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6" staggerDelay={0.1}>
          {[
            { value: "15,000+", label: "Happy Customers", color: "from-coral to-coral-dark" },
            { value: "98%", label: "Satisfaction Rate", color: "from-teal to-teal-dark" },
            { value: "4.9★", label: "Average Rating", color: "from-gold to-gold-dark" },
            { value: "2,500+", label: "5-Star Reviews", color: "from-plum to-plum-light" },
          ].map((stat, index) => (
            <StaggerItem key={stat.label}>
              <motion.div 
                className={`text-center p-6 rounded-2xl bg-gradient-to-br ${stat.color} text-primary-foreground shadow-xl`}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.p 
                  className="font-display text-3xl md:text-4xl font-bold"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 200 }}
                >
                  {stat.value}
                </motion.p>
                <p className="font-body text-sm opacity-90">{stat.label}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default Testimonials;
