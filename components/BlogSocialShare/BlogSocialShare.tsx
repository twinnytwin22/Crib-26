"use client";
import { copyToClipboard } from "@/hooks/copyToClipboard";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "next-share";
import { usePathname } from "next/navigation";
import {
  BsFacebook,
  BsLinkedin,
  BsTelegram,
  BsTwitter,
  BsWhatsapp,
} from "react-icons/bs";
import { Link2, Copy } from "lucide-react";

function BlogSocialShare({ title }: { title?: string }) {
  const path = usePathname();
  const shareUrl = "https://cribnetwork.io" + path;

  const url = shareUrl;
  return (
    <div className="relative flex w-full items-center justify-center">
      <div className="w-full overflow-hidden rounded-lg border border-border bg-card shadow-lg">
        <div className="border-b border-border bg-[var(--neutral-900)] px-6 py-4">
          <h3 className="text-lg font-normal text-white">
            Share this article
          </h3>
        </div>

        <div className="p-6">
          <p className="mb-4 text-sm font-medium text-muted-foreground">
            Share this link via
          </p>

          <div className="mb-6 flex justify-center gap-3">
            <div className="group relative">
              <FacebookShareButton url={shareUrl}>
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-secondary transition-colors hover:border-[#1877f2] hover:bg-[#1877f2]">
                  <BsFacebook className="text-lg text-[#1877f2] transition-colors group-hover:text-white" />
                </div>
              </FacebookShareButton>
            </div>

            <div className="group relative">
              <TwitterShareButton
                url={url}
                title={`Check out this article ${!title ? "" : `"${title}" `}at:`}
                hashtags={["CribNetwork"]}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-secondary transition-colors hover:border-[#1d9bf0] hover:bg-[#1d9bf0]">
                  <BsTwitter className="text-lg text-[#1d9bf0] transition-colors group-hover:text-white" />
                </div>
              </TwitterShareButton>
            </div>

            <div className="group relative">
              <LinkedinShareButton url={shareUrl}>
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-secondary transition-colors hover:border-blue-600 hover:bg-blue-600">
                  <BsLinkedin className="text-lg text-blue-600 transition-colors group-hover:text-white" />
                </div>
              </LinkedinShareButton>
            </div>

            <div className="group relative">
              <WhatsappShareButton url={shareUrl}>
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-secondary transition-colors hover:border-[#25D366] hover:bg-[#25D366]">
                  <BsWhatsapp className="text-lg text-[#25D366] transition-colors group-hover:text-white" />
                </div>
              </WhatsappShareButton>
            </div>

            <div className="group relative">
              <TelegramShareButton url={shareUrl}>
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-secondary transition-colors hover:border-[#229ED9] hover:bg-[#229ED9]">
                  <BsTelegram className="text-lg text-[#229ED9] transition-colors group-hover:text-white" />
                </div>
              </TelegramShareButton>
            </div>
          </div>

          <p className="mb-3 text-sm font-medium text-muted-foreground">
            Or copy link
          </p>

          <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary p-3">
            <Link2 className="h-5 w-5 shrink-0 text-muted-foreground" />
            <input
              className="flex-1 bg-transparent text-sm text-foreground outline-none"
              type="text"
              value={shareUrl}
              readOnly
            />
            <button
              onClickCapture={() => copyToClipboard(shareUrl)}
              className="crib-button-primary"
              onClick={() => {}}
            >
              <Copy className="h-4 w-4" />
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogSocialShare;
