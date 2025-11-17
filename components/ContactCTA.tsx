"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Mail, MapPin, Rocket } from "lucide-react";

export default function ContactCTA() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    companySize: "",
    budget: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Message sent! We'll be in touch within 24 hours.", {
          description: "Thanks for reaching out to Crib Digital.",
        });
        setFormData({ name: "", email: "", company: "", companySize: "", budget: "", message: "" });
      } else {
        toast.error("Failed to send message", {
          description: data.error || "Please try again later.",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to send message", {
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-24 px-6">
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.6, 0.8, 0.6] }}
        transition={{ duration: 10, repeat: Infinity }}
        style={{
          backgroundImage: "radial-gradient(circle at 20% 20%, rgba(244,114,182,0.2), transparent 45%), radial-gradient(circle at 80% 10%, rgba(79,70,229,0.25), transparent 45%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur">
              <Rocket className="h-4 w-4" />
              Launch your next digital release
            </div>
            <h2 className="mb-6 text-4xl font-bold leading-tight md:text-5xl">
              Ready to ship software, websites, SEO, and social that actually work together?
            </h2>
            <p className="mb-10 text-xl text-white/70">
              Book a strategy session and we’ll audit your current stack, surface the biggest opportunities, and co-create a plan that blends product innovation with measurable growth.
            </p>

            <div className="mb-12 space-y-4">
              {["Full digital roadmaps across product, SEO, and social", "Sprint-based execution with weekly visibility", "In-house enablement so your team can run with it"].map((point, index) => (
                <motion.div
                  key={point}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <span className="h-2 w-2 rounded-full bg-linear-to-r from-red-400 to-rose-400" />
                  <span className="text-lg text-white/80">{point}</span>
                </motion.div>
              ))}
            </div>

            <div className="space-y-4 text-white/70">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5" />
                <span>hello@cribnetwork.io</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5" />
                <span>Phoenix, AZ • Remote-first</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
              <h3 className="text-2xl font-semibold text-white">Book your strategy session</h3>
              <p className="mt-2 text-sm text-white/60">Tell us a bit about your goals—we’ll follow up to schedule a working session.</p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div>
                  <Label htmlFor="name" className="mb-2 block text-white/90">
                    Full name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:border-rose-200"
                    placeholder="Alex Morgan"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="mb-2 block text-white/90">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:border-rose-200"
                    placeholder="alex@company.com"
                  />
                </div>

                <div>
                  <Label htmlFor="company" className="mb-2 block text-white/90">
                    Company
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:border-rose-200"
                    placeholder="Company name"
                  />
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="flex-1">
                    <Label htmlFor="companySize" className="mb-2 block text-white/90">
                      Company size
                    </Label>
                    <Select
                      name="companySize"
                      value={formData.companySize}
                      onValueChange={(value) => setFormData({ ...formData, companySize: value })}
                    >
                      <SelectTrigger className="border-white/20 bg-white/10 text-white [&>span]:text-white">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="bg-white text-slate-900">
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-500">201-500 employees</SelectItem>
                        <SelectItem value="501-1000">501-1000 employees</SelectItem>
                        <SelectItem value="1000+">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1">
                    <Label htmlFor="budget" className="mb-2 block text-white/90">
                      Monthly budget
                    </Label>
                    <Select
                      name="budget"
                      value={formData.budget}
                      onValueChange={(value) => setFormData({ ...formData, budget: value })}
                    >
                      <SelectTrigger className="border-white/20 bg-white/10 text-white [&>span]:text-white">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="bg-white text-slate-900">
                        <SelectItem value="<5k">Less than $5,000</SelectItem>
                        <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                        <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                        <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                        <SelectItem value="50k+">$50,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="message" className="mb-2 block text-white/90">
                    What should we focus on?
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="resize-none border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:border-rose-200"
                    placeholder="Tell us about your product, website, SEO, or social goals."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="group w-full rounded-full border border-rose-200/60 bg-white/10 py-6 text-base font-semibold text-white shadow-lg shadow-red-500/20 transition hover:bg-white/20"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send message
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-20 border-t border-white/10 pt-10 text-sm text-white/50"
        >
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <span>© {new Date().getFullYear()} Crib Digital. All rights reserved.</span>
            <div className="flex gap-8">
              <a href="/privacy-policy" className="transition hover:text-white">
                Privacy Policy
              </a>
              <a href="/terms" className="transition hover:text-white">
                Terms of Service
              </a>
              <a href="#" className="transition hover:text-white">
                Careers
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
