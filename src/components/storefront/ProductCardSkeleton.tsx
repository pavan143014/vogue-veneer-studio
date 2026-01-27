import { motion } from "framer-motion";

const shimmerTransition = { 
  repeat: Infinity, 
  duration: 1.5, 
  ease: "linear" as const 
};

const ProductCardSkeleton = () => {
  return (
    <div className="relative bg-card rounded-2xl overflow-hidden border border-border">
      {/* Image Skeleton */}
      <div className="relative aspect-[3/4] bg-muted overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={shimmerTransition}
        />
        {/* Badge skeleton */}
        <div className="absolute top-3 left-3 w-12 h-6 bg-muted-foreground/10 rounded-full" />
        {/* Heart skeleton */}
        <div className="absolute top-3 right-3 w-10 h-10 bg-muted-foreground/10 rounded-full" />
      </div>

      {/* Content Skeleton */}
      <div className="p-4 md:p-5 space-y-3">
        {/* Stars skeleton */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-3.5 h-3.5 bg-muted-foreground/10 rounded" />
          ))}
          <div className="w-8 h-3 bg-muted-foreground/10 rounded ml-1" />
        </div>
        
        {/* Title skeleton */}
        <div className="relative h-6 bg-muted-foreground/10 rounded-md overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-background/30 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={shimmerTransition}
          />
        </div>
        
        {/* Price skeleton */}
        <div className="flex items-center gap-2">
          <div className="relative h-5 w-20 bg-muted-foreground/10 rounded overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-background/30 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={shimmerTransition}
            />
          </div>
          <div className="h-4 w-16 bg-muted-foreground/10 rounded" />
        </div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
        >
          <ProductCardSkeleton />
        </motion.div>
      ))}
    </div>
  );
};

export const SectionHeaderSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
      <div>
        {/* Badge skeleton */}
        <div className="relative h-8 w-40 bg-primary/10 rounded-full mb-4 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={shimmerTransition}
          />
        </div>
        {/* Title skeleton */}
        <div className="relative h-12 w-72 bg-muted-foreground/10 rounded-lg overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-background/30 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={shimmerTransition}
          />
        </div>
      </div>
      {/* Button skeleton */}
      <div className="h-10 w-36 bg-muted-foreground/10 rounded-md mt-6 md:mt-0" />
    </div>
  );
};

export const TestimonialCardSkeleton = () => {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-4 h-4 bg-muted-foreground/10 rounded" />
        ))}
      </div>
      {/* Quote */}
      <div className="space-y-2 mb-6">
        <div className="relative h-4 w-full bg-muted-foreground/10 rounded overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-background/30 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={shimmerTransition}
          />
        </div>
        <div className="h-4 w-3/4 bg-muted-foreground/10 rounded" />
        <div className="h-4 w-1/2 bg-muted-foreground/10 rounded" />
      </div>
      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-muted-foreground/10 rounded-full" />
        <div className="space-y-2">
          <div className="h-4 w-24 bg-muted-foreground/10 rounded" />
          <div className="h-3 w-16 bg-muted-foreground/10 rounded" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
