import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Deep-link dashboard ?track=track-<slug> diarahkan ke halaman track
  // bersangkutan (pecah kurikulum, 2026-11-12). Redirect di sini — bukan
  // di page.tsx — supaya /v2/learn tetap halaman statis: page dinamis yang
  // mengimpor registry lesson penuh membuat edge function 7,3 MB (batas
  // 4 MB) dan build gagal. Slug divalidasi polanya (keluaran slugify) agar
  // tidak jadi open-redirect; slug tak dikenal 404 di halaman track.
  if (req.nextUrl.pathname === "/v2/learn") {
    const qp = req.nextUrl.searchParams.get("track") ?? "";
    if (qp) {
      const slug = qp.startsWith("track-") ? qp.slice("track-".length) : qp;
      if (/^[a-z0-9-]+$/.test(slug)) {
        return NextResponse.redirect(
          new URL(`/v2/learn/track/${slug}`, req.url),
        );
      }
    }
  }

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
