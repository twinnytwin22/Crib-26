import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PostNotFound() {
  return (
    <section className="h-screen bg-background">
      <div className="crib-container flex h-full items-center py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mb-6 text-7xl font-normal text-primary lg:text-9xl">
            404
          </h1>
          <p className="mb-4 text-3xl font-semibold text-foreground md:text-4xl">
            Something&apos;s missing.
          </p>
          <p className="mb-8 text-xl text-muted-foreground">
            Sorry, we can&apos;t find that page. You&apos;ll find lots to
            explore on the home page.
          </p>
          <Link href="/" className="crib-button-primary">
            Back to Homepage
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
