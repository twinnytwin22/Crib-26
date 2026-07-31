"use client";

import Script from "next/script";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

declare global {
  interface Window {
    grecaptcha?: {
      render: (container: HTMLElement, parameters: Record<string, unknown>) => number;
      reset: (widgetId?: number) => void;
    };
  }
}

export type RecaptchaCheckboxHandle = {
  reset: () => void;
};

type RecaptchaCheckboxProps = {
  onChange: (token: string | null) => void;
};

const RecaptchaCheckbox = forwardRef<RecaptchaCheckboxHandle, RecaptchaCheckboxProps>(function RecaptchaCheckbox({ onChange }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | undefined>(undefined);
  const [scriptReady, setScriptReady] = useState(false);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (widgetIdRef.current !== undefined) window.grecaptcha?.reset(widgetIdRef.current);
      onChange(null);
    },
  }), [onChange]);

  useEffect(() => {
    if (!scriptReady || !siteKey || !containerRef.current || !window.grecaptcha || widgetIdRef.current !== undefined) return;

    widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
      sitekey: siteKey,
      callback: (token: string) => onChange(token),
      "expired-callback": () => onChange(null),
      "error-callback": () => onChange(null),
    });
  }, [onChange, scriptReady, siteKey]);

  if (!siteKey) {
    return <p className="text-center text-sm text-red-700">reCAPTCHA is unavailable. Please try again later.</p>;
  }

  return <>
    <Script src="https://www.google.com/recaptcha/api.js?render=explicit" strategy="afterInteractive" onLoad={() => setScriptReady(true)} />
    <div ref={containerRef} className="flex justify-center" />
  </>;
});

export default RecaptchaCheckbox;
