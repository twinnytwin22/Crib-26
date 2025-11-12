'use client';
import React from "react";
import { motion } from "framer-motion";
import { Check, Zap, Brain, Clock, LineChart } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Faster Content Delivery",
    description: "Automation-powered workflows that cut production time in half while maintaining quality.",
  },
  {
    icon: Brain,
    title: "Deeper Insights",
    description: "AI-driven analytics that uncover hidden opportunities in your content strategy.",
  },
  {
    icon: LineChart,
    title: "Consistent Brand Identity",
    description: "Strategic frameworks that ensure every piece of content aligns with your brand story.",
  },
  {
    icon: Clock,
    title: "Always-On Optimization",
    description: "Continuous testing and refinement to maximize ROI on every campaign.",
  },
];

export default function WhyCrib() {
  return (
    <section className="py-24 px-6 bg-black relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '48px 48px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-semibold text-amber-100 uppercase tracking-wider mb-4">
              Why Choose Crib
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Beyond Generic
              <br />
              Social Media Management
            </h3>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Most agencies just post content. We build integrated, tech-enabled systems 
              that turn your social presence into a measurable growth engine.
            </p>

            <div className="space-y-4">
              {[
                "Tech-enabled creative workflows",
                "Real-time performance tracking",
                "Cross-platform content optimization",
                "Dedicated strategy team"
              ].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-linear-to-br from-red-500 to-red-500 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white/90 text-lg">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right side - Benefits grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid sm:grid-cols-2 gap-6"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-red-500 to-red-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">
                  {benefit.title}
                </h4>
                <p className="text-white/70 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}