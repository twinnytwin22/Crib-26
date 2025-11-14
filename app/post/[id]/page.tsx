import ArticleComponent from "@/components/ArticleComponent";
import { getBlogPosts, imageBuilder } from "@/lib/providers/sanity/sanity";
import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";

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

    // Optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || [];
    const image = imageBuilder(relatedPost?.coverImage);

    return {
      title: relatedPost?.title,
      openGraph: {
        images: [image!], //, ...previousImages],
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
          <main className="min-h-screen bg-linear-to-b from-white to-[#F4F5F7] dark:from-slate-950 dark:to-slate-900 antialiased">
            <div className="px-6 py-16 mx-auto max-w-7xl lg:py-24 text-slate-100">
              <ArticleComponent post={relatedPost} />
            </div>
          </main>
        </>
      );
    }
  }

  return (
    <section className="bg-linear-to-b from-white to-[#F4F5F7] dark:from-slate-950 dark:to-slate-900 h-screen">
      <div className="py-8 px-6 mx-auto max-w-7xl lg:py-16 flex items-center h-full">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mb-6 text-7xl tracking-tight font-bold lg:text-9xl bg-linear-to-br from-red-500 to-rose-500 bg-clip-text text-transparent">
            404
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-slate-900 md:text-4xl dark:text-white">
            Something&apos;s missing.
          </p>
          <p className="mb-8 text-xl text-slate-600 dark:text-slate-400">
            Sorry, we can&apos;t find that page. You&apos;ll find lots to
            explore on the home page.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white bg-linear-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-semibold rounded-lg text-base px-8 py-4 text-center transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-red-500/50"
          >
            Back to Homepage
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Page;
