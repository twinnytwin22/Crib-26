"use client";

import { useEffect, useRef, useState } from "react";
import { 
  Globe2, 
  MapPin, 
  Sparkles, 
  Zap, 
  TrendingUp, 
  Users2,
  Rocket,
  Building2,
  Store,
  Factory,
  Warehouse,
  Package
} from "lucide-react";

// Logo placeholders with icons
const trustedCompanies = [
  { name: "TechCorp", icon: Rocket },
  { name: "BuildCo", icon: Building2 },
  { name: "StoreFront", icon: Store },
  { name: "ManuTech", icon: Factory },
  { name: "LogiHub", icon: Warehouse },
  { name: "PackPro", icon: Package },
];

const stats = [
  { icon: Users2, value: "50+", label: "Partners" },
  { icon: Globe2, value: "12", label: "Countries" },
  { icon: TrendingUp, value: "200%", label: "Growth" },
  { icon: Zap, value: "Fast", label: "Delivery" },
];

export default function LocationShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-slate-950 py-24 px-6"
    >
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      >
        <source src="/AZ SHOTS.mp4" type="video/mp4" />
      </video>

      {/* Simple overlay */}
      <div className="absolute inset-0 bg-slate-950/70" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className={`inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-medium text-white backdrop-blur mb-6 transition-all duration-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <MapPin className="h-4 w-4 text-red-400" />
            Phoenix, AZ • Serving the World
          </div>
          <h2
            className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 transition-all duration-500 delay-75 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Rooted locally.{" "}
            <span className="text-red-400">Scaling globally.</span>
          </h2>
          <p
            className={`text-lg md:text-xl text-white/60 max-w-2xl mx-auto transition-all duration-500 delay-150 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Partnering with innovative teams worldwide to build, grow, and scale digital experiences.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${225 + index * 75}ms` }}
            >
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur transition-all duration-300 hover:bg-white/10 hover:border-white/20">
                <stat.icon className="h-6 w-6 mx-auto mb-3 text-red-400" />
                <div className="text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-white/50 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trusted By Section */}
        <div
          className={`transition-all duration-500 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="text-center mb-8">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">
              Trusted by innovative teams
            </h3>
          </div>

          {/* Logo Grid */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {trustedCompanies.map((company, index) => (
              <div
                key={company.name}
                className="flex flex-col items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur transition-all duration-300 hover:border-white/20 hover:bg-white/10"
              >
                <company.icon className="h-8 w-8 text-white/70" />
                <span className="text-xs font-medium text-white/50 text-center">
                  {company.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          className={`text-center mt-16 transition-all duration-500 delay-600 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <button
            onClick={() =>
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
            }
            className="inline-flex items-center gap-2 rounded-full bg-red-500 px-8 py-4 font-semibold text-white shadow-lg shadow-red-500/30 transition-all duration-300 hover:bg-red-600 hover:shadow-red-500/50"
          >
            <Globe2 className="h-5 w-5" />
            Let's Work Together
          </button>
        </div>
      </div>
    </section>
  );
}
