import ContactCTA from "@/components/ContactCTA";
import Hero from "@/components/Hero";
import Results from "@/components/Results";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import WhyCrib from "@/components/WhyCrib";
import NavBar from "@/components/nav/NavBar";
import BlogPostsPreview from "@/components/BlogPreview";
import { getBlogPosts } from "@/lib/providers/sanity/sanity";

export default async function Home() {
    const response = await getBlogPosts();
    const blogPosts = response.res || [];

  return (
    <div>
      <NavBar />
      <Hero/>
      <Services />
      <WhyCrib />
      <Results />
      <Testimonials />
      <BlogPostsPreview blogPosts={blogPosts} />
      <ContactCTA />
    </div>
  );
}