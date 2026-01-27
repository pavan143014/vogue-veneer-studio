import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import { ScrollReveal, StaggerContainer, StaggerItem, Parallax } from "@/components/ScrollReveal";
import { motion } from "framer-motion";
import { Heart, Award, Users, Leaf, MapPin, Quote } from "lucide-react";

// Team photos
import founderImg from "@/assets/team/founder.jpg";
import creativeDirectorImg from "@/assets/team/creative-director.jpg";
import operationsHeadImg from "@/assets/team/operations-head.jpg";

// Artisan photos
import weaverImg from "@/assets/artisans/weaver.jpg";
import embroidererImg from "@/assets/artisans/embroiderer.jpg";
import blockPrinterImg from "@/assets/artisans/block-printer.jpg";

const teamMembers = [
  {
    name: "Lakshmi Venkatesh",
    role: "Founder & CEO",
    image: founderImg,
    bio: "With 20+ years in textile design, Lakshmi founded Aroma Ethnic to bridge traditional craftsmanship with contemporary fashion.",
  },
  {
    name: "Priya Sharma",
    role: "Creative Director",
    image: creativeDirectorImg,
    bio: "Priya brings a fresh perspective to ethnic wear, blending global trends with Indian heritage in every collection.",
  },
  {
    name: "Arjun Mehta",
    role: "Head of Operations",
    image: operationsHeadImg,
    bio: "Arjun ensures our artisan partnerships run smoothly, maintaining quality while supporting sustainable practices.",
  },
];

const timeline = [
  {
    year: "2015",
    title: "The Beginning",
    description: "Started as a small boutique in Mumbai with just 5 artisan partners.",
  },
  {
    year: "2017",
    title: "First Online Store",
    description: "Launched our e-commerce platform, reaching customers across India.",
  },
  {
    year: "2019",
    title: "Artisan Network Expansion",
    description: "Partnered with 50+ artisan clusters across Rajasthan, Gujarat, and Lucknow.",
  },
  {
    year: "2021",
    title: "Sustainability Initiative",
    description: "Introduced eco-friendly packaging and organic fabric collections.",
  },
  {
    year: "2023",
    title: "International Reach",
    description: "Started shipping worldwide, bringing Indian craftsmanship to global markets.",
  },
  {
    year: "2026",
    title: "15K+ Happy Customers",
    description: "Celebrating our community of customers who embrace tradition with style.",
  },
];

const artisans = [
  {
    name: "Ramesh Kumar",
    craft: "Master Weaver",
    location: "Varanasi, Uttar Pradesh",
    image: weaverImg,
    story: "For three generations, Ramesh's family has woven Banarasi silk. Each saree takes 15-20 days to complete, with intricate zari work passed down through centuries.",
    yearsOfExperience: 35,
  },
  {
    name: "Fatima Begum",
    craft: "Chikankari Embroiderer",
    location: "Lucknow, Uttar Pradesh",
    image: embroidererImg,
    story: "Fatima learned the delicate art of Chikankari from her mother. Her team of 12 women artisans creates the intricate white-on-white embroidery that adorns our kurthis.",
    yearsOfExperience: 28,
  },
  {
    name: "Gopal Singh",
    craft: "Block Printer",
    location: "Jaipur, Rajasthan",
    image: blockPrinterImg,
    story: "Using hand-carved wooden blocks and natural dyes, Gopal creates patterns that have been in his family for five generations. Each print is a unique work of art.",
    yearsOfExperience: 40,
  },
];

const values = [
  {
    icon: Heart,
    title: "Passion for Craft",
    description: "Every piece tells a story of dedication and artistry passed down through generations.",
  },
  {
    icon: Users,
    title: "Artisan First",
    description: "We ensure fair wages and sustainable livelihoods for all our artisan partners.",
  },
  {
    icon: Award,
    title: "Quality Promise",
    description: "Handpicked fabrics and meticulous craftsmanship in every garment we create.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description: "Committed to eco-friendly practices from sourcing to packaging.",
  },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-br from-muted via-background to-muted">
          <Parallax speed={0.3} className="absolute inset-0">
            <div className="absolute top-20 right-20 w-96 h-96 bg-coral/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />
          </Parallax>

          <div className="container mx-auto px-4 relative z-10">
            <ScrollReveal variant="fadeUp">
              <div className="text-center max-w-4xl mx-auto">
                <motion.span
                  className="inline-block font-body text-sm tracking-widest uppercase text-primary mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Our Story
                </motion.span>
                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
                  Weaving Dreams, <br />
                  <span className="text-gradient">Preserving Heritage</span>
                </h1>
                <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                  At Aroma Ethnic, we celebrate the timeless beauty of Indian craftsmanship 
                  by connecting skilled artisans with fashion-forward women around the world.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <ScrollReveal variant="fadeUp">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
                What We <span className="text-gradient">Stand For</span>
              </h2>
            </ScrollReveal>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <StaggerItem key={value.title}>
                  <motion.div
                    className="bg-background p-8 rounded-2xl border border-border hover:border-primary/30 transition-all duration-300 h-full"
                    whileHover={{ y: -5, boxShadow: "0 20px 40px -20px rgba(0,0,0,0.15)" }}
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-coral/20 to-gold/20 flex items-center justify-center mb-5">
                      <value.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                      {value.title}
                    </h3>
                    <p className="font-body text-muted-foreground">
                      {value.description}
                    </p>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <ScrollReveal variant="fadeUp">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
                Our <span className="text-gradient">Journey</span>
              </h2>
              <p className="font-body text-muted-foreground text-center max-w-2xl mx-auto mb-16">
                From a small boutique to a beloved brand, here's how we've grown while staying true to our roots.
              </p>
            </ScrollReveal>

            <div className="relative max-w-4xl mx-auto">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-coral via-gold to-teal transform md:-translate-x-1/2" />

              {timeline.map((item, index) => (
                <ScrollReveal
                  key={item.year}
                  variant={index % 2 === 0 ? "fadeRight" : "fadeLeft"}
                  delay={index * 0.1}
                >
                  <div className={`relative flex items-center mb-12 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    {/* Content */}
                    <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                      <motion.div
                        className="bg-card p-6 rounded-2xl border border-border shadow-lg"
                        whileHover={{ scale: 1.02 }}
                      >
                        <span className="inline-block font-display text-2xl font-bold text-gradient mb-2">
                          {item.year}
                        </span>
                        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                          {item.title}
                        </h3>
                        <p className="font-body text-muted-foreground">
                          {item.description}
                        </p>
                      </motion.div>
                    </div>

                    {/* Dot */}
                    <motion.div
                      className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-lg transform md:-translate-x-1/2"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, type: "spring" }}
                    />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <ScrollReveal variant="fadeUp">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
                Meet Our <span className="text-gradient">Team</span>
              </h2>
              <p className="font-body text-muted-foreground text-center max-w-2xl mx-auto mb-16">
                Passionate individuals dedicated to bringing you the finest ethnic wear.
              </p>
            </ScrollReveal>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {teamMembers.map((member) => (
                <StaggerItem key={member.name}>
                  <motion.div
                    className="group text-center"
                    whileHover={{ y: -10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="relative mb-6 mx-auto w-48 h-48 rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/50 transition-colors">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                      {member.name}
                    </h3>
                    <p className="font-body text-sm text-primary font-medium mb-3">
                      {member.role}
                    </p>
                    <p className="font-body text-muted-foreground text-sm max-w-xs mx-auto">
                      {member.bio}
                    </p>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Artisan Stories Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-secondary via-secondary to-secondary/90 text-secondary-foreground">
          <div className="container mx-auto px-4">
            <ScrollReveal variant="fadeUp">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">
                Stories of Our <span className="text-coral-light">Artisans</span>
              </h2>
              <p className="font-body text-center opacity-80 max-w-2xl mx-auto mb-16">
                Behind every garment are skilled hands and rich traditions. Meet the artisans who bring our collections to life.
              </p>
            </ScrollReveal>

            <div className="space-y-16">
              {artisans.map((artisan, index) => (
                <ScrollReveal
                  key={artisan.name}
                  variant={index % 2 === 0 ? "fadeLeft" : "fadeRight"}
                >
                  <div className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-8 lg:gap-12 items-center`}>
                    <motion.div
                      className="lg:w-1/2"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                        <img
                          src={artisan.image}
                          alt={artisan.name}
                          className="w-full h-[400px] object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                          <span className="inline-flex items-center gap-2 bg-background/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-body">
                            <Award className="w-4 h-4" />
                            {artisan.yearsOfExperience} Years of Experience
                          </span>
                        </div>
                      </div>
                    </motion.div>

                    <div className="lg:w-1/2 space-y-6">
                      <div>
                        <h3 className="font-display text-2xl md:text-3xl font-bold mb-2">
                          {artisan.name}
                        </h3>
                        <p className="font-body text-coral-light font-medium text-lg mb-1">
                          {artisan.craft}
                        </p>
                        <p className="font-body text-sm opacity-70 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {artisan.location}
                        </p>
                      </div>

                      <div className="relative">
                        <Quote className="absolute -top-2 -left-2 w-8 h-8 text-coral-light/30" />
                        <p className="font-body text-lg leading-relaxed pl-8 opacity-90">
                          {artisan.story}
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <ScrollReveal variant="scale">
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-coral via-gold to-teal p-12 md:p-16 text-center">
                <div className="absolute inset-0 opacity-20">
                  <motion.div
                    className="absolute top-0 right-0 w-96 h-96 bg-white/30 rounded-full blur-3xl"
                    animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
                    transition={{ duration: 8, repeat: Infinity }}
                  />
                </div>
                <div className="relative z-10">
                  <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
                    Experience the Art of Ethnic Fashion
                  </h2>
                  <p className="font-body text-lg text-primary-foreground/90 max-w-2xl mx-auto mb-8">
                    Explore our curated collections and become part of a story that celebrates 
                    tradition, empowers artisans, and adorns you with timeless elegance.
                  </p>
                  <motion.a
                    href="/shop"
                    className="inline-flex items-center gap-2 bg-background text-foreground font-body font-semibold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Shop Our Collections
                  </motion.a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
