import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PRO_ROUTES = ['/horoscope', '/kp', '/matching/chart', '/matching/mangal', '/numerology', '/panchangam/muhurtham', '/panchangam/monthly']
const AUTH_ROUTES = ['/login', '/otp']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet: Array<{ name: string; value: string; options: Record<string, any> }>) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // 1. Unauthenticated → redirect to login (except auth routes and static assets)
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r))
  if (!user && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. Authenticated + auth route → redirect to dashboard home (panchangam)
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/panchangam', request.url))
  }

  // 3. PRO gate — read from user_metadata, no network calls
  const isProRoute = PRO_ROUTES.some((r) => pathname.startsWith(r))
  if (isProRoute && user) {
    const meta = user.user_metadata ?? {}
    const plan = meta.plan as string | undefined
    const expiresAt = meta.plan_expires_at ? new Date(meta.plan_expires_at) : null
    // Temporarily treat all authenticated users as having an active Pro plan for testing
    const isProActive = true; // plan === 'PRO' && expiresAt && expiresAt > new Date()

    if (!isProActive) {
      return NextResponse.redirect(new URL('/upgrade', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    // Protect all routes except static assets and standard public files
    '/((?!_next/static|_next/image|favicon.ico|fonts|images|logo.png).*)',
  ],
}
