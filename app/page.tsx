import ContactCTA from "@/components/ContactCTA";
import Hero from "@/components/Hero";
import Results from "@/components/Results";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import WhyCrib from "@/components/WhyCrib";
import NavBar from "@/components/nav/NavBar";
import BlogPostsPreview from "@/components/BlogPreview";
import { getBlogPosts } from "@/lib/providers/sanity/sanity";
import { Suspense } from "react";
import allKeywords from "@/lib/seoKeywords";

export const metadata = {
  metadataBase: new URL("https://cribnetwork.io"),

  title: "CRIB",
  description: "Connect. Revolutionize. Innovate. Boost.",

  generator: "CRIB",
  applicationName: "CRIB",
  referrer: "origin-when-cross-origin",
  keywords: allKeywords,
  authors: [{ name: "Randal Herndon" }],
  // colorScheme: "dark",
  creator: "Randal Herndon",
  publisher: "Randal Herndon",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};


export default async function Home() {
  const blogPostsPromise = getBlogPosts();

  return (
    <div>
      <NavBar />
      <Hero />
      <Services />
      <WhyCrib />
      <Results />
      <Testimonials />
      <Suspense fallback={<div>Loading blog posts...</div>}>
        <BlogPosts blogPostsPromise={blogPostsPromise} />
      </Suspense>
      <ContactCTA />
    </div>
  );
}

async function BlogPosts({ 
  blogPostsPromise 
}: { 
  blogPostsPromise: ReturnType<typeof getBlogPosts> 
}) {
  const response = await blogPostsPromise;
  const blogPosts = response.res || [];
  return <BlogPostsPreview blogPosts={blogPosts} />;
}