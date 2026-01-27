import { Star, Quote } from "lucide-react";
import customer1 from "@/assets/testimonials/customer1.jpg";
import customer2 from "@/assets/testimonials/customer2.jpg";
import customer3 from "@/assets/testimonials/customer3.jpg";
import customer4 from "@/assets/testimonials/customer4.jpg";

interface TestimonialCardProps {
  name: string;
  location: string;
  image: string;
  rating: number;
  review: string;
  product: string;
}

const TestimonialCard = ({ name, location, image, rating, review, product }: TestimonialCardProps) => {
  return (
    <div className="bg-card rounded-2xl p-6 md:p-8 border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-lg group">
      {/* Quote Icon */}
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <Quote size={20} className="text-primary" />
      </div>

      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < rating ? "fill-gold text-gold" : "text-muted"}
          />
        ))}
      </div>

      {/* Review */}
      <p className="font-body text-foreground leading-relaxed mb-4">
        "{review}"
      </p>

      {/* Product */}
      <p className="font-body text-xs text-muted-foreground mb-6">
        Purchased: <span className="text-primary font-medium">{product}</span>
      </p>

      {/* Customer Info */}
      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <img
          src={image}
          alt={name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-display text-base font-semibold text-foreground">{name}</p>
          <p className="font-body text-xs text-muted-foreground">{location}</p>
        </div>
      </div>
    </div>
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
    <section className="py-16 md:py-24 bg-cream-dark">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="font-body text-sm tracking-[0.3em] uppercase text-primary font-medium">
            Customer Love
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-foreground mt-3 mb-4">
            What Our Customers Say
          </h2>
          <p className="font-body text-muted-foreground max-w-lg mx-auto">
            Don't just take our word for it — hear from the thousands of happy 
            customers who've found their perfect ethnic wear with us.
          </p>

          {/* Overall Rating */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={24} className="fill-gold text-gold" />
              ))}
            </div>
            <div className="text-left">
              <p className="font-display text-2xl font-semibold text-foreground">4.9/5</p>
              <p className="font-body text-xs text-muted-foreground">Based on 2,500+ reviews</p>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <TestimonialCard {...testimonial} />
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-16">
          <div className="text-center">
            <p className="font-display text-3xl md:text-4xl font-semibold text-foreground">15,000+</p>
            <p className="font-body text-sm text-muted-foreground">Happy Customers</p>
          </div>
          <div className="hidden md:block w-px h-12 bg-border" />
          <div className="text-center">
            <p className="font-display text-3xl md:text-4xl font-semibold text-foreground">98%</p>
            <p className="font-body text-sm text-muted-foreground">Satisfaction Rate</p>
          </div>
          <div className="hidden md:block w-px h-12 bg-border" />
          <div className="text-center">
            <p className="font-display text-3xl md:text-4xl font-semibold text-foreground">4.9★</p>
            <p className="font-body text-sm text-muted-foreground">Average Rating</p>
          </div>
          <div className="hidden md:block w-px h-12 bg-border" />
          <div className="text-center">
            <p className="font-display text-3xl md:text-4xl font-semibold text-foreground">2,500+</p>
            <p className="font-body text-sm text-muted-foreground">5-Star Reviews</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
