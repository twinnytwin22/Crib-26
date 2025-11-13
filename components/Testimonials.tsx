"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import unsplashLoader from "@/lib/unsplash-loader";

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
    <section id="testimonials" className="bg-gradient-to-br from-slate-100 via-white to-slate-50 py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mb-4 text-sm font-semibold uppercase tracking-wider text-red-600">
            Partner stories
          </div>
          <h2 className="mb-6 text-4xl font-bold text-slate-900 md:text-5xl lg:text-6xl">
            Modern teams scaling with a modern partner.
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-slate-600">
            Product, marketing, and revenue leaders trust Crib to ship experiences that keep their brand fresh and their growth sustainable.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12, duration: 0.6 }}
              className="group relative h-full"
            >
              <div className="flex h-full flex-col rounded-2xl border border-slate-200/70 bg-white p-8 text-left shadow-lg shadow-slate-200/60 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
                <Quote className="mb-6 h-10 w-10 text-red-200" />
                <div className="mb-4 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, starIndex) => (
                    <Star key={starIndex} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-6 flex-1 text-slate-700">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full object-cover"
                    loading="lazy"
                    quality={75}
                    loader={unsplashLoader}
                  />
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-600">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/5 to-rose-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col items-center gap-4 rounded-3xl bg-gradient-to-r from-red-500 to-rose-500 p-8 text-white shadow-xl shadow-red-500/30 sm:flex-row sm:gap-6">
            <div className="text-left">
              <h3 className="text-2xl font-semibold">Let’s map your next release.</h3>
              <p className="text-white/80">Co-build a roadmap for software, SEO, and social in one session.</p>
            </div>
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-red-600 shadow-lg transition hover:bg-red-50"
            >
              Book my session
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
