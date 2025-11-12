'use client';
import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Video, BarChart3, Users, Target } from "lucide-react";

const services = [
  // {
  //   icon: Sparkles,
  //   title: "Content Strategy & Automation",
  //   description: "Data-driven content strategies that scale. We automate the creative process while maintaining your unique brand voice.",
  //   gradient: "from-purple-500 to-pink-500",
  // },
  // {
  //   icon: Video,
  //   title: "Short-Form Video Clipping & Repurposing",
  //   description: "Turn long-form content into viral clips. Maximize your reach across TikTok, Reels, Shorts, and beyond.",
  //   gradient: "from-blue-500 to-cyan-500",
  // },
  {
    icon: Users,
    title: "Social Media Management",
    description: "End-to-end social media execution. From scheduling to engagement, we handle it all so you can focus on growth.",
    gradient: "from-red-500 to-rose-500",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics & SEO",
    description: "Deep insights that drive decisions. Track what matters and optimize for organic visibility and conversions.",
    gradient: "from-red-500 to-rose-500",
  },
  {
    icon: Target,
    title: "Audience Growth & Brand Positioning",
    description: "Build a loyal community around your brand. Strategic positioning that turns followers into customers.",
    gradient: "from-red-500 to-rose-500",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 px-6 bg-linear-to-b from-[#FAFAF9] to-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-semibold text-red-600 uppercase tracking-wider mb-4">
            What We Do
          </h2>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Your Content Should Work
            <br />
            <span className="bg-linear-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              Smarter, Not Harder
            </span>
          </h3>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            We combine creative excellence with automation technology to deliver 
            consistent, high-performing content at scale.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Gradient border effect */}
              <div className={`absolute inset-0 bg-linear-to-br ${service.gradient} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${service.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-purple-600 transition-colors">
                {service.title}
              </h4>
              <p className="text-slate-600 leading-relaxed">
                {service.description}
              </p>

              {/* Hover glow effect */}
              <div className={`absolute -inset-0.5 bg-linear-to-br ${service.gradient} rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}