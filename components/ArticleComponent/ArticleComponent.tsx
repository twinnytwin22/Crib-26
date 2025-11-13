"use client";
import { useHandleOutsideClick } from "@/hooks/handleOutsideClick";
import { imageBuilder } from "@/lib/providers/sanity/sanity";
import Image from "next/image";
import React, { useState } from "react";
import { Share2, User } from "lucide-react";
import BlogSocialShare from "../BlogSocialShare";
import PortableBlogText from "../PortableBlogText";

interface Post {
  title: string;
  coverImage: any;
  content: any;
}

function ArticleComponent({ post }: { post: Post }) {
  const [showShare, setShowShare] = useState(false);
  const image = imageBuilder(post?.coverImage);

  useHandleOutsideClick(showShare, setShowShare, "blog-button");
  return (
    <article className="mx-auto w-full max-w-4xl">
      {showShare && (
        <React.Fragment>
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm w-screen h-screen z-40"></div>
          <div className="fixed w-full max-w-lg right-0 left-0 mx-auto top-1/2 -translate-y-1/2 z-50 px-4 blog-button">
            <BlogSocialShare title={post.title} />
          </div>
        </React.Fragment>
      )}
      
      <header className="mb-12">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/30">
              <User className="h-7 w-7" />
            </div>
            <div>
              <a
                href="#"
                rel="author"
                className="text-lg font-semibold text-slate-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                Randal Herndon
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Full stack developer, educator & CEO CRIB, LLC
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowShare(true)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-105 transition-all duration-200 shadow-md"
            aria-label="Share article"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight mb-8">
          {post?.title}
        </h1>
      </header>

      <div className="relative mb-12 overflow-hidden rounded-2xl shadow-2xl">
        <Image
          src={image}
          alt={post.title}
          width={1200}
          height={675}
          className="aspect-video object-cover w-full"
          priority
        />
      </div>

      <div className="prose prose-lg prose-slate dark:prose-invert max-w-none
        prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
        prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
        prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
        prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-6
        prose-a:text-red-600 dark:prose-a:text-red-400 prose-a:no-underline hover:prose-a:underline
        prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-semibold
        prose-code:text-red-600 dark:prose-code:text-red-400 prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
        prose-pre:bg-slate-900 dark:prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800
        prose-blockquote:border-l-4 prose-blockquote:border-red-500 prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-900 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-lg
        prose-ul:list-disc prose-ul:ml-6
        prose-ol:list-decimal prose-ol:ml-6
        prose-li:text-slate-700 dark:prose-li:text-slate-300 prose-li:mb-2
        prose-img:rounded-xl prose-img:shadow-lg">
        <PortableBlogText content={post?.content} />
      </div>

      <footer className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800">
          <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
            Thanks for reading! If you have any questions or feedback, please do
            not hesitate to reach out.
          </p>
        </div>
      </footer>
    </article>
  );
}

export default ArticleComponent;
