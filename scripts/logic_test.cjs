#!/usr/bin/env node
// Logic tests for Learn v2 upgrade items (no browser needed).
// Bundles the real TS sources with esbuild; shims localStorage.
const { execSync } = require("child_process");
const fs = require("fs");

const LS = (() => {
  const store = new Map();
  return {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
    key: (i) => [...store.keys()][i] ?? null,
    get length() { return store.size; },
  };
})();
global.localStorage = LS;

const R = [];
function check(n, ok, d = "") {
  R.push(!!ok);
  console.log((ok ? "PASS " : "FAIL ") + n + (d ? " — " + d : ""));
}

const REPO = "/home/hatch/workspace/learn-platform";
execSync(`cd ${REPO} && npx esbuild src/app/v2/lib/fsrs.ts --bundle --platform=node --format=cjs --external:react --outfile=/tmp/t_fsrs.cjs --log-level=error`, { stdio: "inherit" });
execSync(`cd ${REPO} && npx esbuild src/app/v2/components/HintLadder.tsx --bundle --platform=node --format=cjs --external:react --external:react-dom --outfile=/tmp/t_hint.cjs --log-level=error`, { stdio: "inherit" });
execSync(`cd ${REPO} && npx esbuild src/app/v2/lib/career.ts --bundle --platform=node --format=cjs --external:react --outfile=/tmp/t_career.cjs --log-level=error`, { stdio: "inherit" });
execSync(`cd ${REPO} && npx esbuild src/app/v2/lib/gamify.ts --bundle --platform=node --format=cjs --external:react --outfile=/tmp/t_gamify.cjs --log-level=error`, { stdio: "inherit" });

// ---------- FSRS ----------
const F = require("/tmp/t_fsrs.cjs");
const { Rating } = require("/tmp/t_fsrs.cjs"); // re-exported
LS.clear();
const s1 = F.recordReview(F.quizCardId("a11-tipe-data", "s1", 0), Rating.Good);
check("fsrs: quiz Good recorded", s1.reps === 1 && s1.kind === "quiz", `reps=${s1.reps}`);
const s2 = F.recordReview(F.quizCardId("a11-tipe-data", "s1", 1), Rating.Again);
check("fsrs: quiz Again recorded", s2.reps === 1 && s2.lapses === 1, `lapses=${s2.lapses}`);
const s3 = F.recordReview(F.labCardId("a11-tipe-data", "lab1"), Rating.Good);
check("fsrs: lab card recorded", s3.kind === "lab");
// force one card due now, one far future
const raw = JSON.parse(LS.getItem("v2:fsrs:" + F.quizCardId("a11-tipe-data", "s1", 0)));
raw.due = new Date(Date.now() - 3600e3).toISOString();
LS.setItem("v2:fsrs:" + F.quizCardId("a11-tipe-data", "s1", 0), JSON.stringify(raw));
const due = F.getDueCards(50);
check("fsrs: getDueCards returns due", due.includes(F.quizCardId("a11-tipe-data", "s1", 0)), `${due.length} due`);
const stats = F.getStats();
check("fsrs: stats", stats.totalCards === 3 && stats.dueCount >= 1, JSON.stringify(stats));
const p = F.parseCardId("quiz:my-slug:s2:3");
check("fsrs: parseCardId", p && p.kind === "quiz" && p.slug === "my-slug" && p.qIdx === 3, JSON.stringify(p));
check("fsrs: parseCardId rejects junk", F.parseCardId("bogus") === null);

// ---------- Hint ladder ----------
const H = require("/tmp/t_hint.cjs");
const stepWithHints = {
  id: "s1", title: "T1", prose: ["p"], tasks: [],
  hints: ["Apa yang membedakan tipe data kategorik dan numerik?", "Lihat kembali definisi skala nominal vs ordinal."],
  quiz: [{ q: "Mana yang nominal?", options: [
    { text: "Warna", why: "Warna tidak punya urutan bawaan.", correct: true },
    { text: "Peringkat", why: "Peringkat punya urutan.", correct: false }] }],
};
const labRungs = H.buildLabLadder(stepWithHints);
check("hint: lab ladder 3 rungs", labRungs && labRungs.length === 3, labRungs && labRungs.map(r => r.title).join(" | "));
check("hint: rung1 is a question", labRungs && /[?]\s*$/.test(labRungs[0].body.trim()) || (labRungs && labRungs[0].body.includes("?")), "ends with ?");
const quizRungs = H.buildQuizLadder(stepWithHints, 0);
check("hint: quiz ladder built from why", quizRungs && quizRungs.length >= 2, quizRungs && quizRungs.length + " rungs");
const noHint = H.buildLabLadder({ id: "s9", title: "T", prose: ["p"], tasks: [] });
check("hint: honest null when no material", noHint === null, String(noHint));

// ---------- career + gamify ----------
const C = require("/tmp/t_career.cjs");
const G = require("/tmp/t_gamify.cjs");
check("career: 4 roles", C.ROLES.length === 4, C.ROLES.map(r => r.id).join(","));
LS.clear();
LS.setItem("v2:done:cr1-produk-kredit", new Date().toISOString());
LS.setItem("v2:done:cr2-kolektibilitas", new Date().toISOString());
LS.setItem("v2:quiz:cr1-produk-kredit:s1:0", JSON.stringify({ correct: true, ts: Date.now() }));
LS.setItem("v2:quiz:cr1-produk-kredit:s1:1", JSON.stringify({ correct: false, ts: Date.now() }));
// career functions need registry lessons; pass a minimal fake via its exported helpers if available
const fns = Object.keys(C);
check("career: exports sane", fns.includes("ROLES"), fns.slice(0, 8).join(","));
const g = G.computeGamify ? G.computeGamify() : null;
if (g) {
  check("gamify: XP = 2*10 + 1*2", g.xp === 22, `xp=${g.xp}`);
  check("gamify: level>=1", g.level >= 1, `level=${g.level}`);
} else {
  check("gamify: computeGamify exists", false, "missing export; exports: " + Object.keys(G).join(","));
}

const fails = R.filter(x => !x).length;
console.log(`==== ${R.length - fails}/${R.length} ====`);
process.exit(fails ? 1 : 0);
