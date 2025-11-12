'use client';
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, TrendingUp, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleCTAClick = () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background image with parallax */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    // backgroundImage: `url('https://cdn.sanity.io/images/6d8w1e5g/production/eb038251c03c29753beec89d9399a187335a7be5-5760x3240.jpg')`,
                    transform: `translateY(${scrollY * 0.5}px)`,
                }}
            >
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-amber-600/10" />
            </div>

            {/* Floating orbs */}
            {/* <motion.div
                className="absolute top-20 left-10 w-72 h-72 bg-red-500/20 rounded-full blur-3xl"
                animate={{
                    y: [0, 30, 0],
                    x: [0, 20, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute bottom-20 right-10 w-96 h-96
                //  bg-red-500/20
                 rounded-full blur-3xl"
                animate={{
                    y: [0, -40, 0],
                    x: [0, -30, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            /> */}

            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-8"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-black/10 backdrop-blur-lg border border-white/20 rounded-full text-black text-sm"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>Where Creativity Meets Growth</span>
                    </motion.div>

                    {/* Main headline */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-black leading-tight tracking-tight">
                        Transform Ideas
                        <br />
                        Into <span className="bg-linear-to-r from-red-500 via-rose-500 to-red-500 bg-clip-text text-transparent">Measurable Growth</span>
                    </h1>

                    {/* Subtext */}
                    <p className="text-xl md:text-2xl text-black/80 max-w-3xl mx-auto leading-relaxed">
                        Crib helps brands scale social media and SEO visibility through creative automation, 
                        smart analytics, and data-driven strategies that deliver real results.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                        <Button
                            onClick={handleCTAClick}
                     //   size="lg"
                            className="bg-red-600 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 group"
                        >
                            Book a Discovery Call
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button
                        //  variant="outline"
                         // size="lg"
                            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                            className="bg-black/10 backdrop-blur-lg border-black/20 text-black hover:bg-black/20 px-8 py-6 text-lg rounded-full"
                        >
                            See What We Do
                        </Button>
                    </div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="grid grid-cols-3 gap-8 pt-12 max-w-3xl mx-auto"
                    >
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-black mb-2">120%+</div>
                            <div className="text-sm text-black/60">Avg. Engagement Boost</div>
                        </div>
                        <div className="text-center border-x border-black/20">
                            <div className="text-3xl md:text-4xl font-bold text-black mb-2">4x</div>
                            <div className="text-sm text-black/60">Content Output</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-black mb-2">30%+</div>
                            <div className="text-sm text-black/60">Organic Reach</div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <div className="w-6 h-10 border-2 border-white/30 rounded-full p-1">
                    <motion.div
                        className="w-1 h-2 bg-black rounded-full mx-auto"
                        animate={{ y: [0, 16, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>
            </motion.div>
        </section>
    );
}