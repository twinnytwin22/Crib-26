"use client";

import { convertDatetime } from "@/hooks/convertDatetime";
import { imageBuilder } from "@/lib/providers/sanity/sanity";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import PortableText from "../PortableText";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BlogPost = ({ _createdAt, title, content, author, slug, coverImage, index }: { _createdAt: string; title: string; content: any; author: string; slug: { current: string }; coverImage: any; index: number }) => {
  const image = imageBuilder(coverImage);
  const excerptPg = content.slice(0, 1);
  const excerpt = excerptPg;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group relative overflow-hidden rounded-lg border border-border bg-card shadow-sm"
    >
      <Link href={`/post/${slug?.current}`} className="block">
        <div className="relative aspect-4/3 overflow-hidden">
          {coverImage && (
            <Image
              src={image}
              alt={title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          )}
        </div>
        <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/90 via-black/70 to-transparent p-5 text-white">
          <span className="text-xs font-semibold uppercase text-[var(--brand-200)]">
            {convertDatetime(_createdAt).timePast}
          </span>
          <h3 className="mt-2 text-xl font-semibold">{title}</h3>
          <div className="mt-2 text-sm text-white/80 line-clamp-2">
            <PortableText content={excerpt} shorten={true} maxLength={120} />
          </div>
          {author && (
            <span className="mt-3 text-xs text-white/60">By {author}</span>
          )}
        </div>
      </Link>
    </motion.article>
  );
};
const BlogPostsPreview = ({ blogPosts }: { blogPosts: any[] }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  return (
    <section className="crib-section border-t border-border bg-[var(--surface)]">
      <div className="crib-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <div className="crib-eyebrow mb-4">Insights & Updates</div>
          <h2 className="text-3xl font-semibold leading-tight text-foreground md:text-5xl">
            Latest from the blog
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            We use an agile approach to test assumptions and connect with the
            needs of your audience early and often.
          </p>
        </motion.div>

        <div className="relative mt-12">
            <div className="relative">
            <motion.div 
              ref={scrollContainerRef}
              className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {blogPosts.map((post, index) => (
              <div key={index} className="min-w-full snap-center md:min-w-[calc(33.333%-1rem)]">
                <BlogPost {...post} index={index} />
              </div>
              ))}
            </motion.div>
            <div className="mx-auto flex items-center justify-center gap-3">
            <button
              onClick={() => scrollContainerRef.current?.scrollBy({ left: -400, behavior: 'smooth' })}
              className="relative z-10 flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-foreground shadow-sm transition hover:bg-secondary"
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => scrollContainerRef.current?.scrollBy({ left: 400, behavior: 'smooth' })}
              className="relative z-10 flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-foreground shadow-sm transition hover:bg-secondary"
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            </div>
            </div>
        </div>
      </div>
    </section>
  );
};
export default BlogPostsPreview;
