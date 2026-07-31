import { MetadataRoute } from 'next'
import { getBlogPosts } from '@/lib/providers/sanity/sanity'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://cribnetwork.io'
  
  // Get all blog posts
  let blogPosts: Array<{ slug: { current: string }, _updatedAt?: string }> = []
  try {
    const { res } = await getBlogPosts()
    blogPosts = res || []
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error)
  }

  // Static pages
  const staticPaths = [
    '',
    '/services',
    '/how-it-works',
    '/contact',
    '/readiness-check',
    '/blog',
    '/support',
    '/privacy-policy',
    '/terms',
  ]

  const staticPages: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
  }))

  // Dynamic blog post pages
  const blogPages: MetadataRoute.Sitemap = blogPosts
    .filter((post) => post.slug?.current)
    .map((post) => ({
      url: `${baseUrl}/post/${post.slug.current}`,
      ...(post._updatedAt
        ? { lastModified: new Date(post._updatedAt) }
        : {}),
    }))

  return [...staticPages, ...blogPages]
}
