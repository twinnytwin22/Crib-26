'use client';
import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, Users, VideoIcon, Target } from "lucide-react";

const results = [
  {
    icon: TrendingUp,
    metric: "120",
    suffix: "%",
    label: "Average Engagement Boost",
    description: "Across all client accounts in 90 days",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: VideoIcon,
    metric: "4",
    suffix: "x",
    label: "Content Output Multiplier",
    description: "More content, same budget",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Users,
    metric: "30",
    suffix: "%",
    label: "More Organic Reach",
    description: "Without paid advertising spend",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Target,
    metric: "85",
    suffix: "%",
    label: "Client Retention Rate",
    description: "Partners who stay and grow with us",
    gradient: "from-indigo-500 to-purple-500",
  },
];

function AnimatedCounter({ end, duration = 2, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: any;
    let animationFrame: number;

    const animate = (currentTime: any) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isInView]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function Results() {
  return (
    <section className="py-24 px-6 bg-linear-to-b from-white to-[#FAFAF9]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-semibold text-purple-600 uppercase tracking-wider mb-4">
            Proven Results
          </h2>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            From Concept to
            <br />
            <span className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Conversion
            </span>
          </h3>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Real metrics from real brands who've transformed their social presence with Crib.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map((result, index) => (
            <motion.div
              key={result.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="relative group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${result.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <result.icon className="w-7 h-7 text-white" />
                </div>

                {/* Metric */}
                <div className={`text-5xl md:text-6xl font-bold bg-linear-to-br ${result.gradient} bg-clip-text text-transparent mb-3`}>
                  <AnimatedCounter 
                    end={parseInt(result.metric)} 
                    suffix={result.suffix}
                  />
                </div>

                {/* Label */}
                <h4 className="text-lg font-bold text-slate-900 mb-2">
                  {result.label}
                </h4>

                {/* Description */}
                <p className="text-slate-600 text-sm leading-relaxed mt-auto">
                  {result.description}
                </p>

                {/* Hover glow effect */}
                <div className={`absolute -inset-0.5 bg-linear-to-br ${result.gradient} rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Case study cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 grid md:grid-cols-3 gap-6"
        >
          {[
            {
              brand: "TechFlow",
              industry: "SaaS",
              result: "From 2K to 50K followers in 6 months",
              image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop",
            },
            {
              brand: "WellnessHub",
              industry: "Health & Fitness",
              result: "3.2M impressions with repurposed content",
              image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop",
            },
            {
              brand: "UrbanStyle",
              industry: "Fashion E-commerce",
              result: "200% increase in social-driven sales",
              image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop",
            },
          ].map((study, index) => (
            <motion.div
              key={study.brand}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="aspect-4/3 overflow-hidden">
                <img 
                  src={study.image} 
                  alt={study.brand}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/60 to-transparent flex flex-col justify-end p-6">
                <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">
                  {study.industry}
                </div>
                <h4 className="text-2xl font-bold text-white mb-2">
                  {study.brand}
                </h4>
                <p className="text-white/90">
                  {study.result}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}