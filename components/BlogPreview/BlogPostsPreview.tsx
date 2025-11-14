"use client";

import { convertDatetime } from "@/hooks/convertDatetime";
import { imageBuilder } from "@/lib/providers/sanity/sanity";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import PortableText from "../PortableText";
import { useRef } from "react";

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
      className="group relative overflow-hidden rounded-2xl shadow-xl"
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
        <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-slate-950 via-slate-950/70 to-transparent p-6 text-white">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-red-200">
            {convertDatetime(_createdAt).timePast}
          </span>
          <h3 className="mt-2 text-2xl font-semibold">{title}</h3>
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
    <section className="bg-linear-to-b from-white to-[#F4F5F7] py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mb-4 text-sm font-semibold uppercase tracking-widest text-red-600">
            Insights & Updates
          </div>
          <h2 className="mb-6 text-4xl font-bold text-slate-900 md:text-5xl lg:text-6xl">
            Latest from the blog
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-slate-600">
            We use an agile approach to test assumptions and connect with the
            needs of your audience early and often.
          </p>
        </motion.div>

        <div className="mt-16 relative">
            <div className="relative">
            <motion.div 
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {blogPosts.map((post, index) => (
              <div key={index} className="min-w-full md:min-w-[calc(33.333%-1rem)] snap-center">
                <BlogPost {...post} index={index} />
              </div>
              ))}
            </motion.div>
            <div className="flex items-center mx-auto justify-center space-x-8">
            <button
              onClick={() => scrollContainerRef.current?.scrollBy({ left: -400, behavior: 'smooth' })}
              className="relative  bg-white/90 hover:bg-white p-3 rounded-full shadow-lg z-10"
              aria-label="Previous"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={() => scrollContainerRef.current?.scrollBy({ left: 400, behavior: 'smooth' })}
              className="relative  bg-white/90 hover:bg-white p-3 rounded-full shadow-lg z-10"
              aria-label="Next"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            </div>
            </div>
        </div>
      </div>
    </section>
  );
};
export default BlogPostsPreview;
