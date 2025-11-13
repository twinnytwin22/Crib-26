"use client";

import { toast } from "sonner";

export const copyToClipboard = async (string: string) => {
  try {
    await navigator.clipboard.writeText(string);
    toast(`"${string}" copied to clipboard.`);
  } catch (error) {
    console.error("Error copying text to clipboard:", error);
  }
};
