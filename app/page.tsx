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

export const revalidate = 0; // Revalidate every hour
export const dynamic = "force-dynamic";

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
    <section className="crib-section border-t border-border bg-[var(--surface)]">
      <div className="crib-container">
        <div className="mb-12 max-w-3xl">
          <div className="mb-4 h-4 w-32 animate-pulse rounded bg-[var(--neutral-200)]" />
          <div className="mb-4 h-11 w-full max-w-xl animate-pulse rounded bg-[var(--neutral-200)]" />
          <div className="h-5 w-full max-w-2xl animate-pulse rounded bg-[var(--neutral-200)]" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
              <div className="aspect-4/3 animate-pulse bg-[var(--neutral-200)]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
