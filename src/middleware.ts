import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { Database } from './lib/types/supabase';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });
  const url = new URL(req.nextUrl);

  // Get the session from Supabase.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect unauthenticated users trying to access admin or profile routes.
  if (!session) {
    if (
      url.pathname.startsWith('/admin') ||
      url.pathname.startsWith('/profile')
    ) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return res;
  }
  if (url.pathname.startsWith('/admin')) {
    const { data: userRoles, error } = await supabase
      .from('roles')
      .select(`role`)
      .eq('user_id', session.user?.id);
    const roles = userRoles!.map((role) => role.role);
    const isSecurityAdmin = roles.includes('security_admin');
        if (url.pathname.includes('/admin/manage-events/approve-security')) {
      if (isSecurityAdmin) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }
    if (url.pathname.includes('/admin/manage-events/add-event')) {
      if (roles.includes('super_admin') || roles.includes('coordinator')) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }
    if (
      userRoles &&
      userRoles?.length > 0 &&
      (roles.includes('super_admin') ||
        roles.includes('coordinator') ||
        roles.includes('convenor'))
    ) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  } else if (url.pathname.startsWith('/registrar')) {
    const { data: userRoles, error } = await supabase
      .from('roles')
      .select(`role`)
      .eq('user_id', session.user?.id);
    const roles = userRoles!.map((role) => role.role);
    if (
      roles.includes('registrar') ||
      roles.includes('super_admin') ||
      roles.includes('coordinator') ||
      roles.includes('convenor')
    ) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  // Only make the DB call if the route is under '/admin'
  // if (url.pathname.startsWith('/admin')) {
  //   const { data: userRoles, error } = await supabase
  //     .from('roles')
  //     .select(`
  //       role,
  //       event_categories (
  //         name,
  //         fests (
  //           name,
  //           year
  //         )
  //       )
  //     `)
  //     .eq('user_id', session.user?.id)
  //     .single();
  //     console.log(userRoles);

  //     if(userRoles?.role === 'super_admin') {
  //       return NextResponse.next();
  //     }
  //   // Redirect if there's an error, no role data, or the role doesn't match.
  //   if (error || !userRoles) {
  //     return NextResponse.redirect(new URL('/unauthorized', req.url));
  //   }

  //   // Check for general admin access.
  //   if (userRoles.role !== 'super_admin' && userRoles.role !== 'convenor') {
  //     return NextResponse.redirect(new URL('/unauthorized', req.url));
  //   }

  //   // Additional check for the add-event route.
  //   if (
  //     url.pathname.startsWith('/admin/manage-events/add-event') &&
  //     userRoles.role !== 'super_admin'
  //   ) {
  //     return NextResponse.redirect(new URL('/unauthorized', req.url));
  //   }
  // }

  // If all checks pass, continue to the next middleware or route.
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|logo.png|sw.js).*)',
  ],
};
