'use client';
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function ContactCTA() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success("Message sent! We'll be in touch within 24 hours.", {
      description: "Thanks for reaching out to Crib.",
    });

    setFormData({ name: "", email: "", company: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="py-24 px-6 bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(139,92,246,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(59,130,246,0.3),transparent_50%)]" />
      </div>

      {/* Floating orbs */}
      <motion.div
        className="absolute top-20 left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Let's Build Something Amazing</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Ready to Transform
              <br />
              Your <span className="bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Social Presence?</span>
            </h2>

            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Book a free discovery call and let's discuss how Crib can help your brand 
              achieve measurable growth through smarter content and data-driven strategies.
            </p>

            {/* Key messaging points */}
            <div className="space-y-4 mb-12">
              {[
                "Analyze. Automate. Amplify.",
                "We help brands turn creativity into consistent growth.",
                "Crib powers your social success.",
              ].map((text, index) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-linear-to-r from-purple-400 to-blue-400" />
                  <span className="text-white/90 text-lg font-medium">{text}</span>
                </motion.div>
              ))}
            </div>

            {/* Contact info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white/70">
                <Mail className="w-5 h-5" />
                <span>hello@Crib.agency</span>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <Phone className="w-5 h-5" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <MapPin className="w-5 h-5" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </motion.div>

          {/* Right side - Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">
                Book Your Discovery Call
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-white/90 mb-2 block">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-purple-400"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-white/90 mb-2 block">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-purple-400"
                    placeholder="john@company.com"
                  />
                </div>

                <div>
                  <Label htmlFor="company" className="text-white/90 mb-2 block">
                    Company Name
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-purple-400"
                    placeholder="Your Company"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-white/90 mb-2 block">
                    Tell us about your goals
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-purple-400 resize-none"
                    placeholder="What are you looking to achieve with your social media presence?"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="max-w-7xl mx-auto mt-24 pt-12 border-t border-white/10 relative z-10"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-white/60 text-sm">
            © 2024 Crib. All rights reserved.
          </div>
          <div className="flex gap-8 text-white/60 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}