"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "VP Growth",
    company: "NovaStack",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    text: "Crib reimagined our SaaS onboarding experience and rebuilt our marketing site in the same sprint cadence. Activation jumped 36% and our inbound pipeline now has clarity we've never had before.",
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    role: "Founder",
    company: "Orbit Commerce",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    text: "They think like engineers and storytellers simultaneously. The automation they stood up across CRM, paid, and social feeds us real-time data so we can scale the right moves, faster.",
    rating: 5,
  },
  {
    name: "Emily Watson",
    role: "Head of Marketing",
    company: "Brightline Health",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    text: "Our search authority program with Crib rewired how we plan content. Organic sessions are up 180% and our physicians have assets that actually convert consultations.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="crib-section border-b border-border bg-background">
      <div className="crib-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <div className="crib-eyebrow mb-4">Partner stories</div>
          <h2 className="text-3xl font-semibold leading-tight text-foreground md:text-5xl">
            Modern teams scaling with a modern partner.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Product, marketing, and revenue leaders trust Crib to ship experiences that keep their brand fresh and their growth sustainable.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12, duration: 0.6 }}
              className="h-full"
            >
              <div className="crib-card flex h-full flex-col p-6 text-left">
                <Quote className="mb-6 h-8 w-8 text-[var(--brand-200)]" />
                <div className="mb-4 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, starIndex) => (
                    <Star key={starIndex} className="h-4 w-4 fill-[var(--warn-500)] text-[var(--warn-500)]" />
                  ))}
                </div>
                <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="flex items-center gap-4 border-t border-border pt-5">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="h-11 w-11 rounded-md object-cover"
                    loading="lazy"
                    unoptimized
                  />
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-14"
        >
          <div className="crib-card-dark flex flex-col items-start justify-between gap-5 p-6 sm:flex-row sm:items-center">
            <div className="text-left">
              <h3 className="text-xl font-semibold">Let&apos;s map your next release.</h3>
              <p className="mt-1 text-sm text-white/65">Co-build a roadmap for software, SEO, and social in one session.</p>
            </div>
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="crib-button-primary"
            >
              Book my session
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
