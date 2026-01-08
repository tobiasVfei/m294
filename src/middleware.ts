
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('session_token')?.value;

    const publicPaths = ['/login', '/register', '/', '/favicon.ico', '/next.svg', '/vercel.svg'];

    const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}


export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image).*)',
    ],
};
