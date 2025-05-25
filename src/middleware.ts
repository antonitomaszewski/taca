import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Jeśli użytkownik próbuje dostać się do edycji parafii bez sesji
    if (req.nextUrl.pathname.startsWith("/edycja-parafii") && !req.nextauth.token) {
      return NextResponse.redirect(new URL("/", req.url))
    }

    // Sprawdź czy użytkownik ma rolę PARISH_ADMIN
    if (req.nextUrl.pathname.startsWith("/edycja-parafii")) {
      if (req.nextauth.token?.role !== "PARISH_ADMIN") {
        return NextResponse.redirect(new URL("/", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Pozwól na dostęp do stron publicznych
        if (!req.nextUrl.pathname.startsWith("/edycja-parafii")) {
          return true
        }
        
        // Wymagaj tokenu dla chronionych tras
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    "/edycja-parafii/:path*",
    // Dodaj inne chronione trasy tutaj
  ]
}
