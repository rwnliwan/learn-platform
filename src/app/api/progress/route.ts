import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "edge";

// Single-user progress store for Learn v2 (Neon).
// Mirrors the app's own auth posture: when SITE_PASSWORD is configured, the
// learn_auth cookie (set by /api/auth) is required; when it is not configured
// the endpoint is open exactly like the app itself.
const USER_ID = "septian";

function db() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  return neon(url);
}

function authed(req: NextRequest): boolean {
  const gate = process.env.SITE_PASSWORD;
  if (!gate) return true;
  return req.cookies.get("learn_auth")?.value === "1";
}

async function ensureTable(sql: NonNullable<ReturnType<typeof db>>) {
  await sql`
    CREATE TABLE IF NOT EXISTS v2_progress (
      user_id TEXT NOT NULL DEFAULT 'septian',
      lesson_slug TEXT NOT NULL,
      completed_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, lesson_slug)
    )
  `;
  // Pilot practice-loop (2026-10-30): "Dikuasai" = transfer check lolos.
  // ADD COLUMN IF NOT EXISTS agar tabel lama tetap aman.
  await sql`ALTER TABLE v2_progress ADD COLUMN IF NOT EXISTS mastered_at TIMESTAMPTZ`;
}

export async function GET(req: NextRequest) {
  // Anonymous GET returns an empty set (no data leaked): logged-out visitors
  // (and Lighthouse) previously got 401s that logged console errors. Writes
  // (POST/DELETE) stay gated below.
  if (!authed(req)) return NextResponse.json({ completed: [] });
  const sql = db();
  if (!sql) return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 500 });
  await ensureTable(sql);
  const rows = await sql`
    SELECT lesson_slug, completed_at, mastered_at FROM v2_progress WHERE user_id = ${USER_ID}
  `;
  return NextResponse.json({ completed: rows });
}

export async function POST(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sql = db();
  if (!sql) return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 500 });
  const { slug, mastered } = await req.json().catch(() => ({}));
  if (typeof slug !== "string" || !/^[a-z0-9][a-z0-9-]{0,120}$/.test(slug)) {
    return NextResponse.json({ error: "slug tidak valid" }, { status: 400 });
  }
  await ensureTable(sql);
  // Pilot practice-loop: tandai "Dikuasai" tanpa mengubah status selesai.
  if (mastered === true) {
    await sql`
      INSERT INTO v2_progress (user_id, lesson_slug, mastered_at) VALUES (${USER_ID}, ${slug}, NOW())
      ON CONFLICT (user_id, lesson_slug) DO UPDATE SET mastered_at = NOW()
    `;
    return NextResponse.json({ ok: true, slug, mastered: true });
  }
  await sql`
    INSERT INTO v2_progress (user_id, lesson_slug) VALUES (${USER_ID}, ${slug})
    ON CONFLICT (user_id, lesson_slug) DO UPDATE SET completed_at = NOW()
  `;
  return NextResponse.json({ ok: true, slug });
}

export async function DELETE(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const sql = db();
  if (!sql) return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 500 });
  const slug = new URL(req.url).searchParams.get("slug") ?? "";
  if (!/^[a-z0-9][a-z0-9-]{0,120}$/.test(slug)) {
    return NextResponse.json({ error: "slug tidak valid" }, { status: 400 });
  }
  await ensureTable(sql);
  await sql`DELETE FROM v2_progress WHERE user_id = ${USER_ID} AND lesson_slug = ${slug}`;
  return NextResponse.json({ ok: true, slug });
}
