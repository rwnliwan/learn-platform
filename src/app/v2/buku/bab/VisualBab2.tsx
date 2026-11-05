"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "./poles.css";

/**
 * VisualBab2 — kurva densitas return: Normal vs Ekor Gemuk (Bab 2, "Univariate Returns").
 *
 * Pola pemuatan ECharts meniru src/app/v2/components/EChartFigure.tsx:
 * dimuat malas dari CDN jsDelivr agar halaman tanpa chart tidak membayar bundle.
 * Data murni ilustratif & deterministik (rumus pdf tertutup, dihitung di client).
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

/* ---- data ilustratif deterministik (pdf tertutup) ---- */
const SQRT_2PI = Math.sqrt(2 * Math.PI);

function normalPdf(x: number): number {
  return Math.exp((-x * x) / 2) / SQRT_2PI;
}

/** Student-t df=4 — ekor jauh lebih gemuk dari Normal. */
function fatPdf(x: number): number {
  const df = 4;
  // gamma(2.5)=1.329340388, gamma(2)=1
  const c = 1.329340388 / Math.sqrt(df * Math.PI);
  return c * Math.pow(1 + (x * x) / df, -(df + 1) / 2);
}

interface DensData {
  xs: number[];
  normal: number[];
  fat: number[];
}

function buildData(): DensData {
  const xs: number[] = [];
  const normal: number[] = [];
  const fat: number[] = [];
  for (let i = 0; i <= 240; i++) {
    const x = -4.5 + (9 * i) / 240;
    xs.push(x);
    normal.push(normalPdf(x));
    fat.push(fatPdf(x));
  }
  return { xs, normal, fat };
}

type Mode = "normal" | "fat";

function makeOption(mode: Mode, data: DensData) {
  const ys = mode === "normal" ? data.normal : data.fat;
  const line = mode === "normal" ? "#7aa2f7" : "#ff9e64";
  const fillTop = mode === "normal" ? "rgba(122,162,247,0.32)" : "rgba(255,158,100,0.32)";
  const label = mode === "normal" ? "Normal N(0,1)" : "Ekor gemuk — t(df=4)";
  return {
    backgroundColor: "transparent",
    textStyle: { color: "#E8EBEF", fontFamily: "Inter, IBM Plex Sans, sans-serif" },
    grid: { left: 46, right: 18, top: 40, bottom: 34 },
    legend: {
      top: 4,
      textStyle: { color: "#aeb9c7" },
      data: [label],
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "#13171d",
      borderColor: "#232a33",
      textStyle: { color: "#E8EBEF", fontSize: 12 },
      valueFormatter: (v: number) => v.toFixed(4),
    },
    xAxis: {
      type: "value",
      min: -4.5,
      max: 4.5,
      name: "return (satuan σ)",
      nameLocation: "middle",
      nameGap: 26,
      nameTextStyle: { color: "#8b98ab", fontSize: 11 },
      axisLine: { lineStyle: { color: "#3a4556" } },
      axisTick: { lineStyle: { color: "#3a4556" } },
      axisLabel: { color: "#8b98ab" },
    },
    yAxis: {
      type: "value",
      name: "densitas",
      nameTextStyle: { color: "#8b98ab", fontSize: 11 },
      axisLabel: { color: "#8b98ab" },
      splitLine: { lineStyle: { color: "#232a33" } },
    },
    series: [
      {
        name: label,
        type: "line",
        smooth: true,
        symbol: "none",
        data: data.xs.map((x, i) => [x, ys[i]]),
        lineStyle: { width: 2.5, color: line },
        areaStyle: {
          color: {
            type: "linear",
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: fillTop },
              { offset: 1, color: "rgba(0,0,0,0)" },
            ],
          },
        },
        markLine: {
          symbol: "none",
          lineStyle: { color: "#5b6b82", type: "dashed", width: 1 },
          label: { color: "#8b98ab", fontSize: 11, formatter: "{b}" },
          data: [
            { xAxis: -2, name: "−2σ" },
            { xAxis: -1, name: "−1σ" },
            { xAxis: 1, name: "+1σ" },
            { xAxis: 2, name: "+2σ" },
          ],
        },
      },
    ],
  };
}

export default function VisualBab2() {
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const [mode, setMode] = useState<Mode>("normal");
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const data = useMemo(buildData, []);

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
    chart.setOption(makeOption(mode, data), true);
    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(ref.current);
    return () => {
      ro.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  // Ganti mode → setOption ulang tanpa re-init
  useEffect(() => {
    if (chartRef.current) chartRef.current.setOption(makeOption(mode, data), true);
  }, [mode, data]);

  return (
    <figure className="bk-visual" aria-label="Perbandingan densitas Normal vs ekor gemuk">
      <div className="bk-toggle" role="group" aria-label="Pilih distribusi">
        <button
          type="button"
          className={`bkp-btn${mode === "normal" ? " bkp-btn-primary" : ""}`}
          aria-pressed={mode === "normal"}
          onClick={() => setMode("normal")}
        >
          Normal
        </button>
        <button
          type="button"
          className={`bkp-btn${mode === "fat" ? " bkp-btn-primary" : ""}`}
          aria-pressed={mode === "fat"}
          onClick={() => setMode("fat")}
        >
          Ekor Gemuk
        </button>
      </div>

      <div
        ref={ref}
        className="bk-chart"
        role="img"
        aria-label={
          mode === "normal"
            ? "Kurva densitas distribusi normal dengan penanda ±1σ dan ±2σ"
            : "Kurva densitas distribusi ekor gemuk dengan penanda ±1σ dan ±2σ"
        }
        style={{ width: "100%", height: 340 }}
      >
        {!ready && !failed && <p className="bk-chart-loading">Memuat grafik…</p>}
        {failed && (
          <p className="bk-chart-loading">
            Grafik tidak dapat dimuat (CDN tidak terjangkau).
          </p>
        )}
      </div>

      <figcaption className="bk-ilustrasi">
        Ilustrasi — kurva sintetis deterministik yang dihitung di browser, bukan data
        pasar. Perhatikan: pada “Ekor Gemuk”, massa di luar ±2σ jauh lebih besar
        daripada Normal.
      </figcaption>
    </figure>
  );
}
