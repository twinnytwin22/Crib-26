const projectId = "tvuqvrbxusmicpmjqpus"; // your supabase project id
import { ImageLoaderProps } from "next/image";
export default function supabaseLoader({
  src,
  width,
  quality,
}: ImageLoaderProps) {
  return `https://${projectId}.supabase.co/storage/v1/render/image/public${src}?quality=${
    quality || 75
  }`;
}
