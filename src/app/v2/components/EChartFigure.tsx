"use client";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    echarts?: any;
  }
}

// ECharts dimuat malas via CDN (pola sama seperti PlotlyChart), agar halaman
// tanpa chart tidak membayar bundle ±1MB.
const ECHARTS_CDN = "https://cdn.jsdelivr.net/npm/echarts@6.1.0/dist/echarts.min.js";
let echartsPromise: Promise<void> | null = null;

function loadEcharts(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("SSR"));
  if (echartsPromise) return echartsPromise;
  echartsPromise = new Promise((resolve, reject) => {
    if (window.echarts) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = ECHARTS_CDN;
    script.async = true;
    script.onload = () => (window.echarts ? resolve() : reject(new Error("window.echarts tidak ditemukan")));
    script.onerror = () => reject(new Error("Gagal memuat ECharts dari CDN"));
    document.head.appendChild(script);
  });
  return echartsPromise;
}

interface EChartFigureProps {
  /** ECharts option (series, xAxis, tooltip, …) */
  option: unknown;
  caption?: string;
  /** tinggi chart dalam px */
  height?: number;
}

/** deep-merge dangkal-aman untuk menyuntik warna tema ke option penulis. */
function mergeDeep(base: any, over: any): any {
  if (Array.isArray(over)) return over;
  if (over && typeof over === "object") {
    const out: any = base && typeof base === "object" && !Array.isArray(base) ? { ...base } : {};
    for (const k of Object.keys(over)) out[k] = mergeDeep(out[k], over[k]);
    return out;
  }
  return over === undefined ? base : over;
}

function axisTheme(color: string, grid: string) {
  return {
    axisLine: { lineStyle: { color: grid } },
    axisTick: { lineStyle: { color: grid } },
    axisLabel: { color },
    splitLine: { lineStyle: { color: grid } },
  };
}

/** bungkus option penulis dengan warna tema situs (terang/gelap). */
function applyThemed(chart: any, option: unknown, dark: boolean) {
  const fg = dark ? "#E8EBEF" : "#1B1A17";
  const grid = dark ? "#232A33" : "#E1DED5";
  const panel = dark ? "#13171D" : "#FFFFFF";
  const ax = axisTheme(fg, grid);
  const themed = mergeDeep(
    {
      backgroundColor: "transparent",
      textStyle: { fontFamily: "IBM Plex Sans, Inter, sans-serif", color: fg },
      xAxis: ax,
      yAxis: ax,
      tooltip: {
        backgroundColor: panel,
        borderColor: grid,
        textStyle: { color: fg, fontSize: 12 },
      },
      legend: { textStyle: { color: fg } },
    },
    option
  );
  chart.setOption(themed, true);
}

export default function EChartFigure({ option, caption, height = 360 }: EChartFigureProps) {
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [dark, setDark] = useState(false);
  const optRef = useRef(option);
  optRef.current = option;

  useEffect(() => {
    loadEcharts()
      .then(() => setLoaded(true))
      .catch(() => setFailed(true));
  }, []);

  // Ikuti tema situs (data-theme di <html>) seperti PlotlyChart
  useEffect(() => {
    const read = () => setDark(document.documentElement.getAttribute("data-theme") === "dark");
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!loaded || !ref.current || !window.echarts) return;
    if (chartRef.current) chartRef.current.dispose();
    const chart = window.echarts.init(ref.current, null, { renderer: "canvas" });
    chartRef.current = chart;
    applyThemed(chart, optRef.current, dark);
    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(ref.current);
    return () => {
      ro.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
  }, [loaded, dark]);

  // option berubah tanpa ganti tema → setOption ulang (tidak re-init)
  useEffect(() => {
    if (chartRef.current) applyThemed(chartRef.current, option, dark);
  }, [option, dark]);

  return (
    <figure className="efig" style={{ margin: "12px 0", width: "100%" }}>
      <div
        ref={ref}
        className="echart-canvas"
        role="img"
        aria-label={caption ?? "Grafik ECharts"}
        style={{ width: "100%", height }}
      >
        {!loaded && !failed && (
          <p className="text-small text-muted" style={{ textAlign: "center", padding: "2rem" }}>
            Memuat grafik…
          </p>
        )}
        {failed && (
          <p style={{ textAlign: "center", padding: "2rem", color: "var(--error)" }}>
            Gagal memuat ECharts dari CDN. Periksa koneksi lalu muat ulang.
          </p>
        )}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
