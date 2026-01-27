import Header from "@/components/storefront/Header";
import Hero from "@/components/storefront/Hero";
import Features from "@/components/storefront/Features";
import Collections from "@/components/storefront/Collections";
import FeaturedProducts from "@/components/storefront/FeaturedProducts";
import Testimonials from "@/components/storefront/Testimonials";
import BrandStory from "@/components/storefront/BrandStory";
import Footer from "@/components/storefront/Footer";
import PromoBanner from "@/components/storefront/PromoBanner";
import { ScrollReveal } from "@/components/ScrollReveal";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        
        <ScrollReveal variant="fadeUp" delay={0.1}>
          <Features />
        </ScrollReveal>
        
        <ScrollReveal variant="scale" delay={0.1}>
          <PromoBanner variant="flash" />
        </ScrollReveal>
        
        <ScrollReveal variant="fadeUp" delay={0.1}>
          <Collections />
        </ScrollReveal>
        
        <ScrollReveal variant="fadeUp" delay={0.1}>
          <FeaturedProducts />
        </ScrollReveal>
        
        <ScrollReveal variant="blur" delay={0.1}>
          <PromoBanner variant="secondary" />
        </ScrollReveal>
        
        <ScrollReveal variant="fadeUp" delay={0.1}>
          <Testimonials />
        </ScrollReveal>
        
        <ScrollReveal variant="fadeLeft" delay={0.1}>
          <BrandStory />
        </ScrollReveal>
        
        <ScrollReveal variant="scale" delay={0.1}>
          <PromoBanner variant="accent" />
        </ScrollReveal>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
