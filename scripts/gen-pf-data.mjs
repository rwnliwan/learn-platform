// Generator manifest Portfolio Generator (/v2/portofolio, Gelombang K).
// Menjalankan bundle ter-esbuild lalu mengekstrak HANYA field yang dibutuhkan
// halaman portofolio: meta proyek + steps (prose, tasks, expected, note,
// checks dengan expected value) + flag langkah impostor/debrief.
// Output: src/app/v2/lib/pfData.json — di-commit (pola cardData.json, gen-kg-data.mjs).
// Client-side only: tidak ada fungsi edge baru, tidak ada impor registry penuh.
// Isi konten proyek hanya DIBACA (rr19 tidak boleh diubah — generator tidak menulis ke file konten).
// Pakai:
//   printf '%s' 'export { PROYEK_REGISTRY } from "/home/hatch/workspace/learn-platform/src/app/v2/lib/reg-proyek"; export { REG_RR } from "/home/hatch/workspace/learn-platform/src/app/v2/lib/reg-rr";' > /tmp/pfentry.ts
//   ./node_modules/.bin/esbuild /tmp/pfentry.ts --bundle --format=esm --outfile=/tmp/pfbundle.mjs --log-level=error && node scripts/gen-pf-data.mjs
import { writeFileSync } from "node:fs";

const m = await import("/tmp/pfbundle.mjs");

const IMPOSTOR_RE = /impostor|debrief|vendor|suntik|dossier/i;

function extractStep(s) {
  const checks = (s.code && s.code.checks ? s.code.checks : []).map((c) => ({
    label: c.label ?? "",
    value: c.value === undefined ? null : c.value,
    tol: c.tol === undefined ? null : c.tol,
    msg: c.msg ?? null,
  }));
  return {
    id: s.id ?? "",
    eyebrow: s.eyebrow ?? "",
    title: s.title ?? "",
    prose: Array.isArray(s.prose) ? s.prose : [],
    tasks: Array.isArray(s.tasks) ? s.tasks.map((t) => t.text ?? "") : [],
    expected: s.expected ?? null,
    note: s.note
      ? { title: s.note.title ?? "", body: s.note.body ?? "", type: s.note.type ?? "info" }
      : null,
    checks,
    impostor: !!s.impostor || IMPOSTOR_RE.test(`${s.eyebrow ?? ""} ${s.title ?? ""}`),
  };
}

function extractProject(p, extra) {
  return {
    slug: p.slug,
    title: p.title,
    track: p.track,
    module: p.module ?? "",
    estMinutes: p.estMinutes ?? 0,
    role: extra?.role ?? "",
    client: extra?.client ?? "",
    tagline: extra?.tagline ?? "",
    skills: extra?.skills ?? [],
    deliverable: extra?.deliverable ?? "",
    steps: (p.steps ?? []).map(extractStep),
  };
}

const out = { generated: new Date().toISOString(), projects: [] };

// 6 proyek terpandu dari PROYEK_REGISTRY (sudah termasuk role/client/tagline/skills/deliverable)
for (const p of Object.values(m.PROYEK_REGISTRY)) {
  out.projects.push(
    extractProject(p, {
      role: p.role ?? "",
      client: p.client ?? "",
      tagline: p.tagline ?? "",
      skills: p.skills ?? [],
      deliverable: p.deliverable ?? "",
    }),
  );
}

// rr19 dibaca dari REG_RR (lesson registry) — TIDAK diubah, hanya diekstrak.
const rr19 = m.REG_RR["rr19-audit-impostor"];
if (!rr19) throw new Error("rr19-audit-impostor tidak ditemukan di REG_RR");
out.projects.push(
  extractProject(rr19, {
    role: "Auditor paket alpha",
    client: "—",
    tagline: "Audit 16 sim nyata dari snapshot Turso: adili paket alpha baris per baris, lalu temukan suntikan sang impostor.",
    skills: ["Audit paket alpha", "Sharpe & fitness", "Deteksi klaim suntikan", "Skeptisisme terukur"],
    deliverable: "Laporan audit paket alpha",
  }),
);

const json = JSON.stringify(out);
writeFileSync("src/app/v2/lib/pfData.json", json);
console.log(`pfData.json: ${out.projects.length} proyek, ${(json.length / 1024).toFixed(1)} KB`);
for (const p of out.projects) {
  const nChecks = p.steps.reduce((a, s) => a + s.checks.length, 0);
  console.log(`  ${p.slug}: ${p.steps.length} langkah, ${nChecks} checks`);
}
