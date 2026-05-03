/**
 * Vercel Edge Middleware
 * On pages.impacterpathway.com: hard-404 any /bh/* path that isn't
 * the live page assets (/bh/7/, /bh/images/, /bh/audio/, PDFs).
 * /bh/ itself is handled by the vercel.json redirect → /bh/7/.
 */
export default function middleware(request) {
  const url = new URL(request.url)
  const { hostname, pathname } = url

  if (hostname !== 'pages.impacterpathway.com') return

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

export const config = {
  matcher: '/bh/:path+',
}
