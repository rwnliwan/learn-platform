// Generator manifest data kartu review (/api/v2/card).
// Menjalankan registry ter-bundle (esbuild) lalu mengekstrak HANYA field yang
// dibutuhkan endpoint kartu: judul/track lesson + per step: id, judul, quiz
// (q + opsi [text, why, correct]), tasks ([id, text]), expected.
// Output: src/app/v2/lib/cardData.json — WAJIB regenerasi setiap kali konten
// lesson berubah sebelum deploy (endpoint kartu membaca file ini, bukan
// registry penuh, karena fungsi edge dibatasi 4 MB).
// Pakai: ./node_modules/.bin/esbuild src/app/v2/lib/registry.ts --bundle \
//   --format=esm --outfile=/tmp/regbundle.mjs --log-level=error && \
//   node scripts/gen-card-data.mjs
import { writeFileSync } from "node:fs";
const m = await import("/tmp/regbundle.mjs");
const lessons = m.getV2Lessons();
const slim = {};
for (const l of lessons) {
  slim[l.slug] = {
    t: l.title,
    tr: l.track,
    steps: l.steps.map((s) => {
      const o = { id: s.id, ti: s.title };
      if (s.quiz && s.quiz.length)
        o.q = s.quiz.map((q) => ({
          q: q.q,
          o: q.options.map((op) => [op.text, op.why, op.correct ? 1 : 0]),
        }));
      if (s.tasks && s.tasks.length) o.tk = s.tasks.map((t) => [t.id, t.text]);
      if (s.expected) o.e = s.expected;
      return o;
    }),
  };
}
writeFileSync(
  new URL("../src/app/v2/lib/cardData.json", import.meta.url),
  JSON.stringify(slim)
);
console.log(
  "cardData.json:",
  lessons.length,
  "lesson,",
  (JSON.stringify(slim).length / 1048576).toFixed(2),
  "MB"
);
