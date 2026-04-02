import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy() {
  const response = NextResponse.next()

  // // Add performance headers
  // response.headers.set('X-DNS-Prefetch-Control', 'on')
  
  // // Add timing headers
  // const start = Date.now()
  // response.headers.set('X-Response-Time', `${Date.now() - start}ms`)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
   // '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

