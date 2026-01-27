import { useState } from "react";
import { Star, ThumbsUp, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
  helpful: number;
  size?: string;
  color?: string;
}

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

// Mock reviews data - in production this would come from a database
const generateReviews = (productId: string): Review[] => [
  {
    id: `${productId}-r1`,
    author: "Priya Sharma",
    rating: 5,
    date: "2 weeks ago",
    title: "Absolutely stunning!",
    content: "The quality is amazing and the embroidery work is so intricate. I received so many compliments at my cousin's wedding. The fabric feels premium and the fit is perfect. Definitely ordering more!",
    verified: true,
    helpful: 24,
    size: "M",
    color: "Rose Pink",
  },
  {
    id: `${productId}-r2`,
    author: "Ananya Reddy",
    rating: 5,
    date: "1 month ago",
    title: "Perfect for festivals",
    content: "Wore this for Diwali and it was perfect! The color is exactly as shown in the pictures. Very comfortable to wear for long hours.",
    verified: true,
    helpful: 18,
    size: "L",
    color: "Royal Blue",
  },
  {
    id: `${productId}-r3`,
    author: "Meera Patel",
    rating: 4,
    date: "1 month ago",
    title: "Beautiful but runs slightly small",
    content: "The dress is gorgeous and the quality is excellent. However, it runs a bit small so I'd recommend ordering one size up. Customer service was very helpful with the exchange.",
    verified: true,
    helpful: 31,
    size: "S",
    color: "Emerald Green",
  },
  {
    id: `${productId}-r4`,
    author: "Kavitha Menon",
    rating: 5,
    date: "2 months ago",
    title: "Worth every penny",
    content: "I was hesitant about ordering ethnic wear online, but this exceeded my expectations. The packaging was beautiful and the dress arrived in perfect condition. Will definitely shop here again!",
    verified: true,
    helpful: 15,
    size: "XL",
    color: "Burgundy",
  },
  {
    id: `${productId}-r5`,
    author: "Deepa Krishnan",
    rating: 4,
    date: "2 months ago",
    title: "Great quality",
    content: "Beautiful piece with excellent craftsmanship. The only reason for 4 stars is the delivery took a bit longer than expected. But the product itself is perfect!",
    verified: false,
    helpful: 8,
    size: "M",
    color: "Rose Pink",
  },
];

const ratingDistribution = [
  { stars: 5, percentage: 72, count: 92 },
  { stars: 4, percentage: 18, count: 23 },
  { stars: 3, percentage: 6, count: 8 },
  { stars: 2, percentage: 3, count: 4 },
  { stars: 1, percentage: 1, count: 1 },
];

const ProductReviews = ({ productId, productName }: ProductReviewsProps) => {
  const [helpfulClicked, setHelpfulClicked] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);
  
  const reviews = generateReviews(productId);
  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);
  
  const totalReviews = 128;
  const averageRating = 4.8;

  const handleHelpful = (reviewId: string) => {
    setHelpfulClicked((prev) => new Set(prev).add(reviewId));
  };

  const renderStars = (rating: number, size: number = 16) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < rating ? "fill-gold text-gold" : "text-muted-foreground/30"}
        />
      ))}
    </div>
  );

  return (
    <section className="py-12 border-t border-border">
      <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-8">
        Customer Reviews
      </h2>

      <div className="grid md:grid-cols-3 gap-8 mb-10">
        {/* Overall Rating */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <span className="font-display text-5xl font-bold text-foreground">
              {averageRating}
            </span>
            <div>
              {renderStars(Math.round(averageRating), 20)}
              <p className="font-body text-sm text-muted-foreground mt-1">
                Based on {totalReviews} reviews
              </p>
            </div>
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="md:col-span-2 space-y-2">
          {ratingDistribution.map(({ stars, percentage, count }) => (
            <div key={stars} className="flex items-center gap-3">
              <span className="font-body text-sm text-muted-foreground w-12">
                {stars} star
              </span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="font-body text-sm text-muted-foreground w-8 text-right">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review CTA */}
      <div className="bg-muted/50 rounded-xl p-6 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-1">
            Share your experience
          </h3>
          <p className="font-body text-sm text-muted-foreground">
            Help others by sharing your thoughts on this product
          </p>
        </div>
        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
          Write a Review
        </Button>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {displayedReviews.map((review) => (
          <div
            key={review.id}
            className="bg-card rounded-xl border border-border p-6"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={review.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary font-body text-sm">
                    {review.author.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-body font-medium text-foreground">
                      {review.author}
                    </span>
                    {review.verified && (
                      <span className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-body px-2 py-0.5 rounded-full">
                        <Check size={12} />
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="font-body text-xs text-muted-foreground">
                    {review.date}
                    {review.size && ` • Size: ${review.size}`}
                    {review.color && ` • ${review.color}`}
                  </p>
                </div>
              </div>
              {renderStars(review.rating)}
            </div>

            <h4 className="font-body font-semibold text-foreground mb-2">
              {review.title}
            </h4>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
              {review.content}
            </p>

            <button
              onClick={() => handleHelpful(review.id)}
              disabled={helpfulClicked.has(review.id)}
              className={`flex items-center gap-2 font-body text-sm transition-colors ${
                helpfulClicked.has(review.id)
                  ? "text-primary cursor-default"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ThumbsUp size={14} className={helpfulClicked.has(review.id) ? "fill-primary" : ""} />
              Helpful ({helpfulClicked.has(review.id) ? review.helpful + 1 : review.helpful})
            </button>
          </div>
        ))}
      </div>

      {/* Show More */}
      {reviews.length > 3 && (
        <div className="text-center mt-8">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="font-body"
          >
            {showAll ? "Show Less" : `View All ${totalReviews} Reviews`}
          </Button>
        </div>
      )}
    </section>
  );
};

export default ProductReviews;
