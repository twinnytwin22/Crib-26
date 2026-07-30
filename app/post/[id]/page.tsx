import ArticleComponent from "@/components/ArticleComponent";
import JsonLd from "@/components/JsonLd";
import { getBlogPosts, imageBuilder } from "@/lib/providers/sanity/sanity";
import { articleStructuredData } from "@/lib/structured-data";
import { SHARE_IMAGE, SHARE_IMAGE_URL } from "@/lib/share-image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export const revalidate = 0;

export async function generateMetadata(
  { params }: Props,
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
        images: image
          ? [
              {
                url: image,
                width: 1200,
                height: 630,
                alt: relatedPost?.title,
              },
            ]
          : [SHARE_IMAGE],
        type: 'article',
        publishedTime: relatedPost?.publishedAt,
        modifiedTime: relatedPost?._updatedAt,
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: relatedPost?.title,
        description: description,
        images: [image || SHARE_IMAGE_URL],
        creator: '@cribnetwork',
      },
    };
  }

  // Handle the case where 'id' is not found in 'slugs'
  return {
    title: "Not Found",
    robots: { index: false, follow: false },
  };
}

export async function generateStaticParams() {
  const { slugs } = await getBlogPosts();
  return slugs.map((slug: string) => ({
    id: slug,
    // results: res
  }));
}

async function Page({ params }: Props) {
  const { success, slugs, res } = await getBlogPosts();
  const { id: slug } = await params;

  if (success) {
    if (slugs.includes(slug)) {
      const relatedPost = res?.find(
        (post: { slug: { current: string } }) => post.slug.current === slug,
      );

      if (!relatedPost) {
        notFound();
      }

      const image = imageBuilder(relatedPost.coverImage) || undefined;
      const description =
        relatedPost.excerpt ||
        relatedPost.description ||
        `Read ${relatedPost.title} on our blog`;

      return (
        <>
          <JsonLd
            data={articleStructuredData({
              title: relatedPost.title,
              description,
              slug,
              image,
              publishedAt: relatedPost.publishedAt || relatedPost._createdAt,
              updatedAt: relatedPost._updatedAt,
            })}
          />
          <main className="relative min-h-screen bg-background pt-16 antialiased">
            <div className="crib-container py-16 lg:py-24">
              <ArticleComponent post={relatedPost} />
            </div>
          </main>
        </>
      );
    }
  }

  notFound();
}

export default Page;
