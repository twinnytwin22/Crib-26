'use client';   
import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CMO, TechFlow",
    company: "SaaS Platform",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop",
    text: "Crib transformed our social strategy completely. We went from sporadic posts to a consistent, data-driven content machine. The results speak for themselves — our engagement is up 150% and we're finally seeing real conversions from social.",
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    role: "Founder",
    company: "UrbanStyle",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop",
    text: "What sets Crib apart is their tech-first approach. They don't just create content — they build systems that scale. Our content output quadrupled while our production costs stayed flat. That's the power of smart automation.",
    rating: 5,
  },
  {
    name: "Emily Watson",
    role: "Head of Marketing",
    company: "WellnessHub",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop",
    text: "Working with Crib feels like having an extension of our team, but with superpowers. They understand our brand deeply and consistently deliver content that resonates with our audience. The analytics insights alone are worth it.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 px-6 bg-linear-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-semibold text-purple-600 uppercase tracking-wider mb-4">
            Client Love
          </h2>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Trusted by Brands
            <br />
            <span className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Who Demand Results
            </span>
          </h3>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="group relative"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                {/* Quote icon */}
                <div className="mb-6">
                  <Quote className="w-10 h-10 text-purple-200" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Testimonial text */}
                <p className="text-slate-700 leading-relaxed mb-6 grow">
                  "{testimonial.text}"
                </p>

                {/* Author info */}
                <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-bold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-600">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>

                {/* Hover gradient border */}
                <div className="absolute inset-0 bg-linear-to-br from-purple-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-linear-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
            <div className="grow text-left">
              <h4 className="text-2xl font-bold mb-2">Ready to Join Them?</h4>
              <p className="text-white/90">Let's talk about your growth goals</p>
            </div>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-purple-50 transition-colors whitespace-nowrap"
            >
              Start Your Journey
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}