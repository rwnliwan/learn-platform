"use client";
import { useState, useMemo } from "react";

interface StatsCalculatorProps {
  defaultValues?: string;
  title?: string;
}

export default function StatsCalculator({ defaultValues = "8, 9, 10, 11, 12", title }: StatsCalculatorProps) {
  const [input, setInput] = useState(defaultValues);

  const stats = useMemo(() => {
    const nums = input.split(/[,;\s]+/).map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    if (nums.length === 0) return null;

    const sorted = [...nums].sort((a, b) => a - b);
    const n = nums.length;
    const mean = nums.reduce((a, b) => a + b, 0) / n;
    const median = n % 2 === 1 ? sorted[Math.floor(n / 2)] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;

    const freq: Record<string, number> = {};
    nums.forEach(x => { freq[String(x)] = (freq[String(x)] || 0) + 1; });
    const maxFreq = Math.max(...Object.values(freq));
    // Modus hanya ada jika ada nilai yang muncul >1x; semua-unik = tidak ada modus
    const hasMode = maxFreq > 1;
    const modes = Object.keys(freq).filter(k => freq[k] === maxFreq).map(Number);

    const variance = nums.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (n - 1 || 1);
    const sd = Math.sqrt(variance);
    const min = sorted[0];
    const max = sorted[n - 1];
    const q1 = sorted[Math.floor(n * 0.25)];
    const q3 = sorted[Math.floor(n * 0.75)];

    return { n, mean, median, modes, hasMode, sd, variance, min, max, q1, q3, sorted };
  }, [input]);

  const fmt = (x: number) => x % 1 === 0 ? String(x) : x.toFixed(2);

  return (
    <div className="calc-card">
      <h4>{title || "🧮 Kalkulator Statistik"}</h4>
      <p className="text-small text-muted">Ketik angka dipisah koma. Coba tambah outlier (misal: 100) dan lihat apa yang berubah!</p>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="calc-input"
        placeholder="8, 9, 10, 11, 12"
      />
      {stats ? (
        <div className="calc-grid">
          <div className="calc-item"><span className="calc-label">n</span><span className="calc-value">{stats.n}</span></div>
          <div className="calc-item"><span className="calc-label">Mean</span><span className="calc-value">{fmt(stats.mean)}</span></div>
          <div className="calc-item"><span className="calc-label">Median</span><span className="calc-value">{fmt(stats.median)}</span></div>
          <div className="calc-item"><span className="calc-label">Modus</span><span className="calc-value" title={stats.hasMode ? "" : "Tidak ada — semua nilai unik"}>{stats.hasMode ? stats.modes.map(fmt).join(", ") : "tidak ada"}</span></div>
          <div className="calc-item"><span className="calc-label">SD</span><span className="calc-value">{fmt(stats.sd)}</span></div>
          <div className="calc-item"><span className="calc-label">Min – Max</span><span className="calc-value">{fmt(stats.min)} – {fmt(stats.max)}</span></div>
          <div className="calc-item"><span className="calc-label">Q1 – Q3</span><span className="calc-value">{fmt(stats.q1)} – {fmt(stats.q3)}</span></div>
          <div className="calc-item"><span className="calc-label">Range</span><span className="calc-value">{fmt(stats.max - stats.min)}</span></div>
        </div>
      ) : (
        <p className="text-small" style={{ color: "var(--error)" }}>Masukkan angka yang valid.</p>
      )}
      {stats && Math.abs(stats.mean - stats.median) > stats.sd * 0.5 && (
        <div className="callout callout-warning" style={{ marginTop: "var(--sp-3)", marginBottom: 0 }}>
          <p className="text-small"><strong>⚠️ Mean ≠ Median!</strong> Data miring atau ada outlier. Median lebih mewakili "tipikal".</p>
        </div>
      )}
    </div>
  );
}
