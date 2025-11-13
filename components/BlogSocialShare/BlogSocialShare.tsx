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
    <div className="relative flex items-center justify-center w-full">
      <div className="bg-white dark:bg-slate-900 w-full rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        <div className="bg-linear-to-r from-red-500 to-rose-500 px-6 py-4">
          <h3 className="text-xl font-bold text-white">
            Share this article
          </h3>
        </div>

        <div className="p-6">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-4">
            Share this link via
          </p>

          <div className="flex justify-center gap-3 mb-6">
            <div className="group relative">
              <FacebookShareButton url={shareUrl}>
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-[#1877f2] hover:border-[#1877f2] transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-blue-500/50 hover:-translate-y-1">
                  <BsFacebook className="text-[#1877f2] group-hover:text-white transition-colors text-xl" />
                </div>
              </FacebookShareButton>
            </div>

            <div className="group relative">
              <TwitterShareButton
                url={url}
                title={`Check out this article ${!title ? "" : `"${title}" `}at:`}
                hashtags={["CribNetwork"]}
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-[#1d9bf0] hover:border-[#1d9bf0] transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-sky-500/50 hover:-translate-y-1">
                  <BsTwitter className="text-[#1d9bf0] group-hover:text-white transition-colors text-xl" />
                </div>
              </TwitterShareButton>
            </div>

            <div className="group relative">
              <LinkedinShareButton url={shareUrl}>
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-blue-600/50 hover:-translate-y-1">
                  <BsLinkedin className="text-blue-600 group-hover:text-white transition-colors text-xl" />
                </div>
              </LinkedinShareButton>
            </div>

            <div className="group relative">
              <WhatsappShareButton url={shareUrl}>
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-[#25D366] hover:border-[#25D366] transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-green-500/50 hover:-translate-y-1">
                  <BsWhatsapp className="text-[#25D366] group-hover:text-white transition-colors text-xl" />
                </div>
              </WhatsappShareButton>
            </div>

            <div className="group relative">
              <TelegramShareButton url={shareUrl}>
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-[#229ED9] hover:border-[#229ED9] transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-sky-500/50 hover:-translate-y-1">
                  <BsTelegram className="text-[#229ED9] group-hover:text-white transition-colors text-xl" />
                </div>
              </TelegramShareButton>
            </div>
          </div>

          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
            Or copy link
          </p>

          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
            <Link2 className="h-5 w-5 text-slate-500 dark:text-slate-400 shrink-0" />
            <input
              className="flex-1 bg-transparent outline-none text-sm text-slate-700 dark:text-slate-300"
              type="text"
              value={shareUrl}
              readOnly
            />
            <button
              onClickCapture={() => copyToClipboard(shareUrl)}
              className="flex items-center gap-2 bg-linear-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-semibold rounded-lg text-sm py-2 px-4 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-red-500/50"
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
