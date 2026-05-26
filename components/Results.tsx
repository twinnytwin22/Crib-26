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
  },
  {
    icon: Globe,
    metric: "140",
    suffix: "%",
    label: "Organic growth",
    description: "SEO visibility lift in the first six months for growth-stage teams.",
  },
  {
    icon: TrendingUp,
    metric: "4",
    suffix: "x",
    label: "Social-sourced pipeline",
    description: "Increase in qualified demos attributed to multi-channel content systems.",
  },
  {
    icon: CircuitBoard,
    metric: "92",
    suffix: "%",
    label: "Partner retention",
    description: "Clients who renew for ongoing optimization after the first engagement.",
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
    <section id="results" className="crib-section border-b border-border bg-[var(--surface)]">
      <div className="crib-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <div className="crib-eyebrow mb-4">Impact by the numbers</div>
          <h2 className="text-3xl font-semibold leading-tight text-foreground md:text-5xl">
            Outcome-focused engagements, not vanity metrics.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            From platform launches to omnichannel growth programs, we build measurable momentum that keeps compounding long after the first release.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {results.map((result, index) => (
            <motion.div
              key={result.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="crib-card h-full p-6"
            >
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-md border border-[var(--brand-100)] bg-[var(--brand-50)] text-primary">
                <result.icon className="h-5 w-5" />
              </div>
              <div className="text-4xl font-semibold text-primary md:text-5xl">
                <AnimatedCounter end={parseInt(result.metric, 10)} suffix={result.suffix} />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">{result.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{result.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-14 grid gap-4 md:grid-cols-3"
        >
          {[
        {
  brand: "Relyy",
  industry: "AI Video & Social Automation",
  result: "AI-powered clip generation and social automation platform that helps brands scale content output 5× while cutting editing time by 90%.",
  image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
},
{
  brand: "CribOS",
  industry: "Small Business Software",
  result: "A streamlined, integration-first CRM that unifies clients, workflows, and invoicing to reduce tool-sprawl and improve team efficiency.",
  image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
},
{
  brand: "LiveHouse",
  industry: "Event Ticketing & Streaming",
  result: "A modern ticketing and livestream platform that centralizes sales, analytics, check-ins, and live show experiences in one system.",
  image: "https://images.unsplash.com/photo-1662383729882-e03ce8e00887",
},




          ].map((study, index) => (
            <motion.div
              key={study.brand}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
              className="group relative overflow-hidden rounded-lg border border-border bg-card shadow-sm"
            >
              <div className="relative aspect-4/3 overflow-hidden">
                <Image
                  src={study.image}
                  alt={study.brand}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  unoptimized
                />
              </div>
              <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/90 via-black/70 to-transparent p-5 text-white">
                <span className="text-xs font-semibold uppercase text-[var(--brand-200)]">
                  {study.industry}
                </span>
                <h3 className="mt-2 text-xl font-semibold">{study.brand}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/78">{study.result}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
