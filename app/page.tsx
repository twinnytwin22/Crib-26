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

// Metadata is now in layout.tsx to avoid duplication

export const revalidate = 3600; // Revalidate every hour

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
      <Suspense fallback={<BlogPostsSkeleton />}>
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

function BlogPostsSkeleton() {
  return (
    <section className="bg-linear-to-b from-white to-[#F4F5F7] py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <div className="h-4 w-32 bg-slate-200 rounded animate-pulse mx-auto mb-4" />
          <div className="h-12 w-96 bg-slate-200 rounded animate-pulse mx-auto mb-4" />
          <div className="h-6 w-[600px] bg-slate-200 rounded animate-pulse mx-auto" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl overflow-hidden shadow-xl">
              <div className="aspect-4/3 bg-slate-200 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}