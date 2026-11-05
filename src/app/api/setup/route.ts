import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const runtime = "edge";

const MIGRATION_SQL = `
CREATE TABLE IF NOT EXISTS lessons (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  track TEXT NOT NULL,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS chapters (
  id SERIAL PRIMARY KEY,
  lesson_id INT REFERENCES lessons(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  content_md TEXT NOT NULL DEFAULT '',
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lesson_id, slug)
);
CREATE TABLE IF NOT EXISTS progress (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  chapter_id INT REFERENCES chapters(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ,
  quiz_score FLOAT,
  UNIQUE(user_id, chapter_id)
);
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  chapter_id INT REFERENCES chapters(id) ON DELETE CASCADE,
  answers_json JSONB NOT NULL DEFAULT '{}',
  score FLOAT NOT NULL DEFAULT 0,
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_chapters_lesson ON chapters(lesson_id, order_index);
CREATE INDEX IF NOT EXISTS idx_progress_user ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_user_chapter ON quiz_attempts(user_id, chapter_id);
`;

export async function POST(req: NextRequest) {
  const { password, force } = await req.json().catch(() => ({}));
  if (!process.env.SITE_PASSWORD || password !== process.env.SITE_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 500 });
  }

  try {
    const sql = neon(dbUrl);
    // Idempotency guard: refuse to re-run once configured unless explicitly
    // forced (still password-gated). Prevents accidental or hostile re-runs
    // of DDL against a live database.
    await sql`CREATE TABLE IF NOT EXISTS setup_log (id INT PRIMARY KEY, completed_at TIMESTAMPTZ DEFAULT NOW())`;
    const done = await sql`SELECT id FROM setup_log WHERE id = 1`;
    if (done.length > 0 && force !== true) {
      return NextResponse.json({ ok: true, already: true, note: "setup sudah pernah dijalankan" });
    }
    // Run each statement separately using query method for dynamic SQL
    const statements = MIGRATION_SQL.split(";").map(s => s.trim()).filter(Boolean);
    for (const stmt of statements) {
      await sql.query(stmt, []);
    }
    await sql`INSERT INTO setup_log (id) VALUES (1) ON CONFLICT (id) DO UPDATE SET completed_at = NOW()`;
    // Verify
    const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema='public'`;
    return NextResponse.json({
      ok: true,
      tables: tables.map((t: any) => t.table_name)
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
