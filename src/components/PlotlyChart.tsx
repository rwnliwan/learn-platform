"use client";
import { useEffect, useRef, useState } from "react";

interface PlotlyChartProps {
  data: any[];
  layout?: any;
  title?: string;
}

declare global {
  interface Window {
    Plotly: any;
  }
}

export default function PlotlyChart({ data, layout, title }: PlotlyChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (window.Plotly) {
      setLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/plotly.js-dist-min@2.35.2/plotly.min.js";
    script.async = true;
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Ikuti tema situs (data-theme di <html>) agar teks chart terbaca di mode gelap
  useEffect(() => {
    const read = () => setDark(document.documentElement.getAttribute("data-theme") === "dark");
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!loaded || !ref.current || !window.Plotly) return;
    // Plotly mewarisi layout.font ke judul, judul sumbu, tick label, dan legend
    const defaultLayout = {
      title: title || "",
      autosize: true,
      margin: { l: 50, r: 20, t: 40, b: 50 },
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      font: { family: "Inter, sans-serif", color: dark ? "#E8EBEF" : "#1B1A17" },
      ...layout,
    };
    window.Plotly.newPlot(ref.current, data, defaultLayout, { responsive: true, displayModeBar: false });
  }, [loaded, data, layout, title, dark]);

  return (
    <div ref={ref} className="plotly-chart" style={{ width: "100%", minHeight: "350px" }}>
      {!loaded && <p className="text-small text-muted" style={{ textAlign: "center", padding: "2rem" }}>Memuat grafik...</p>}
    </div>
  );
}
