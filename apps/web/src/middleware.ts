import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PRO_ROUTES = [
  '/horoscope',
  '/kp',
  '/matching',
  '/numerology',
  '/panchangam/muhurtham',
  '/panchangam/monthly',
  '/special',
  '/vastu',
  '/prasnam',
  '/baby-names'
]
const AUTH_ROUTES = ['/login', '/otp']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  // Helper to prevent browser caching redirects
  const redirect = (targetPath: string) => {
    const res = NextResponse.redirect(new URL(targetPath, request.url))
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
    return res
  }

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

  // 1b. Authenticated + root consumer routes → redirect to appropriate dashboards
  if (user && (pathname === '/' || pathname === '/upgrade')) {
    const meta = user.user_metadata ?? {}
    const adminEmailsEnv = process.env.ADMIN_EMAILS || ''
    const adminEmails = adminEmailsEnv
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
    const isBootstrapAdmin = user.email && adminEmails.includes(user.email.toLowerCase())
    const isAdmin = meta.role === 'admin' || meta.is_admin === true || isBootstrapAdmin
    const isRetailer = meta.role === 'retailer'

    if (isAdmin) {
      return redirect('/admin')
    }
    if (isRetailer) {
      return redirect('/retailer')
    }
  }

  // 1. Unauthenticated → redirect to login (except auth routes, upgrade, and static assets)
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r))
  const isUpgradeRoute = pathname.startsWith('/upgrade')
  if (!user && !isAuthRoute && !isUpgradeRoute) {
    return redirect('/login')
  }

  // 2. Authenticated + auth route → redirect to dashboard home (panchangam)
  if (user && isAuthRoute) {
    const meta = user.user_metadata ?? {}
    const adminEmailsEnv = process.env.ADMIN_EMAILS || ''
    const adminEmails = adminEmailsEnv
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
    const isBootstrapAdmin = user.email && adminEmails.includes(user.email.toLowerCase())
    const isAdmin = meta.role === 'admin' || meta.is_admin === true || isBootstrapAdmin
    const isRetailer = meta.role === 'retailer'

    if (isAdmin) {
      return redirect('/admin')
    }
    if (isRetailer) {
      return redirect('/retailer')
    }
    return redirect('/')
  }

  // 3. Admin space security: Only admins can access /admin
  if (pathname.startsWith('/admin')) {
    if (!user) {
      return redirect('/login')
    }
    const meta = user.user_metadata ?? {}
    const adminEmailsEnv = process.env.ADMIN_EMAILS || ''
    const adminEmails = adminEmailsEnv
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
    const isBootstrapAdmin = user.email && adminEmails.includes(user.email.toLowerCase())
    const isAdmin = meta.role === 'admin' || meta.is_admin === true || isBootstrapAdmin

    if (!isAdmin) {
      return redirect('/')
    }
  }

  // 3b. Retailer space security: Only retailers can access /retailer
  if (pathname.startsWith('/retailer')) {
    if (!user) {
      return redirect('/login')
    }
    const meta = user.user_metadata ?? {}
    const isRetailer = meta.role === 'retailer'

    if (!isRetailer) {
      return redirect('/')
    }
  }

  // 4. PRO gate — read from user_metadata, no network calls
  const isProRoute = PRO_ROUTES.some((r) => pathname.startsWith(r))
  if (isProRoute && user) {
    const meta = user.user_metadata ?? {}
    const plan = meta.plan as string | undefined
    const expiresAt = meta.plan_expires_at ? new Date(meta.plan_expires_at) : null
    const role = meta.role as string | undefined
    
    // Admins and Retailers bypass the PRO subscription gate completely
    if (role === 'admin' || role === 'retailer') {
      return response
    }
    
    // Fallback: If trial_expires_at is missing in metadata, calculate from account creation
    const createdAt = user.created_at ? new Date(user.created_at) : new Date()
    const trialExpiresAt = meta.trial_expires_at 
      ? new Date(meta.trial_expires_at) 
      : new Date(createdAt.getTime() + 24 * 60 * 60 * 1000)
    
    const adminEmailsEnv = process.env.ADMIN_EMAILS || ''
    const adminEmails = adminEmailsEnv
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
    const isBootstrapAdmin = user.email && adminEmails.includes(user.email.toLowerCase())
    const isAdmin = meta.is_admin === true || isBootstrapAdmin
 
    const now = new Date()
    const isProActive =
      isAdmin ||
      (plan === 'PRO' && (!expiresAt || expiresAt > now)) ||
      (plan === 'FREE' && trialExpiresAt && trialExpiresAt > now) ||
      (!plan && trialExpiresAt && trialExpiresAt > now)
 
    if (!isProActive) {
      // Database Fallback: Check subscriptions directly from the database to bypass stale browser JWT cookies
      const { data: dbSub } = await supabase
        .from('subscriptions')
        .select('plan, expires_at, created_at')
        .eq('user_id', user.id)
        .maybeSingle()
 
      if (dbSub) {
        if (dbSub.plan === 'PRO') {
          const dbExpires = dbSub.expires_at ? new Date(dbSub.expires_at) : null
          if (!dbExpires || dbExpires > now) {
            return response
          }
        } else if (dbSub.plan === 'FREE' && dbSub.created_at) {
          const dbTrialExpires = new Date(new Date(dbSub.created_at).getTime() + 24 * 60 * 60 * 1000)
          if (dbTrialExpires > now) {
            return response
          }
        }
      } else {
        // Ultimate Fallback: If no DB subscription record exists, calculate trial from user's account creation date
        const accountCreatedAt = user.created_at ? new Date(user.created_at) : new Date()
        const dbTrialExpires = new Date(accountCreatedAt.getTime() + 24 * 60 * 60 * 1000)
        if (dbTrialExpires > now) {
          return response
        }
      }
 
      return redirect('/upgrade')
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
