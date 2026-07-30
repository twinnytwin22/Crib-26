import type { Metadata } from "next";
import Link from "next/link";
import { SHARE_IMAGE } from "@/lib/share-image";

export const metadata: Metadata = {
  title: "Support | CRIB Network",
  description:
    "Get support for CRIB Network and the CRIB Support Google Chat app.",
  openGraph: {
    title: "Support | CRIB Network",
    description:
      "Get support for CRIB Network and the CRIB Support Google Chat app.",
    url: "https://cribnetwork.io/support",
    siteName: "CRIB Network",
    locale: "en_US",
    type: "website",
    images: [SHARE_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://cribnetwork.io/support",
  },
};

const supportItems = [
  {
    title: "App access",
    body: "If the CRIB Support app does not appear in Google Chat, confirm that your Workspace admin has allowed internal Chat apps and that the app is available to your account or group.",
  },
  {
    title: "Chat delivery",
    body: "If website messages are not appearing in Google Chat, verify that the configured Chat space is correct and that the CRIB Support app has been added to that space.",
  },
  {
    title: "Thread replies",
    body: "Replies should be sent inside the matching Google Chat thread. The site checks the thread and syncs team replies back to the visitor conversation.",
  },
  {
    title: "Privacy and access",
    body: "Visitor conversations are stored in CRIB Network's Supabase project and are scoped to the visitor's browser session. The Google Chat app is intended for internal support teams only.",
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="border-b border-border bg-[var(--neutral-900)] pt-28 pb-16 text-white">
        <div className="crib-container max-w-4xl">
          <div className="mb-6 inline-flex rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white/72">
            Support
          </div>
          <h1 className="mb-6 text-4xl font-normal leading-tight text-white md:text-6xl">
            CRIB Support
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-white/72 md:text-lg">
            Help for CRIB Network services and the internal Google Chat app used
            to manage website support conversations.
          </p>
        </div>
      </section>

      <section className="crib-section-tight">
        <div className="crib-container max-w-5xl">
          <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
            <article className="crib-card p-6 md:p-10">
              <h2 className="text-2xl font-normal text-foreground">
                Contact Support
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                For help with CRIB Network, the website chat widget, or the CRIB
                Support Google Chat app, contact our team by email. Include the
                affected Google Chat space, the email used in the website chat,
                and a short description of the issue.
              </p>
              <div className="mt-6 space-y-3 text-sm">
                <p>
                  <span className="font-medium text-foreground">Email:</span>{" "}
                  <a
                    className="text-primary hover:underline"
                    href="mailto:support@cribnetwork.io"
                  >
                    support@cribnetwork.io
                  </a>
                </p>
                <p>
                  <span className="font-medium text-foreground">
                    Response target:
                  </span>{" "}
                  Within two business days
                </p>
                <p>
                  <span className="font-medium text-foreground">Website:</span>{" "}
                  <Link className="text-primary hover:underline" href="/">
                    cribnetwork.io
                  </Link>
                </p>
              </div>
            </article>

            <aside className="crib-card p-6 md:p-8">
              <h2 className="text-xl font-normal text-foreground">
                Useful Links
              </h2>
              <div className="mt-5 space-y-3 text-sm">
                <a className="block text-primary hover:underline" href="/privacy-policy">
                  Privacy Policy
                </a>
                <a className="block text-primary hover:underline" href="/terms">
                  Terms & Conditions
                </a>
                <a className="block text-primary hover:underline" href="mailto:support@cribnetwork.io">
                  Email Support
                </a>
              </div>
            </aside>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {supportItems.map((item) => (
              <div key={item.title} className="crib-card p-6">
                <h3 className="text-lg font-normal text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
