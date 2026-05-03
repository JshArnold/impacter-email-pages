/**
 * Vercel Edge Middleware
 *
 * On pages.impacterpathway.com:
 *  - /bh/          → proxy bh/7 content (URL stays as /bh/, no redirect)
 *  - /bh/2 … /bh/10, etc. → hard 404 (never reach filesystem)
 *  - /bh/7/*, /bh/images/*, /bh/audio/*, PDFs → pass through normally
 *
 * All other domains are untouched.
 */
export default async function middleware(request) {
  const url = new URL(request.url)
  const { hostname, pathname } = url

  if (hostname !== 'pages.impacterpathway.com') return

  // /bh/ → proxy the bh/7 page so URL stays as /bh/
  if (pathname === '/bh/') {
    const target = new URL('/bh/7/', url.origin)
    const res = await fetch(target.toString(), {
      headers: request.headers,
    })
    // Return same body/headers, strip content-encoding so browser doesn't double-decode
    const body = await res.arrayBuffer()
    const headers = new Headers(res.headers)
    headers.delete('content-encoding')
    return new Response(body, { status: res.status, headers })
  }

  // /bh/* — block anything that isn't an allowed asset path
  if (pathname.startsWith('/bh/')) {
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

export const config = {
  matcher: ['/bh/', '/bh/:path+'],
}
