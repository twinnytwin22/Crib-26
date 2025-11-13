export default function unsplashLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  // If it's an Unsplash image, add the optimization parameters
  if (src.includes('images.unsplash.com')) {
    const url = new URL(src)
    url.searchParams.set('w', width.toString())
    url.searchParams.set('q', (quality || 75).toString())
    url.searchParams.set('auto', 'format')
    url.searchParams.set('fit', 'crop')
    return url.toString()
  }
  
  // For other images, return as-is
  return src
}
