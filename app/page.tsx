'use client'; 
import ContactCTA from "@/components/ContactCTA";
import Hero from "@/components/Hero";
import Results from "@/components/Results";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import React, { useEffect } from "react";
import WhyCrib from "@/components/WhyCrib";

export default function Home() {
  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="bg-[#FAFAF9] min-h-screen">
      <Hero />
      <Services />
      <WhyCrib />
      <Results />
      <Testimonials />
      <ContactCTA />
    </div>
  );
}