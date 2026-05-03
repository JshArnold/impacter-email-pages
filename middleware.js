/**
 * Vercel Edge Middleware
 * On pages.impacterpathway.com: return 404 for any /bh/* path that
 * isn't the live page assets (/bh/7/, /bh/images/, /bh/audio/, PDFs).
 * Runs before filesystem — so old /bh/2 … /bh/10 are never served.
 */
export default function middleware(request) {
  const url = new URL(request.url)
  const hostname = url.hostname
  const pathname = url.pathname

  if (hostname === 'pages.impacterpathway.com') {
    // Only intercept paths that go deeper than /bh/ itself
    if (pathname.startsWith('/bh/') && pathname !== '/bh/') {
      const allowed =
        pathname.startsWith('/bh/7/') ||
        pathname.startsWith('/bh/images/') ||
        pathname.startsWith('/bh/audio/') ||
        pathname === '/bh/cybhi-fee-schedule.pdf' ||
        pathname === '/bh/playbook.pdf'

      if (!allowed) {
        return new Response('Not Found', {
          status: 404,
          headers: { 'content-type': 'text/plain' },
        })
      }
    }
  }
}

export const config = {
  matcher: '/bh/:path+',
}
