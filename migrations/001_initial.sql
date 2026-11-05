-- Phase 1 initial schema for learn-platform (Neon PostgreSQL)
-- Run this in Neon SQL Editor (dashboard)

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
