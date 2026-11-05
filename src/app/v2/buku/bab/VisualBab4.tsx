"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Tex from "@/components/Tex";
import "./poles.css";

/**
 * VisualBab4 — dekomposisi varians portofolio equal-weight (Bab 4,
 * "Linear Models of Returns"): var(wᵀr) = bᵀΩ_f b + wᵀΩ_ε w.
 *
 * Model satu faktor: loading 1, vol faktor 20% → varians sistematis 0,04
 * (tidak menyusut dengan n); vol idiosinkratis 30% per aset →
 * varians idiosinkratis = 0,09/n (menyusut dengan diversifikasi).
 * Slider memilih n; chart menumpuk kedua komponen di semua titik n.
 *
 * Data murni ilustratif (label "Ilustrasi"), dihitung di client.
 * Pola pemuatan ECharts meniru VisualBab2 (CDN jsDelivr, malas).
 */

declare global {
  interface Window {
    echarts?: any;
  }
}

const ECHARTS_CDN =
  "https://cdn.jsdelivr.net/npm/echarts@6.1.0/dist/echarts.min.js";
let echartsPromise: Promise<any> | null = null;

function loadEcharts(): Promise<any> {
  if (typeof window === "undefined")
    return Promise.reject(new Error("SSR"));
  if (echartsPromise) return echartsPromise;
  echartsPromise = new Promise((resolve, reject) => {
    if (window.echarts) {
      resolve(window.echarts);
      return;
    }
    const script = document.createElement("script");
    script.src = ECHARTS_CDN;
    script.async = true;
    script.onload = () =>
      window.echarts
        ? resolve(window.echarts)
        : reject(new Error("window.echarts tidak ditemukan"));
    script.onerror = () => reject(new Error("Gagal memuat ECharts dari CDN"));
    document.head.appendChild(script);
  });
  return echartsPromise;
}

/* ---- model ilustratif ---- */
const NS = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000];
const VAR_SYS = 0.04; // (loading 1)² × (20%)² — tidak bergantung n
const VAR_IDIO_1 = 0.09; // (30%)² per aset — dibagi n saat diagregasi

function fmtID(x: number, desimal = 1): string {
  return x
    .toFixed(desimal)
    .replace(/\.?0+$/, "")
    .replace(".", ",");
}

function makeOption(selIdx: number) {
  const sys = NS.map(() => VAR_SYS);
  const idio = NS.map((n) => VAR_IDIO_1 / n);
  return {
    backgroundColor: "transparent",
    textStyle: { color: "#E8EBEF", fontFamily: "Inter, IBM Plex Sans, sans-serif" },
    grid: { left: 52, right: 18, top: 44, bottom: 34 },
    legend: {
      top: 4,
      textStyle: { color: "#aeb9c7" },
      data: ["Sistematis (bᵀΩ_f b)", "Idiosinkratis (wᵀΩ_ε w)"],
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "#13171d",
      borderColor: "#232a33",
      textStyle: { color: "#E8EBEF", fontSize: 12 },
      valueFormatter: (v: number) => v.toFixed(4),
    },
    xAxis: {
      type: "category",
      data: NS.map(String),
      name: "n (jumlah aset)",
      nameLocation: "middle",
      nameGap: 28,
      nameTextStyle: { color: "#8b98ab", fontSize: 11 },
      axisLine: { lineStyle: { color: "#3a4556" } },
      axisTick: { lineStyle: { color: "#3a4556" } },
      axisLabel: { color: "#8b98ab" },
    },
    yAxis: {
      type: "value",
      name: "varians portofolio",
      nameTextStyle: { color: "#8b98ab", fontSize: 11 },
      axisLabel: { color: "#8b98ab", formatter: (v: number) => v.toFixed(2) },
      splitLine: { lineStyle: { color: "#232a33" } },
    },
    series: [
      {
        name: "Sistematis (bᵀΩ_f b)",
        type: "bar",
        stack: "var",
        data: sys,
        itemStyle: { color: "#7aa2f7" },
      },
      {
        name: "Idiosinkratis (wᵀΩ_ε w)",
        type: "bar",
        stack: "var",
        data: idio,
        itemStyle: { color: "#ff9e64" },
        markLine: {
          symbol: "none",
          lineStyle: { color: "#ffd166", type: "dashed", width: 2 },
          label: { color: "#ffd166", fontSize: 11, formatter: "n = " + NS[selIdx] },
          data: [{ xAxis: String(NS[selIdx]) }],
        },
      },
    ],
  };
}

export default function VisualBab4() {
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const [idx, setIdx] = useState(6); // default n = 100
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadEcharts()
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready || !ref.current || !window.echarts) return;
    const chart = window.echarts.init(ref.current, null, { renderer: "canvas" });
    chartRef.current = chart;
    chart.setOption(makeOption(idx), true);
    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(ref.current);
    return () => {
      ro.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  useEffect(() => {
    if (chartRef.current) chartRef.current.setOption(makeOption(idx), true);
  }, [idx]);

  const n = NS[idx];
  const vSys = VAR_SYS;
  const vIdio = VAR_IDIO_1 / n;
  const total = vSys + vIdio;
  const pctIdio = (100 * vIdio) / total;

  return (
    <figure className="bk-visual" aria-label="Dekomposisi varians: sistematis vs idiosinkratis">
      <div className="bk-fcard bk-cantelli-formula">
        <Tex block math="\mathrm{var}(w^Tr) = b^T\Omega_f b + w^T\Omega_\epsilon w" />
        <p className="bk-cantelli-desc">
          Portofolio <em>equal-weight</em> dari <Tex math="n" /> aset: komponen
          sistematis <strong>tidak</strong> menyusut dengan <Tex math="n" />,
          komponen idiosinkratis menyusut seperti <Tex math="1/n" />. Geser
          slider-nya.
        </p>
      </div>

      <div className="bk-sliders">
        <label className="bk-slider-row">
          <span className="bk-slider-label">
            Jumlah aset <Tex math="n" />
            <span className="bk-slider-val" data-testid="visual4-n">{n}</span>
          </span>
          <input
            type="range"
            min={0}
            max={NS.length - 1}
            step={1}
            value={idx}
            onChange={(e) => setIdx(parseInt(e.target.value, 10))}
            aria-label="Jumlah aset n (1 sampai 1000)"
          />
        </label>
      </div>

      <div
        ref={ref}
        className="bk-chart"
        role="img"
        aria-label="Diagram batang bertumpuk varians sistematis vs idiosinkratis terhadap n"
        style={{ width: "100%", height: 340 }}
      >
        {!ready && !failed && <p className="bk-chart-loading">Memuat grafik…</p>}
        {failed && (
          <p className="bk-chart-loading">
            Grafik tidak dapat dimuat (CDN tidak terjangkau).
          </p>
        )}
      </div>

      <div className="bk-cantelli-hasil" aria-live="polite">
        <div className="bk-cantelli-angka" data-testid="visual4-pct">
          {fmtID(pctIdio)}%
        </div>
        <div className="bk-cantelli-sub">
          porsi varians idiosinkratis pada n={n} (sistematis {fmtID(vSys, 3)},
          idiosinkratis {fmtID(vIdio, 4)}, total {fmtID(total, 4)})
        </div>
      </div>

      <figcaption className="bk-ilustrasi">
        Ilustrasi — model satu faktor sintetis (vol faktor 20%, vol
        idiosinkratis 30%/aset), dihitung di browser. Intuisi Bab 4:
        diversifikasi membunuh risiko spesifik, bukan risiko faktor —
        inilah mengapa alpha spanned "datang dengan risiko yang tidak
        terdiversifikasi oleh n besar".
      </figcaption>
    </figure>
  );
}
