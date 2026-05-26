import ArticleComponent from "@/components/ArticleComponent";
import NavBar from "@/components/nav/NavBar";
import { getBlogPosts, imageBuilder } from "@/lib/providers/sanity/sanity";
import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const revalidate = 0;

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // Read route params
  const { id } = await params;

  // Fetch data
  const { res, slugs } = await getBlogPosts();

  if (slugs.includes(id)) {
    const relatedPost = res?.find(
      (post: { slug: { current: string } }) => post.slug.current === id,
    );

    const image = imageBuilder(relatedPost?.coverImage);
    const description = relatedPost?.excerpt || relatedPost?.description || `Read ${relatedPost?.title} on our blog`;
    const url = `/post/${id}`;

    return {
      title: relatedPost?.title,
      description: description,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title: relatedPost?.title,
        description: description,
        url: url,
        siteName: 'CRIB Network',
        images: [
          {
            url: image!,
            width: 1200,
            height: 630,
            alt: relatedPost?.title,
          }
        ],
        type: 'article',
        publishedTime: relatedPost?.publishedAt,
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: relatedPost?.title,
        description: description,
        images: [image!],
        creator: '@cribnetwork',
      },
    };
  }

  // Handle the case where 'id' is not found in 'slugs'
  return {
    title: "Not Found", // You can customize this error title
    openGraph: {
      //  images: ['/default-error-image.jpg'], // You can customize this error image
    },
  };
}

export async function generateStaticParams() {
  const { slugs } = await getBlogPosts();
  return slugs.map((slug: string) => ({
    id: slug,
    // results: res
  }));
}

async function Page({ params, searchParams }: Props) {
  const { success, slugs, res } = await getBlogPosts();

  if (success) {
    const { id: slug } = await params;
    if (slugs.includes(slug)) {
      const relatedPost = res?.find(
        (post: { slug: { current: string } }) => post.slug.current === slug,
      );
      return (
        <>      
        <NavBar />
        
          <main className="relative min-h-screen bg-background pt-16 antialiased">
            <div className="crib-container py-16 lg:py-24">
              <ArticleComponent post={relatedPost} />
            </div>
          </main>
        </>
      );
    }
  }

  return (
    <section className="h-screen bg-background">
      <div className="crib-container flex h-full items-center py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mb-6 text-7xl font-semibold text-primary lg:text-9xl">
            404
          </h1>
          <p className="mb-4 text-3xl font-semibold text-foreground md:text-4xl">
            Something&apos;s missing.
          </p>
          <p className="mb-8 text-xl text-muted-foreground">
            Sorry, we can&apos;t find that page. You&apos;ll find lots to
            explore on the home page.
          </p>
          <Link
            href="/"
            className="crib-button-primary"
          >
            Back to Homepage
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Page;
