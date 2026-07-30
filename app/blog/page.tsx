import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import CtaSection from "@/components/home/CtaSection";
import { getBlogPosts, imageBuilder } from "@/lib/providers/sanity/sanity";
import { SHARE_IMAGE, SHARE_IMAGE_URL } from "@/lib/share-image";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "CRIB Blog - Systems, websites, and growth clarity",
  description:
    "Read CRIB Network insights on websites, customer systems, automation, and practical growth operations.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "CRIB Blog - Systems, websites, and growth clarity",
    description:
      "Read CRIB Network insights on websites, customer systems, automation, and practical growth operations.",
    url: "/blog",
    siteName: "CRIB Network",
    type: "website",
    images: [SHARE_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "CRIB Blog - Systems, websites, and growth clarity",
    description:
      "Read CRIB Network insights on websites, customer systems, automation, and practical growth operations.",
    images: [SHARE_IMAGE_URL],
  },
};

type PortableChild = {
  text?: string;
};

type PortableBlock = {
  _type?: string;
  children?: PortableChild[];
};

type BlogPost = {
  _id?: string;
  _createdAt?: string;
  publishedAt?: string;
  title?: string;
  excerpt?: string;
  description?: string;
  content?: PortableBlock[];
  author?: string;
  slug?: {
    current?: string;
  };
  coverImage?: {
    asset?: {
      _ref?: string;
    };
  };
};

function getPostDate(post: BlogPost) {
  const date = post.publishedAt || post._createdAt;

  if (!date) {
    return "Insight";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function getImageUrl(post: BlogPost) {
  if (!post.coverImage?.asset?._ref) {
    return null;
  }

  return imageBuilder(post.coverImage);
}

function getExcerpt(post: BlogPost) {
  if (post.excerpt || post.description) {
    return post.excerpt || post.description;
  }

  const firstBlock = post.content?.find((block) => block._type === "block");
  const text = firstBlock?.children?.map((child) => child.text || "").join("");

  if (!text) {
    return "Practical notes from CRIB on building clearer systems for modern teams.";
  }

  return text.length > 155 ? `${text.slice(0, 155).trim()}...` : text;
}

function PostCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  const imageUrl = getImageUrl(post);
  const href = `/post/${post.slug?.current}`;

  return (
    <article
      className={
        featured
          ? "grid overflow-hidden rounded-lg border border-border bg-card shadow-sm lg:grid-cols-[1.15fr_0.85fr]"
          : "group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      }
    >
      <Link href={href} className={featured ? "relative block min-h-[320px]" : "relative block aspect-4/3"}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.title || "CRIB blog post"}
            fill
            sizes={featured ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
            className="object-cover transition duration-500 group-hover:scale-105"
            priority={featured}
          />
        ) : (
          <div className="absolute inset-0 bg-(--neutral-900) crib-grid-bg" />
        )}
      </Link>

      <div className={featured ? "flex flex-col justify-center p-6 sm:p-8 lg:p-10" : "flex flex-1 flex-col p-5"}>
        <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-primary" />
            {getPostDate(post)}
          </span>
          {post.author && <span>By {post.author}</span>}
        </div>
        <h2 className={featured ? "text-3xl font-normal leading-tight text-foreground md:text-4xl" : "text-xl font-normal leading-tight text-foreground"}>
          <Link href={href} className="transition hover:text-primary">
            {post.title}
          </Link>
        </h2>
        <p className={featured ? "mt-5 text-base leading-relaxed text-muted-foreground md:text-lg" : "mt-3 flex-1 text-sm leading-relaxed text-muted-foreground"}>
          {getExcerpt(post)}
        </p>
        <Link href={href} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-(--brand-hover)">
          Read article
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

export default async function BlogPage() {
  const { res } = await getBlogPosts();
  const posts = (res || [])
    .filter((post: BlogPost) => post.slug?.current && post.title)
    .sort((a: BlogPost, b: BlogPost) => {
      const aDate = new Date(a.publishedAt || a._createdAt || 0).getTime();
      const bDate = new Date(b.publishedAt || b._createdAt || 0).getTime();
      return bDate - aDate;
    });
  const [featuredPost, ...remainingPosts] = posts;

  return (
      <main className="min-h-screen bg-background pt-14 antialiased">
        <section className="border-b border-border bg-(--surface)">
          <div className="crib-container grid gap-10 py-20 lg:grid-cols-[0.82fr_1fr] lg:items-end lg:py-24">
            <div>
              <div className="crib-eyebrow mb-5">CRIB Blog</div>
              <h1 className="max-w-[11em] text-[clamp(40px,5vw,68px)] font-normal leading-[1.02] text-foreground text-balance">
                Notes for clearer systems and steadier growth.
              </h1>
            </div>
            <p className="max-w-[38em] text-base leading-relaxed text-muted-foreground md:text-lg lg:justify-self-end">
              Practical thinking from CRIB on websites, customer data, automation, and the decisions that make a business easier to understand.
            </p>
          </div>
        </section>

        {featuredPost ? (
          <section className="crib-section">
            <div className="crib-container">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div className="crib-eyebrow">Featured Insight</div>
                <span className="hidden text-sm text-muted-foreground sm:inline">
                  {posts.length} {posts.length === 1 ? "article" : "articles"}
                </span>
              </div>
              <PostCard post={featuredPost} featured />
            </div>
          </section>
        ) : (
          <section className="crib-section">
            <div className="crib-container">
              <div className="crib-muted-panel mx-auto max-w-2xl p-8 text-center">
                <h2 className="text-2xl font-normal text-foreground">No posts yet</h2>
                <p className="mt-3 text-muted-foreground">
                  The blog is connected, but there are no published posts available right now.
                </p>
              </div>
            </div>
          </section>
        )}

        {remainingPosts.length > 0 && (
          <section className="border-t border-border bg-(--surface) py-16 lg:py-20">
            <div className="crib-container">
              <div className="mb-10 max-w-3xl">
                <div className="crib-eyebrow mb-4">All Articles</div>
                <h2 className="text-3xl font-normal leading-tight text-foreground md:text-4xl">
                  More from the CRIB team
                </h2>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {remainingPosts.map((post: BlogPost) => (
                  <PostCard key={post._id || post.slug?.current} post={post} />
                ))}
              </div>
            </div>
          </section>
        )}

        <CtaSection />
      </main>
  );
}
