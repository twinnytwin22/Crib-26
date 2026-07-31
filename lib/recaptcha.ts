const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

type RecaptchaResponse = {
  success?: boolean;
};

/** Verify a reCAPTCHA v2 checkbox token without exposing the secret to clients. */
export async function verifyRecaptcha(token: unknown, remoteIp?: string | null) {
  const secret = process.env.RECAPTCHA_SECRET_KEY || process.env.RECAPTCHA_SECREET_KEY;

  if (!secret || typeof token !== "string" || !token.trim()) {
    return false;
  }

  const formData = new URLSearchParams({ secret, response: token.trim() });
  if (remoteIp) formData.set("remoteip", remoteIp);

  try {
    const response = await fetch(RECAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
      cache: "no-store",
    });

    if (!response.ok) return false;
    return Boolean((await response.json() as RecaptchaResponse).success);
  } catch {
    return false;
  }
}
