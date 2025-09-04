
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
const protectedRoutes = ['/dashboard'];

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('currentUser')?.value
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('favicon.ico')) {
    return NextResponse.next();
  }

  if (pathname === '/login') {
    if (currentUser) {
       return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  if (!currentUser && protectedRoutes.some(path => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  if (pathname === '/') {
      if(currentUser) {
           return NextResponse.redirect(new URL('/dashboard', request.url));
      } else {
           return NextResponse.redirect(new URL('/login', request.url));
      }
  }

  return NextResponse.next()
}
 
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
