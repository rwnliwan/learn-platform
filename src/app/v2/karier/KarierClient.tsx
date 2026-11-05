// /v2/karier client: renders career-readiness cards + gamification
// ("Perjalananmu") from REAL localStorage progress only.
"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Icon from "../lib/icons";
import { getLocalDone, pullServerProgress } from "../lib/progress";
import { computeRoleStats, type CareerLesson, type RoleStat } from "../lib/career";
import { computeGamify, type GamifyState } from "../lib/gamify";

function RoleCard({ stat }: { stat: RoleStat }) {
  return (
    <section className="kar-card" aria-label={stat.role.name}>
      <div className="kar-chead">
        <div>
          <div className="eyebrow">{stat.role.name}</div>
          <h2>{stat.role.name}</h2>
          <p className="kar-desc">{stat.role.desc}</p>
        </div>
        <div className="kar-pct">
          <span className="kar-pctn">{stat.pct}%</span>
          <span className="muted">cakupan</span>
        </div>
      </div>
      <div className="bar" role="progressbar" aria-valuenow={stat.pct} aria-valuemin={0} aria-valuemax={100} aria-label={`Cakupan ${stat.role.name}`}>
        <i style={{ width: `${stat.pct}%` }}></i>
      </div>
      <p className="kar-meta">
        <b>{stat.doneCount}</b> dari <b>{stat.total}</b> lesson selesai
        {stat.quiz ? (
          <>
            {" "}· akurasi kuis <b>{stat.quiz.pct}%</b>{" "}
            <span className="muted">({stat.quiz.correct}/{stat.quiz.answered} benar)</span>
          </>
        ) : (
          <>
            {" "}· <span className="muted">belum ada data kuis</span>
          </>
        )}
      </p>

      <h3 className="kar-h3">Celah terbesar</h3>
      <ul className="kar-gaps">
        {stat.gaps.map((g) => (
          <li key={g.track}>
            <div className="kar-gaprow">
              <span className="kar-gapt">{g.track}</span>
              <span className="muted">
                {g.done}/{g.total} · {g.pct}%
              </span>
            </div>
            <div className="bar slim" role="progressbar" aria-valuenow={g.pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${g.track} ${g.pct}%`}>
              <i style={{ width: `${g.pct}%` }}></i>
            </div>
          </li>
        ))}
      </ul>

      <h3 className="kar-h3">Lesson berikutnya</h3>
      {stat.next ? (
        <Link className="kar-next" href={`/v2/learn/${stat.next.slug}`}>
          <Icon name="play" />
          <span>
            <b>{stat.next.title}</b>
            <small className="muted">{stat.next.track}</small>
          </span>
          <Icon name="right" />
        </Link>
      ) : (
        <p className="kar-done">
          <Icon name="check" /> Semua lesson peran ini selesai.
        </p>
      )}
    </section>
  );
}

function Journey({ g }: { g: GamifyState }) {
  return (
    <section className="kar-card" aria-label="Perjalananmu">
      <div className="kar-chead">
        <div>
          <div className="eyebrow">Perjalananmu</div>
          <h2>Gamifikasi ringan</h2>
          <p className="kar-desc">XP, streak, dan badge — semuanya dihitung dari progres nyatamu di perangkat ini.</p>
        </div>
      </div>
      <div className="kar-stats">
        <div className="kar-stat">
          <span className="kar-statn">{g.xp}</span>
          <span className="muted">XP · Level {g.level}</span>
          <div className="bar slim" role="progressbar" aria-valuenow={g.levelPct} aria-valuemin={0} aria-valuemax={100} aria-label={`Level ${g.level}`}>
            <i style={{ width: `${g.levelPct}%` }}></i>
          </div>
          <small className="muted">{100 - g.xpIntoLevel} XP lagi ke level {g.level + 1}</small>
        </div>
        <div className="kar-stat">
          <span className="kar-statn">{g.streak}</span>
          <span className="muted">hari beruntun belajar</span>
          <small className="muted">{g.streak === 0 ? "Kunjungi satu lesson hari ini untuk memulai." : "Pertahankan ritmenya."}</small>
        </div>
        <div className="kar-stat">
          <span className="kar-statn">{g.labsPassed}</span>
          <span className="muted">lab lolos</span>
          <small className="muted">{g.quizCorrect} jawaban kuis benar tercatat</small>
        </div>
      </div>
      <h3 className="kar-h3">Badge</h3>
      <ul className="kar-badges">
        {g.badges.map((b) => (
          <li key={b.id} className={b.earned ? "earned" : "locked"} title={b.earned ? "Didapat" : b.desc}>
            <span className="kar-bicon">
              <Icon name={b.earned ? b.icon : "lock"} />
            </span>
            <span>
              <b>{b.name}</b>
              <small className="muted">{b.desc}</small>
            </span>
            {b.earned && (
              <span className="kar-bcheck" aria-label="Didapat">
                <Icon name="check" />
              </span>
            )}
          </li>
        ))}
      </ul>
      <p className="kar-formula muted">
        Rumus XP: <b>10</b> per lesson selesai + <b>2</b> per jawaban kuis benar. Tanpa pengurangan, tanpa leaderboard — kamu hanya berlomba dengan dirimu kemarin.
      </p>
    </section>
  );
}

export default function KarierClient({ index }: { index: CareerLesson[] }) {
  const [done, setDone] = useState<Set<string> | null>(null);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    setDone(getLocalDone());
    pullServerProgress().then((server) => {
      setDone((prev) => new Set([...(prev ?? []), ...server]));
    });
    const onStorage = () => setTick((t) => t + 1);
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const stats = useMemo(() => (done ? computeRoleStats(index, done) : null), [done, index, tick]);
  const g = useMemo(() => (done ? computeGamify(index) : null), [done, index, tick]);

  if (!stats || !g) {
    return (
      <div className="cont">
        <div>
          <div className="eyebrow">Memuat…</div>
          <h2>Menyiapkan peta kariermu</h2>
          <p>Membaca catatan belajar di perangkat ini.</p>
        </div>
      </div>
    );
  }

  const totalDone = stats.reduce((s, r) => s + r.doneCount, 0);
  return (
    <>
      {totalDone === 0 && (
        <div className="kar-empty">
          <p>
            <b>Belum ada lesson yang ditandai selesai.</b> Angka di bawah akan terisi otomatis begitu kamu mulai belajar — semua dihitung dari
            progres nyata di perangkat ini, bukan skor karangan.
          </p>
          <Link className="btn primary" href="/v2/learn">
            Mulai dari kurikulum <Icon name="right" />
          </Link>
        </div>
      )}
      <div className="sec">
        <span>Empat peran analis risiko</span>
        <span className="muted" style={{ fontWeight: 400 }}>
          dari {index.length} lesson terdaftar
        </span>
      </div>
      <div className="kar-grid">
        {stats.map((s) => (
          <RoleCard key={s.role.id} stat={s} />
        ))}
      </div>
      <div className="sec">
        <span>Perjalananmu</span>
      </div>
      <Journey g={g} />
    </>
  );
}
