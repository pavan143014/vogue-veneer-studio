import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import ShopifyProductCard from "./ShopifyProductCard";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface RelatedProductsProps {
  currentProductId: string;
  limit?: number;
}

const RelatedProducts = ({ currentProductId, limit = 4 }: RelatedProductsProps) => {
  const { data: products, isLoading } = useShopifyProducts(limit + 1);

  // Filter out current product
  const relatedProducts = products
    ?.filter(p => p.node.id !== currentProductId)
    .slice(0, limit);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 border-t border-border">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
          You May Also Like
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {relatedProducts.map((product, index) => (
            <motion.div
              key={product.node.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ShopifyProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default RelatedProducts;
