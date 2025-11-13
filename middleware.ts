import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Just pass through, headers are handled in next.config.ts
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Only match non-static assets
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
