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
          <div className="fixed inset-0 z-40 h-screen w-screen bg-black/70 backdrop-blur-sm"></div>
          <div className="blog-button fixed left-0 right-0 top-1/2 z-50 mx-auto w-full max-w-lg -translate-y-1/2 px-4">
            <BlogSocialShare title={post.title} />
          </div>
        </React.Fragment>
      )}
      
      <header className="mb-12">
        <div className="mb-8 flex items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-md border border-[var(--brand-100)] bg-[var(--brand-50)] text-primary">
              <User className="h-6 w-6" />
            </div>
            <div>
              <a
                href="#"
                rel="author"
                className="text-base font-semibold text-foreground transition-colors hover:text-primary"
              >
                Randal Herndon
              </a>
              <p className="text-sm text-muted-foreground">
                Full stack developer, educator & CEO CRIB, LLC
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowShare(true)}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-foreground shadow-sm transition hover:bg-secondary"
            aria-label="Share article"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>
        
        <h1 className="mb-8 text-4xl font-normal leading-tight text-foreground md:text-5xl">
          {post?.title}
        </h1>
      </header>

      <div className="relative mb-12 overflow-hidden rounded-lg border border-border shadow-sm">
        <Image
          src={image}
          alt={post.title}
          width={1200}
          height={675}
          className="aspect-video w-full object-cover"
          priority
        />
      </div>

      <div className="prose prose-lg prose-slate max-w-none
        prose-headings:font-semibold prose-headings:text-foreground
        prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
        prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
        prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-strong:text-foreground prose-strong:font-semibold
        prose-code:text-primary prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
        prose-pre:bg-[var(--neutral-900)] prose-pre:border prose-pre:border-[var(--neutral-800)]
        prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-[var(--brand-50)] prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-lg
        prose-ul:list-disc prose-ul:ml-6
        prose-ol:list-decimal prose-ol:ml-6
        prose-li:text-muted-foreground prose-li:mb-2
        prose-img:rounded-lg prose-img:shadow-sm">
        <PortableBlogText content={post?.content} />
      </div>

      <footer className="mt-16 border-t border-border pt-8">
        <div className="crib-muted-panel p-6">
          <p className="text-base leading-relaxed text-muted-foreground">
            Thanks for reading! If you have any questions or feedback, please do
            not hesitate to reach out.
          </p>
        </div>
      </footer>
    </article>
  );
}

export default ArticleComponent;
