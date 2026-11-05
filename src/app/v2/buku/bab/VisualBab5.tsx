"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Tex from "@/components/Tex";
import "./poles.css";

/**
 * VisualBab5 — kurva hukuman QLIKE vs MSE (Bab 5, "Evaluating Risk")
 * terhadap rasio x = r²/σ̂².
 *
 *   QLIKE(x) = x − ln x − 1     (skewed: menghukum over-estimasi lebih keras)
 *   MSE(x)   = (x − 1)²         (simetris dalam rasio)
 *
 * Garis vertikal x=1 ("prakiraan tepat"), x=0,5 (over-estimasi 2×),
 * x=2 (under-estimasi 2×) menunjukkan asimetri QLIKE.
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

const qlike = (x: number) => x - Math.log(x) - 1;
const mse = (x: number) => (x - 1) * (x - 1);

function buildData() {
  const xs: number[] = [];
  const q: number[] = [];
  const m: number[] = [];
  for (let i = 0; i <= 290; i++) {
    const x = 0.1 + (2.9 * i) / 290;
    xs.push(x);
    q.push(qlike(x));
    m.push(mse(x));
  }
  return { xs, q, m };
}

function makeOption(data: { xs: number[]; q: number[]; m: number[] }) {
  const seriesDef = (
    name: string,
    ys: number[],
    color: string,
    fillTop: string
  ) => ({
    name,
    type: "line",
    smooth: true,
    symbol: "none",
    data: data.xs.map((x, i) => [x, ys[i]]),
    lineStyle: { width: 2.5, color },
    areaStyle: {
      color: {
        type: "linear",
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: fillTop },
          { offset: 1, color: "rgba(0,0,0,0)" },
        ],
      },
    },
  });
  return {
    backgroundColor: "transparent",
    textStyle: { color: "#E8EBEF", fontFamily: "Inter, IBM Plex Sans, sans-serif" },
    grid: { left: 46, right: 18, top: 44, bottom: 34 },
    legend: {
      top: 4,
      textStyle: { color: "#aeb9c7" },
      data: ["QLIKE (skewed)", "MSE (simetris)"],
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "#13171d",
      borderColor: "#232a33",
      textStyle: { color: "#E8EBEF", fontSize: 12 },
      valueFormatter: (v: number) => v.toFixed(3),
    },
    xAxis: {
      type: "value",
      min: 0.1,
      max: 3,
      name: "x = r²/σ̂² (rasio realisasi terhadap prakiraan)",
      nameLocation: "middle",
      nameGap: 26,
      nameTextStyle: { color: "#8b98ab", fontSize: 11 },
      axisLine: { lineStyle: { color: "#3a4556" } },
      axisTick: { lineStyle: { color: "#3a4556" } },
      axisLabel: { color: "#8b98ab" },
    },
    yAxis: {
      type: "value",
      name: "hukuman (loss)",
      nameTextStyle: { color: "#8b98ab", fontSize: 11 },
      axisLabel: { color: "#8b98ab" },
      splitLine: { lineStyle: { color: "#232a33" } },
    },
    series: [
      seriesDef("QLIKE (skewed)", data.q, "#ff9e64", "rgba(255,158,100,0.28)"),
      seriesDef("MSE (simetris)", data.m, "#7aa2f7", "rgba(122,162,247,0.28)"),
      {
        name: "penanda",
        type: "line",
        symbol: "none",
        data: [],
        markLine: {
          symbol: "none",
          lineStyle: { color: "#5b6b82", type: "dashed", width: 1 },
          label: { color: "#8b98ab", fontSize: 11, formatter: "{b}" },
          data: [
            { xAxis: 0.5, name: "x=0,5 (over-estimasi 2×)" },
            { xAxis: 1, name: "x=1 (tepat)" },
            { xAxis: 2, name: "x=2 (under-estimasi 2×)" },
          ],
        },
      },
    ],
  };
}

export default function VisualBab5() {
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
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
    chart.setOption(makeOption(data), true);
    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(ref.current);
    return () => {
      ro.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
  }, [ready, data]);

  // Angka jangkar untuk narasi (x=0,5 vs x=2)
  const q05 = qlike(0.5);
  const q2 = qlike(2);
  const m05 = mse(0.5);
  const m2 = mse(2);
  const fmt = (v: number) => v.toFixed(3).replace(".", ",");

  return (
    <figure className="bk-visual" aria-label="Perbandingan hukuman QLIKE vs MSE">
      <div className="bk-fcard bk-cantelli-formula">
        <Tex block math="\mathrm{QLIKE} = x - \log x - 1 \qquad \mathrm{MSE} = (x-1)^2 \qquad x := r^2/\hat{\sigma}^2" />
        <p className="bk-cantelli-desc">
          Pada <Tex math="x = 0{,}5" /> (over-estimasi 2×): QLIKE ={" "}
          <strong>{fmt(q05)}</strong>, MSE = <strong>{fmt(m05)}</strong>. Pada{" "}
          <Tex math="x = 2" /> (under-estimasi 2×): QLIKE ={" "}
          <strong>{fmt(q2)}</strong>, MSE = <strong>{fmt(m2)}</strong> — QLIKE
          menghukum sisi kiri (over-estimasi) lebih keras. Arahkan kursor ke
          kurva untuk nilai pastinya.
        </p>
      </div>

      <div
        ref={ref}
        className="bk-chart"
        role="img"
        aria-label="Kurva hukuman QLIKE dan MSE terhadap rasio realisasi per prakiraan"
        style={{ width: "100%", height: 340 }}
        data-testid="visual5-chart"
      >
        {!ready && !failed && <p className="bk-chart-loading">Memuat grafik…</p>}
        {failed && (
          <p className="bk-chart-loading">
            Grafik tidak dapat dimuat (CDN tidak terjangkau).
          </p>
        )}
      </div>

      <figcaption className="bk-ilustrasi">
        Ilustrasi — kurva sintetis deterministik yang dihitung di browser, bukan
        data pasar. Inilah "skewness" Gambar 5.1 di buku: hukuman QLIKE lebih
        besar saat varians terealisasi <em>lebih kecil</em> dari varians
        estimasi. Pilihan loss function = pilihan asimetri hukuman.
      </figcaption>
    </figure>
  );
}
