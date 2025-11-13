"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { CircuitBoard, Globe, Layers3, TrendingUp } from "lucide-react";

const results = [
  {
    icon: Layers3,
    metric: "68",
    suffix: "%",
    label: "Faster go-lives",
    description: "Average reduction in time-to-launch for new software and web products.",
    gradient: "from-red-500 to-rose-500",
  },
  {
    icon: Globe,
    metric: "140",
    suffix: "%",
    label: "Organic growth",
    description: "SEO visibility lift in the first six months for growth-stage teams.",
    gradient: "from-red-500 to-rose-500",
  },
  {
    icon: TrendingUp,
    metric: "4",
    suffix: "x",
    label: "Social-sourced pipeline",
    description: "Increase in qualified demos attributed to multi-channel content systems.",
    gradient: "from-red-500 to-rose-500",
  },
  {
    icon: CircuitBoard,
    metric: "92",
    suffix: "%",
    label: "Partner retention",
    description: "Clients who renew for ongoing optimization after the first engagement.",
    gradient: "from-red-500 to-rose-500",
  },
];

function AnimatedCounter({ end, duration = 2, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number) => {
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
    <section id="results" className="bg-linear-to-b from-white to-[#F4F5F7] py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mb-4 text-sm font-semibold uppercase tracking-widest text-red-600">
            Impact by the numbers
          </div>
          <h2 className="mb-6 text-4xl font-bold text-slate-900 md:text-5xl lg:text-6xl">
            Outcome-focused engagements, not vanity metrics.
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-slate-600">
            From platform launches to omnichannel growth programs, we build measurable momentum that keeps compounding long after the first release.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {results.map((result, index) => (
            <motion.div
              key={result.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="group relative h-full overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-8 shadow-lg shadow-slate-200/60"
            >
              <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br ${result.gradient} text-white shadow-lg shadow-red-500/30 transition-transform duration-300 group-hover:scale-110`}>
                <result.icon className="h-7 w-7" />
              </div>
              <div className={`text-5xl font-bold text-slate-900 md:text-6xl`}>
                <span className="bg-linear-to-br from-red-500 to-rose-500 bg-clip-text text-transparent">
                  <AnimatedCounter end={parseInt(result.metric, 10)} suffix={result.suffix} />
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{result.label}</h3>
              <p className="mt-2 text-sm text-slate-600">{result.description}</p>
              <div className={`pointer-events-none absolute -inset-0.5 rounded-2xl bg-linear-to-br ${result.gradient} opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-20`} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 grid gap-6 md:grid-cols-3"
        >
          {[
            {
              brand: "NovaStack",
              industry: "B2B SaaS",
              result: "Rebuilt product onboarding & marketing site, increasing activation by 36%.",
              image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
            },
            {
              brand: "Brightline Health",
              industry: "Healthcare",
              result: "Technical SEO and authority content program delivering +180% organic sessions.",
              image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
            },
            {
              brand: "Orbit Commerce",
              industry: "E-commerce",
              result: "Automated social + CRM workflows generating 4.5x more qualified leads.",
              image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
            },
          ].map((study, index) => (
            <motion.div
              key={study.brand}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
              className="group relative overflow-hidden rounded-2xl shadow-xl"
            >
              <div className="relative aspect-4/3 overflow-hidden">
                <Image
                  src={study.image}
                  alt={study.brand}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  priority={index === 0}
                  quality={75}
                />
              </div>
              <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-slate-950 via-slate-950/70 to-transparent p-6 text-white">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-red-200">
                  {study.industry}
                </span>
                <h3 className="mt-2 text-2xl font-semibold">{study.brand}</h3>
                <p className="mt-2 text-sm text-white/80">{study.result}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
