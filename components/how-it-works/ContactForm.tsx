"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        setSent(true);
        toast.success("Message sent! We'll be in touch within one business day.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error("Failed to send message", { description: data.error || "Please try again later." });
      }
    } catch {
      toast.error("Failed to send message", { description: "Please try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="crib-card flex flex-col gap-3.5 p-7 shadow-[0_20px_42px_-24px_rgba(15,17,21,0.32)]"
    >
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        placeholder="Your name"
        className="crib-input"
      />
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
        placeholder="Work email"
        className="crib-input"
      />
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        rows={3}
        placeholder="What's going on with your systems? (optional)"
        className="crib-input resize-y"
      />
      <button type="submit" disabled={isSubmitting} className="crib-button-primary min-h-[46px] w-full text-[14px]">
        {isSubmitting ? "Sending..." : sent ? "Thanks — we'll be in touch" : "Request the call"}
      </button>
      <p className="text-center text-xs text-[var(--text-3)]">We reply within one business day.</p>
    </form>
  );
}
