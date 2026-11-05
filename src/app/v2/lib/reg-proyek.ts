import type { V2Lesson } from "./types";
import {
  pjAuditPortofolio,
  pjAuditPortofolioMeta,
} from "../content/pj-audit-portofolio";
import {
  pjScorecardKredit,
  pjScorecardKreditMeta,
} from "../content/pj-scorecard-kredit";
import {
  pjAmlMonitoring,
  pjAmlMonitoringMeta,
} from "../content/pj-aml-monitoring";
import {
  pjIpsPortofolio,
  pjIpsPortofolioMeta,
} from "../content/pj-ips-portofolio";
import {
  pjDbdSurveilans,
  pjDbdSurveilansMeta,
} from "../content/pj-dbd-surveilans";
import {
  pjVcfVarian,
  pjVcfVarianMeta,
} from "../content/pj-vcf-varian";

/* Registry Proyek Terpandu (flagship multi-sesi) — TERPISAH dari registry
   lesson agar hitungan 607 lesson tidak berubah. rr19 tetap di registry
   lesson (jalur /v2/learn); proyek baru berjalan di /v2/proyek/<slug>. */
export interface V2Proyek extends V2Lesson {
  role: string;
  client: string;
  tagline: string;
  skills: string[];
  deliverable: string;
}

const EXTRAS: Record<string, { skills: string[]; deliverable: string }> = {
  "pj-audit-portofolio": {
    skills: ["Performance attribution", "Fama-French factors", "HHI & konsentrasi efektif", "Sharpe & drawdown audit", "Deteksi cherry-picking"],
    deliverable: "Memo audit portofolio",
  },
  "pj-scorecard-kredit": {
    skills: ["Binning, WOE & IV", "Logistic scorecard & PDO scaling", "Validasi AUC / KS / PSI", "Kebijakan cutoff", "Deteksi data leakage"],
    deliverable: "Memo scorecard + rekomendasi cutoff",
  },
  "pj-aml-monitoring": {
    skills: ["Rule engine & ambang lapor", "Deteksi structuring", "Analisis fan-in / fan-out", "Precision-recall alert", "Narasi SAR"],
    deliverable: "Laporan SAR + rekomendasi aturan",
  },
  "pj-ips-portofolio": {
    skills: ["IPS & return objective terhitung", "Capital market expectations", "Strategic asset allocation ber-kendala", "Rebalancing & biaya after-tax", "Atribusi Brinson", "Audit proposal konsultan"],
    deliverable: "Memo IPS + rekomendasi alokasi",
  },
  "pj-dbd-surveilans": {
    skills: ["Rekonsiliasi multi-sumber", "Korelasi silang & analisis lag", "Aturan peringatan dini", "Evaluasi precision/recall", "Deteksi data leakage", "Audit klaim vendor AI"],
    deliverable: "Protokol peringatan dini DBD",
  },
  "pj-vcf-varian": {
    skills: ["Parsing VCF & QC", "Anotasi & filter frekuensi", "Klasifikasi varian", "Filogenetik UPGMA", "Audit laporan lab", "Komunikasi klinis & VUS"],
    deliverable: "Laporan varian + rekomendasi klinis",
  },
};

const withMeta = (
  l: V2Lesson,
  m: { role: string; client: string; tagline: string },
): V2Proyek => ({ ...l, ...m, ...(EXTRAS[l.slug] ?? { skills: [], deliverable: "" }) });

export const PROYEK_REGISTRY: Record<string, V2Proyek> = {
  [pjAuditPortofolio.slug]: withMeta(pjAuditPortofolio, pjAuditPortofolioMeta),
  [pjScorecardKredit.slug]: withMeta(pjScorecardKredit, pjScorecardKreditMeta),
  [pjAmlMonitoring.slug]: withMeta(pjAmlMonitoring, pjAmlMonitoringMeta),
  [pjIpsPortofolio.slug]: withMeta(pjIpsPortofolio, pjIpsPortofolioMeta),
  [pjDbdSurveilans.slug]: withMeta(pjDbdSurveilans, pjDbdSurveilansMeta),
  [pjVcfVarian.slug]: withMeta(pjVcfVarian, pjVcfVarianMeta),
};

export const PROYEK_LIST: V2Proyek[] = Object.values(PROYEK_REGISTRY);

export function getProyek(slug: string): V2Proyek | undefined {
  return PROYEK_REGISTRY[slug];
}

export function proyekSlugs(): string[] {
  return Object.keys(PROYEK_REGISTRY);
}
