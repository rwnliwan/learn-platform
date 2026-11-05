// Bedah Buku — Gelombang 1 (G1): Rak Buku + paket Bab 1–3.
//
// Buku pilot: "The Elements of Quantitative Investing" — Giuseppe A. Paleologo
// (Wiley, 2025). File EPUB milik Septian terverifikasi (ISBN ePub
// 9781394265466, tanpa DRM), dipecah per bab di ~/workspace/bedah-buku/chapters/.
//
// Struktur mengikuti pola Gelombang P/Q: page.tsx (server wrapper) +
// <Nama>Client.tsx ("use client") + <nama>.css + tipe/data di lib/.
// Konten murni aditif: tidak menyentuh lesson/registry/cardData.

export interface BukuKonsep {
  nama: string;
  definisi: string;
  relasi?: string;
  contoh?: string;
}

export interface BukuDeepDivePoin {
  judul: string; // judul singkat butir
  isi: string; // boleh mengandung $...$ inline (KaTeX)
  /** Bila butir berasal dari teks `jebakan` deep dive → render dengan aksen
   *  warna peringatan + chip "Jebakan"; poin fakta tidak memakai field ini. */
  nada?: "jebakan";
}

export interface BukuDeepDive {
  judul: string;
  ringkas: string; // satu kalimat pengait — tampil di kartu akordeon tertutup
  definisi: string;
  kenapa: string;
  contoh: string;
  jebakan: string;
  /** Bila ada: definisi panjang dipecah jadi kartu mini bernomor; definisi
   *  sendiri cukup 1–2 kalimat pembuka (tanpa pengulangan dobel). */
  poin?: BukuDeepDivePoin[];
}

export interface BukuPrediksi {
  id: string; // "P1"
  pertanyaan: string;
  kunci: string; // "K1" — dibuka hanya setelah pengguna menjawab
}

export interface BukuKuisSoal {
  pertanyaan: string;
  opsi: string[]; // opsi jawaban, urutan tampil apa adanya
  benar: number; // indeks opsi yang benar (0-based)
  penjelasan: string;
}

export interface BukuKartuFsrs {
  depan: string;
  belakang: string;
}

export interface BukuFeynman {
  poin: string;
  penajaman: string;
}

// ---------------------------------------------------------------------------
// Gelombang Poles — Blok Rumus & Peta Konsep (tipe dikunci: worker komponen
// mengandalkan nama + bentuk ini persis).
// Aturan LaTeX di data: `latex` = LaTeX display TANPA pembungkus $$;
// `simbol` = LaTeX inline TANPA pembungkus $; string langkah/hasil/jebakan
// dan teks pack boleh mengandung $...$ inline. Koma desimal Indonesia di
// dalam math ditulis {,} (mis. 3{,}9).
// ---------------------------------------------------------------------------

export interface BukuRumusVariabel {
  simbol: string; // LaTeX inline TANPA pembungkus $
  arti: string;
}

export interface BukuRumus {
  id: string;
  judul: string;
  latex: string; // LaTeX display TANPA pembungkus $$
  variabel: BukuRumusVariabel[];
  langkah: string[]; // boleh mengandung $...$ inline
  hasil: string; // boleh mengandung $...$ inline
  jebakan?: string; // boleh mengandung $...$ inline
}

export interface PetaNode {
  id: string;
  label: string;
  x: number;
  y: number;
  konsepId?: number; // indeks ke array `konsep` untuk panel detail
}

export interface PetaVia {
  x: number;
  y: number;
}

export interface PetaEdge {
  from: string;
  to: string;
  label?: string;
  /** Titik bantu rute (opsional): edge digambar lurus melewati titik-titik ini
   *  agar tidak menembus simpul lain; label ditaruh di tengah rute. */
  via?: PetaVia[];
}

export interface BukuPeta {
  nodes: PetaNode[];
  edges: PetaEdge[];
}

export interface AudioInfo {
  src: string; // URL publik, mis. /v2/buku/audio/bab-1-podcast.mp3
  label: string;
  durasi?: string;
}

export interface ChapterPack {
  slug: string; // "bab-1"
  bab: number;
  judul: string; // judul bab English (asli)
  catatan?: string; // catatan redaksi paket (opsional)
  ideBesar: string;
  diagram: string; // ASCII diagram peta konsep (render sebagai <pre>)
  konsep: BukuKonsep[];
  deepDive: BukuDeepDive[];
  cheatsheet: string; // teks markdown-lite (fence ```, tabel |, heading ###, list, quote)
  prediksi: BukuPrediksi[];
  kuis: BukuKuisSoal[];
  fsrs: BukuKartuFsrs[];
  feynman: BukuFeynman[];
  podcast?: AudioInfo; // bila sudah diproduksi
  podcastPending?: boolean; // true → tampil "sedang diproduksi"
  narasi?: AudioInfo; // narasi TTS ringkasan
  rumus?: BukuRumus[]; // Blok Rumus (Gelombang Poles)
  peta?: BukuPeta; // Peta Konsep interaktif (Gelombang Poles)
}

export interface BabMeta {
  bab: number;
  judul: string;
  slug: string;
  aktif: boolean; // false → "Gelombang berikutnya" (nonaktif, jujur)
  gelombang: number; // 1..5
}

export const BUKU = {
  judul: "The Elements of Quantitative Investing",
  penulis: "Giuseppe A. Paleologo",
  penerbit: "Wiley",
  tahun: 2025,
  isbnEpub: "9781394265466",
  ringkasan:
    "Panduan komprehensif investasi kuantitatif dari praktisi: dari sifat statistik return, factor models, sampai konstruksi portofolio dan atribusi kinerja — ditulis dari pengalaman mengelola puluhan miliar dolar di hedge fund terbesar dunia.",
} as const;

export const BABS: BabMeta[] = [
  { bab: 1, judul: "The Map and the Territory", slug: "bab-1", aktif: true, gelombang: 1 },
  { bab: 2, judul: "Univariate Returns", slug: "bab-2", aktif: true, gelombang: 1 },
  { bab: 3, judul: "Interlude: What Is Performance?", slug: "bab-3", aktif: true, gelombang: 1 },
  { bab: 4, judul: "Linear Models of Returns", slug: "bab-4", aktif: true, gelombang: 2 },
  { bab: 5, judul: "Evaluating Risk", slug: "bab-5", aktif: true, gelombang: 2 },
  { bab: 6, judul: "Fundamental Factor Models", slug: "bab-6", aktif: true, gelombang: 2 },
  { bab: 7, judul: "Statistical Factor Models", slug: "bab-7", aktif: false, gelombang: 3 },
  { bab: 8, judul: "Evaluating Excess Returns", slug: "bab-8", aktif: false, gelombang: 3 },
  { bab: 9, judul: "Portfolio Management: The Basics", slug: "bab-9", aktif: false, gelombang: 3 },
  { bab: 10, judul: "Beyond Simple Mean-Variance", slug: "bab-10", aktif: false, gelombang: 4 },
  { bab: 11, judul: "Market-Impact-Aware Portfolio Management", slug: "bab-11", aktif: false, gelombang: 4 },
  { bab: 12, judul: "Hedging", slug: "bab-12", aktif: false, gelombang: 4 },
  { bab: 13, judul: "Dynamic Risk Allocation", slug: "bab-13", aktif: false, gelombang: 5 },
  { bab: 14, judul: "Ex-Post Performance Attribution", slug: "bab-14", aktif: false, gelombang: 5 },
  { bab: 15, judul: "A Coda about Leitmotifs", slug: "bab-15", aktif: false, gelombang: 5 },
];

export function getBabMeta(slug: string): BabMeta | null {
  return BABS.find((b) => b.slug === slug) ?? null;
}

// Packs diisi sub-pekerjaan konversi (bedahbuku-pack{1,2,3}.ts).
import { PACK1 } from "./bedahbuku-pack1";
import { PACK2 } from "./bedahbuku-pack2";
import { PACK3 } from "./bedahbuku-pack3";
import { PACK4 } from "./bedahbuku-pack4";
import { PACK5 } from "./bedahbuku-pack5";
import { PACK6 } from "./bedahbuku-pack6";

const PACK_MAP: Record<string, ChapterPack> = {
  "bab-1": PACK1,
  "bab-2": PACK2,
  "bab-3": PACK3,
  "bab-4": PACK4,
  "bab-5": PACK5,
  "bab-6": PACK6,
};

export function getPack(slug: string): ChapterPack | null {
  return PACK_MAP[slug] ?? null;
}

// ---------------------------------------------------------------------------
// Audio (aset statis di public/v2/buku/audio/, disalin saat build G1).
// Narasi TTS dirender sub-pekerjaan paralel; bila file belum ada, pemutar
// menyembunyikan diri (onError) — tidak pernah menampilkan pemutar mati.
// ---------------------------------------------------------------------------

export const PODCAST: Record<string, AudioInfo> = {
  "bab-1": {
    src: "/v2/buku/audio/bab-1-podcast.mp3",
    label: "Podcast Gemini — Anatomi Investasi Kuantitatif",
    durasi: "±22 menit",
  },
  "bab-2": {
    src: "/v2/buku/audio/bab-2-podcast.mp3",
    label: "Podcast Gemini — Matematika Volatilitas dan Ilusi Harga Saham",
    durasi: "16:35",
  },
  "bab-3": {
    src: "/v2/buku/audio/bab-3-podcast.mp3",
    label: "Podcast Gemini — Empat Metrik Kinerja Portofolio Kuantitatif",
    durasi: "25:57",
  },
  "bab-4": {
    src: "/v2/buku/audio/bab-4-podcast.mp3",
    label: "Podcast Gemini — Anatomi Model Linear Imbal Hasil",
    durasi: "24:13",
  },
  "bab-5": {
    src: "/v2/buku/audio/bab-5-podcast.mp3",
    label: "Podcast Gemini — Jebakan R-squared Dalam Evaluasi Model Risiko",
    durasi: "26:56",
  },
  "bab-6": {
    src: "/v2/buku/audio/bab-6-podcast.mp3",
    label: "Podcast Gemini — Rahasia Model Faktor Fundamental Wall Street",
    durasi: "23:39",
  },
};

export const NARASI: Record<string, AudioInfo> = {
  "bab-1": { src: "/v2/buku/audio/bab-1-narasi.mp3", label: "Dengarkan ringkasan" },
  "bab-2": { src: "/v2/buku/audio/bab-2-narasi.mp3", label: "Dengarkan ringkasan" },
  "bab-3": { src: "/v2/buku/audio/bab-3-narasi.mp3", label: "Dengarkan ringkasan" },
  "bab-4": { src: "/v2/buku/audio/bab-4-narasi.mp3", label: "Dengarkan ringkasan" },
  "bab-5": { src: "/v2/buku/audio/bab-5-narasi.mp3", label: "Dengarkan ringkasan" },
  "bab-6": { src: "/v2/buku/audio/bab-6-narasi.mp3", label: "Dengarkan ringkasan" },
};

/** Tempelkan info audio ke paket bab. podcastPending=true → UI "sedang diproduksi". */
export function withAudio(pack: ChapterPack): ChapterPack {
  const podcast = PODCAST[pack.slug];
  const narasi = NARASI[pack.slug];
  return {
    ...pack,
    podcast,
    narasi,
    podcastPending: !podcast,
  };
}
