import type { V2Mission } from "./types";
import { misiDbd } from "../content/misi-dbd-surveilans";
import { misiJejakDana } from "../content/misi-jejak-dana-blockchain";
import { misiLabTertukar } from "../content/misi-lab-sampel-tertukar";
import { misiVar } from "../content/misi-var-backtest";
import { misiStress } from "../content/misi-stress-korelasi";
import { misiRekonsiliasi } from "../content/misi-rekonsiliasi-laporan";
import { misiDuaSumber } from "../content/misi-laporan-dua-sumber";
// M1 grup RISIKO (koordinator 2026-10-15): 4 misi solo Credit Risk + Fraud/AML
import { misiPinjamanPertama } from "../content/misi-pinjaman-pertama";
import { misiNplTersembunyi } from "../content/misi-npl-tersembunyi";
import { misiKartuHantu } from "../content/misi-kartu-hantu";
import { misiJaringMule } from "../content/misi-jaring-mule";
// M1 grup DATA-SAINTEK (koordinator 2026-10-15): 3 misi solo "edge" Health/Bio/Blockchain
import { misiAuditImunisasi } from "../content/misi-audit-imunisasi-who";
import { misiKontaminasi } from "../content/misi-kontaminasi-platform";
import { misiOrakelButa } from "../content/misi-orakel-buta-blockchain";
// M2 grup FINANCE-STATISTIK (koordinator 2026-10-15): 10 misi solo Statistika/Probabilitas/Financial Markets/Portfolio Management/Marketing Analytics
import { misiSampelMenyanjung } from "../content/misi-sampel-menyanjung";
import { misiTamanPHack } from "../content/misi-taman-p-hack";
import { misiBayesTerbalik } from "../content/misi-bayes-terbalik";
import { misiKehancuranPenjudi } from "../content/misi-kehancuran-penjudi";
import { misiKurvaMenipu } from "../content/misi-kurva-menipu";
import { misiArbitraseRapi } from "../content/misi-arbitrase-rapi";
import { misiMarkowitz } from "../content/misi-markowitz-optimis";
import { misiRebalance } from "../content/misi-rebalance-frenesi";
import { misiAtribusi } from "../content/misi-atribusi-menipu";
import { misiAbBerhentiDini } from "../content/misi-ab-berhenti-dini";
// M2 grup AI-ML (koordinator 2026-10-15): 14 misi solo (A=core + B=edge per track)
import { misiOverfit } from "../content/misi-diagnosa-overfitting";
import { misiLeakage } from "../content/misi-kebocoran-fitur";
import { misiDeadNeuron } from "../content/misi-neuron-mati";
import { misiLrSched } from "../content/misi-jadwal-lr";
import { misiDrift } from "../content/misi-drift-produksi";
import { misiRepro } from "../content/misi-pipeline-tak-reproduksibel";
import { misiInferCost } from "../content/misi-biaya-inferensi";
import { misiHalu } from "../content/misi-halusinasi-monitor";
import { misiRag } from "../content/misi-grounding-rag";
import { misiChunk } from "../content/misi-chunking-buruk";
import { misiAgentAudit } from "../content/misi-audit-agen";
import { misiLoopAgen } from "../content/misi-loop-tak-berujung";
import { misiTriage } from "../content/misi-triage-alpha";
import { misiTurnover } from "../content/misi-turnover-trap";
// M2 grup DATA-ENGINEERING (builder 2026-10-15): 2 misi track Business Intelligence
import { misiDashboardRegulator } from "../content/misi-dashboard-regulator";
import { misiDuaDefinisi } from "../content/misi-dua-definisi-revenue";
// M2 grup DATA-ENGINEERING (builder DBA 2026-10-15): 2 misi Database Administrator
import { misiMigrasi } from "../content/misi-migrasi-tanpa-downtime";
import { misiIndeksHantu } from "../content/misi-indeks-hantu";
// CAPSTONE grup DATA (koordinator 2026-10-15): 8 misi kombinasi (Misi C)
import { misiGabungPipelineKotor } from "../content/misi-gabung-pipeline-kotor";
import { misiGabungQueryDashboard } from "../content/misi-gabung-query-ke-dashboard";
import { misiGabungLineageGovernance } from "../content/misi-gabung-lineage-governance";
import { misiGabungFeatureStore } from "../content/misi-gabung-feature-store";
import { misiGabungMigrasiWarisan } from "../content/misi-gabung-migrasi-warisan";
import { misiGabungDashboardJujur } from "../content/misi-gabung-dashboard-jujur";
import { misiGabungSurveilansGenomik } from "../content/misi-gabung-surveilans-genomik";
import { misiGabungVcfLaporan } from "../content/misi-gabung-vcf-ke-laporan";
// CAPSTONE grup AI (koordinator 2026-10-15): 8 misi kombinasi AI/ML
import { misiGabungAtribusi } from "../content/misi-gabung-atribusi-model";
import { misiGabungNotebook } from "../content/misi-gabung-notebook-produksi";
import { misiGabungTraining } from "../content/misi-gabung-training-skala";
import { misiGabungServing } from "../content/misi-gabung-serving-llm";
import { misiGabungEvaluasi } from "../content/misi-gabung-evaluasi-agen";
import { misiGabungRagAgen } from "../content/misi-gabung-rag-agen";
import { misiGabungBiayaAgen } from "../content/misi-gabung-biaya-agen";
import { misiGabungPipeline } from "../content/misi-gabung-pipeline-alpha";
// M2 grup DATA-ENGINEERING (koordinator 2026-10-15): 8 misi Python/SQL/Data Engineer/Data Management
import { misiPipelineKotor } from "../content/misi-pipeline-kotor-python";
import { misiKegagalanDiam } from "../content/misi-kegagalan-diam-pipeline";
import { misiLaporanBulanan } from "../content/misi-laporan-bulanan-sql";
import { misiDuaSumberSql } from "../content/misi-dua-sumber-tidak-cocok";
import { misiEtlTelat } from "../content/misi-etl-telat-backfill";
import { misiKontrakSkema } from "../content/misi-kontrak-skema-retak";
import { misiKatalogData } from "../content/misi-katalog-data-hilang";
import { misiLineageTerputus } from "../content/misi-lineage-terputus";
// Capstone grup RISIKO-FINANCE (koordinator 2026-10-15): 9 misi C kombinasi
import { misiGabungBerkas } from "../content/misi-gabung-berkas-ganda";
import { misiGabungJejakLapis } from "../content/misi-gabung-jejak-lapis";
import { misiGabungStressPortofolio } from "../content/misi-gabung-stress-portofolio";
import { misiGabungDashboardAuditor } from "../content/misi-gabung-dashboard-auditor";
import { misiGabungUjiAb } from "../content/misi-gabung-uji-ab-jujur";
import { misiGabungMonteCarlo } from "../content/misi-gabung-monte-carlo";
import { misiGabungRebalanceKrisis } from "../content/misi-gabung-rebalance-krisis";
import { misiGabungAnggaranRisiko } from "../content/misi-gabung-anggaran-risiko";
import { misiGabungJembatanLintas } from "../content/misi-gabung-jembatan-lintas";

export const REG_MISI: Record<string, V2Mission> = {
  "misi-dbd-surveilans": misiDbd,
  "misi-jejak-dana-blockchain": misiJejakDana,
  "misi-lab-sampel-tertukar": misiLabTertukar,
  "misi-var-backtest": misiVar,
  "misi-stress-korelasi": misiStress,
  "misi-rekonsiliasi-laporan": misiRekonsiliasi,
  "misi-laporan-dua-sumber": misiDuaSumber,
  "misi-pinjaman-pertama": misiPinjamanPertama,
  "misi-npl-tersembunyi": misiNplTersembunyi,
  "misi-kartu-hantu": misiKartuHantu,
  "misi-jaring-mule": misiJaringMule,
  "misi-audit-imunisasi-who": misiAuditImunisasi,
  "misi-kontaminasi-platform": misiKontaminasi,
  "misi-orakel-buta-blockchain": misiOrakelButa,
  "misi-migrasi-tanpa-downtime": misiMigrasi,
  "misi-indeks-hantu": misiIndeksHantu,
  "misi-dashboard-regulator": misiDashboardRegulator,
  "misi-dua-definisi-revenue": misiDuaDefinisi,
  "misi-diagnosa-overfitting": misiOverfit,
  "misi-kebocoran-fitur": misiLeakage,
  "misi-neuron-mati": misiDeadNeuron,
  "misi-jadwal-lr": misiLrSched,
  "misi-drift-produksi": misiDrift,
  "misi-pipeline-tak-reproduksibel": misiRepro,
  "misi-biaya-inferensi": misiInferCost,
  "misi-halusinasi-monitor": misiHalu,
  "misi-grounding-rag": misiRag,
  "misi-chunking-buruk": misiChunk,
  "misi-audit-agen": misiAgentAudit,
  "misi-loop-tak-berujung": misiLoopAgen,
  "misi-triage-alpha": misiTriage,
  "misi-turnover-trap": misiTurnover,
  "misi-sampel-menyanjung": misiSampelMenyanjung,
  "misi-taman-p-hack": misiTamanPHack,
  "misi-bayes-terbalik": misiBayesTerbalik,
  "misi-kehancuran-penjudi": misiKehancuranPenjudi,
  "misi-kurva-menipu": misiKurvaMenipu,
  "misi-arbitrase-rapi": misiArbitraseRapi,
  "misi-markowitz-optimis": misiMarkowitz,
  "misi-rebalance-frenesi": misiRebalance,
  "misi-atribusi-menipu": misiAtribusi,
  "misi-ab-berhenti-dini": misiAbBerhentiDini,
  // M2 grup DATA-ENGINEERING (koordinator 2026-10-15): 8 misi Python/SQL/Data Engineer/Data Management
  "misi-pipeline-kotor-python": misiPipelineKotor,
  "misi-kegagalan-diam-pipeline": misiKegagalanDiam,
  "misi-laporan-bulanan-sql": misiLaporanBulanan,
  "misi-dua-sumber-tidak-cocok": misiDuaSumberSql,
  "misi-etl-telat-backfill": misiEtlTelat,
  "misi-kontrak-skema-retak": misiKontrakSkema,
  "misi-katalog-data-hilang": misiKatalogData,
  "misi-lineage-terputus": misiLineageTerputus,
  // CAPSTONE grup DATA (koordinator 2026-10-15): 8 misi kombinasi — record lama tidak diubah
  "misi-gabung-pipeline-kotor": misiGabungPipelineKotor,
  "misi-gabung-query-ke-dashboard": misiGabungQueryDashboard,
  "misi-gabung-lineage-governance": misiGabungLineageGovernance,
  "misi-gabung-feature-store": misiGabungFeatureStore,
  "misi-gabung-migrasi-warisan": misiGabungMigrasiWarisan,
  "misi-gabung-dashboard-jujur": misiGabungDashboardJujur,
  "misi-gabung-surveilans-genomik": misiGabungSurveilansGenomik,
  "misi-gabung-vcf-ke-laporan": misiGabungVcfLaporan,
  // CAPSTONE grup AI (koordinator 2026-10-15): 8 misi kombinasi AI/ML — record lama tidak diubah
  "misi-gabung-atribusi-model": misiGabungAtribusi,
  "misi-gabung-notebook-produksi": misiGabungNotebook,
  "misi-gabung-training-skala": misiGabungTraining,
  "misi-gabung-serving-llm": misiGabungServing,
  "misi-gabung-evaluasi-agen": misiGabungEvaluasi,
  "misi-gabung-rag-agen": misiGabungRagAgen,
  "misi-gabung-biaya-agen": misiGabungBiayaAgen,
  "misi-gabung-pipeline-alpha": misiGabungPipeline,
  // CAPSTONE grup RISIKO-FINANCE (koordinator 2026-10-15): 9 misi C kombinasi — record lama tidak diubah
  "misi-gabung-berkas-ganda": misiGabungBerkas,
  "misi-gabung-jejak-lapis": misiGabungJejakLapis,
  "misi-gabung-stress-portofolio": misiGabungStressPortofolio,
  "misi-gabung-dashboard-auditor": misiGabungDashboardAuditor,
  "misi-gabung-uji-ab-jujur": misiGabungUjiAb,
  "misi-gabung-monte-carlo": misiGabungMonteCarlo,
  "misi-gabung-rebalance-krisis": misiGabungRebalanceKrisis,
  "misi-gabung-anggaran-risiko": misiGabungAnggaranRisiko,
  "misi-gabung-jembatan-lintas": misiGabungJembatanLintas,
};
