import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().max(20, "Phone must be less than 20 characters").optional(),
  subject: z.string().trim().min(1, "Subject is required").max(200, "Subject must be less than 200 characters"),
  message: z.string().trim().min(1, "Message is required").max(2000, "Message must be less than 2000 characters"),
});

const businessHours = [
  { day: "Monday - Friday", hours: "10:00 AM - 8:00 PM" },
  { day: "Saturday", hours: "10:00 AM - 6:00 PM" },
  { day: "Sunday", hours: "11:00 AM - 5:00 PM" },
];

const ContactUs = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form data
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you within 24 hours.",
    });

    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 via-gold/5 to-teal/5 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-coral/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full font-body text-sm font-medium mb-4">
              Get In Touch
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Contact <span className="text-primary">Us</span>
            </h1>
            <p className="font-body text-lg text-muted-foreground leading-relaxed">
              Have questions about our products or need styling advice? We're here to help!
              Reach out to us and our team will get back to you promptly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form */}
            <ScrollReveal>
              <div className="bg-card rounded-3xl p-8 md:p-10 shadow-lg border border-border/50">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-coral flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-foreground">
                      Send us a Message
                    </h2>
                    <p className="font-body text-sm text-muted-foreground">
                      We typically respond within 24 hours
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="font-body font-medium">
                        Full Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className={`rounded-xl ${errors.name ? "border-destructive" : ""}`}
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive">{errors.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-body font-medium">
                        Email Address <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className={`rounded-xl ${errors.email ? "border-destructive" : ""}`}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="font-body font-medium">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="font-body font-medium">
                        Subject <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help?"
                        className={`rounded-xl ${errors.subject ? "border-destructive" : ""}`}
                      />
                      {errors.subject && (
                        <p className="text-sm text-destructive">{errors.subject}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="font-body font-medium">
                      Message <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your inquiry..."
                      rows={5}
                      className={`rounded-xl resize-none ${errors.message ? "border-destructive" : ""}`}
                    />
                    {errors.message && (
                      <p className="text-sm text-destructive">{errors.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary to-coral hover:from-primary/90 hover:to-coral/90 text-primary-foreground rounded-xl py-6 font-body font-semibold text-base transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                        />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        Send Message
                      </span>
                    )}
                  </Button>
                </form>
              </div>
            </ScrollReveal>

            {/* Contact Info & Map */}
            <div className="space-y-8">
              {/* Contact Information */}
              <ScrollReveal delay={0.1}>
                <div className="bg-card rounded-3xl p-8 shadow-lg border border-border/50">
                  <h3 className="font-display text-xl font-bold text-foreground mb-6">
                    Contact Information
                  </h3>
                  <div className="space-y-5">
                    <motion.a
                      href="https://maps.google.com/?q=Bangalore,Karnataka,India"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-4 group"
                      whileHover={{ x: 5 }}
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-body font-semibold text-foreground">Store Address</p>
                        <p className="font-body text-sm text-muted-foreground">
                          123 Fashion Street, Koramangala<br />
                          Bangalore, Karnataka 560034
                        </p>
                      </div>
                    </motion.a>

                    <motion.a
                      href="tel:+919876543210"
                      className="flex items-start gap-4 group"
                      whileHover={{ x: 5 }}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                        <Phone className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <p className="font-body font-semibold text-foreground">Phone</p>
                        <p className="font-body text-sm text-muted-foreground">
                          +91 98765 43210<br />
                          +91 80 4123 4567
                        </p>
                      </div>
                    </motion.a>

                    <motion.a
                      href="mailto:hello@aromaethnic.com"
                      className="flex items-start gap-4 group"
                      whileHover={{ x: 5 }}
                    >
                      <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center flex-shrink-0 group-hover:bg-teal/20 transition-colors">
                        <Mail className="w-5 h-5 text-teal" />
                      </div>
                      <div>
                        <p className="font-body font-semibold text-foreground">Email</p>
                        <p className="font-body text-sm text-muted-foreground">
                          hello@aromaethnic.com<br />
                          support@aromaethnic.com
                        </p>
                      </div>
                    </motion.a>
                  </div>
                </div>
              </ScrollReveal>

              {/* Business Hours */}
              <ScrollReveal delay={0.2}>
                <div className="bg-card rounded-3xl p-8 shadow-lg border border-border/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-coral" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground">
                      Business Hours
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {businessHours.map((schedule, index) => (
                      <motion.div
                        key={schedule.day}
                        className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <span className="font-body font-medium text-foreground">
                          {schedule.day}
                        </span>
                        <span className="font-body text-muted-foreground">
                          {schedule.hours}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-primary/5 rounded-xl">
                    <p className="font-body text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">Note:</span> We're closed on major public holidays. 
                      For urgent inquiries, please email us.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Map */}
              <ScrollReveal delay={0.3}>
                <div className="bg-card rounded-3xl overflow-hidden shadow-lg border border-border/50">
                  <div className="p-4 border-b border-border/50">
                    <h3 className="font-display text-lg font-bold text-foreground">
                      Find Us Here
                    </h3>
                  </div>
                  <div className="aspect-video relative">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5983871268!2d77.6145!3d12.9352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU2JzA2LjciTiA3N8KwMzYnNTIuMiJF!5e0!3m2!1sen!2sin!4v1234567890"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0"
                      title="Aroma Ethnic Store Location"
                    />
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 via-gold/10 to-teal/10">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                Prefer to Chat?
              </h2>
              <p className="font-body text-muted-foreground mb-6">
                Connect with us on WhatsApp for quick responses to your queries about orders, 
                sizing, or styling advice.
              </p>
              <Button
                asChild
                className="bg-[#25D366] hover:bg-[#25D366]/90 text-white rounded-xl px-8 py-6 font-body font-semibold"
              >
                <a
                  href={`https://wa.me/919876543210?text=${encodeURIComponent("Hi! I have a question about Aroma Ethnic products.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Chat on WhatsApp
                </a>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactUs;
