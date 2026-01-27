import Header from "@/components/storefront/Header";
import Hero from "@/components/storefront/Hero";
import Features from "@/components/storefront/Features";
import Collections from "@/components/storefront/Collections";
import FeaturedProducts from "@/components/storefront/FeaturedProducts";
import Testimonials from "@/components/storefront/Testimonials";
import BrandStory from "@/components/storefront/BrandStory";
import Footer from "@/components/storefront/Footer";
import PromoBanner from "@/components/storefront/PromoBanner";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <PromoBanner variant="flash" />
        <Collections />
        <FeaturedProducts />
        <PromoBanner variant="secondary" />
        <Testimonials />
        <BrandStory />
        <PromoBanner variant="accent" />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
