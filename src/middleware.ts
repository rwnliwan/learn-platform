import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // TEMPORARILY DISABLED: Cloudflare Pages env vars not propagating to edge middleware
  // TODO: Fix SITE_PASSWORD via Pages dashboard, then re-enable
  return NextResponse.next();

  /*
  const password = process.env.SITE_PASSWORD;
  // No password set = open (dev mode)
  if (!password) return NextResponse.next();

  // Check cookie
  const authed = req.cookies.get("learn_auth")?.value === "1";
  if (authed) return NextResponse.next();

  // Allow the login page itself
  if (req.nextUrl.pathname === "/login") return NextResponse.next();

  return NextResponse.redirect(new URL("/login", req.url));
  */
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
