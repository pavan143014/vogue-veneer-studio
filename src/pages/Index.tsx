import Header from "@/components/storefront/Header";
import Hero from "@/components/storefront/Hero";
import Features from "@/components/storefront/Features";
import Collections from "@/components/storefront/Collections";
import FeaturedProducts from "@/components/storefront/FeaturedProducts";
import BrandStory from "@/components/storefront/BrandStory";
import Footer from "@/components/storefront/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <Collections />
        <FeaturedProducts />
        <BrandStory />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
