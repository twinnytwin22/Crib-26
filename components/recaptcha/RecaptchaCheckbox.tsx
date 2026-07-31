"use client";

import Script from "next/script";
import { forwardRef, useImperativeHandle, useState } from "react";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export type RecaptchaCheckboxHandle = {
  execute: () => Promise<string | null>;
};

const RecaptchaCheckbox = forwardRef<RecaptchaCheckboxHandle>(function RecaptchaCheckbox(_, ref) {
  const [scriptReady, setScriptReady] = useState(false);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  useImperativeHandle(ref, () => ({
    execute: async () => {
      if (!scriptReady || !siteKey || !window.grecaptcha) return null;

      return new Promise((resolve) => {
        window.grecaptcha?.ready(() => {
          window.grecaptcha?.execute(siteKey, { action: "contact_form" }).then(resolve).catch(() => resolve(null));
        });
      });
    },
  }), [scriptReady, siteKey]);

  if (!siteKey) {
    return <p className="text-center text-sm text-red-700">Spam protection is unavailable. Please try again later.</p>;
  }

  return <>
    <Script src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`} strategy="afterInteractive" onLoad={() => setScriptReady(true)} />
  </>;
});

export default RecaptchaCheckbox;
