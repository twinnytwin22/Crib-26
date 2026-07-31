"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { trackMarketingEvent } from "@/lib/analytics";
import RecaptchaCheckbox, { type RecaptchaCheckboxHandle } from "@/components/recaptcha/RecaptchaCheckbox";

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const recaptchaRef = useRef<RecaptchaCheckboxHandle>(null);

  const handleStart = () => {
    if (hasStarted) return;
    setHasStarted(true);
    trackMarketingEvent({ event: "form_start", form_id: "intro_call" });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const recaptchaToken = await recaptchaRef.current?.execute();
    if (!recaptchaToken) {
      toast.error("Spam protection is still loading. Please try again in a moment.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, recaptchaToken }),
      });
      const data = await response.json();

      if (response.ok) {
        trackMarketingEvent({
          event: "generate_lead",
          lead_source_surface: "contact_form",
          form_id: "intro_call",
        });
        setSent(true);
        toast.success("Message sent! We'll be in touch within one business day.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        trackMarketingEvent({
          event: "form_error",
          form_id: "intro_call",
          error_type: "server_error",
        });
        toast.error("Failed to send message", { description: data.error || "Please try again later." });
      }
    } catch {
      trackMarketingEvent({
        event: "form_error",
        form_id: "intro_call",
        error_type: "network_error",
      });
      toast.error("Failed to send message", { description: "Please try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      onFocus={handleStart}
      className="crib-card flex flex-col gap-3.5 border-t-4 border-t-primary p-7 lg:p-9"
    >
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        placeholder="Your name"
        aria-label="Your name"
        className="crib-input"
      />
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
        placeholder="Work email"
        aria-label="Work email"
        className="crib-input"
      />
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        rows={3}
        placeholder="What's going on with your systems? (optional)"
        aria-label="How can we help?"
        className="crib-input resize-y"
      />
      <RecaptchaCheckbox ref={recaptchaRef} />
      <button type="submit" disabled={isSubmitting} className="crib-button-primary min-h-[46px] w-full text-[14px]">
        {isSubmitting ? "Sending..." : sent ? "Thanks — we'll be in touch" : "Request the call"}
      </button>
      <p className="text-center font-mono text-[9px] uppercase tracking-[0.07em] text-(--text-3)">Protected by reCAPTCHA · We reply within one business day.</p>
    </form>
  );
}
