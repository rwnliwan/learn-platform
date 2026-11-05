// AI Runtime foundation — Gelombang M (fondasi untuk Feynman Gate, AI
// Penyanggah, Silent Mentor Network, Interview Simulator).
//
// Desain (keputusan Septian): BYOK dari halaman Pengaturan AI — base URL +
// API key + model diisi user, tersimpan LOKAL di browser (localStorage).
// Browser memanggil endpoint provider langsung (format OpenAI-compatible);
// TIDAK ada backend, TIDAK ada proxy, biaya server tetap nol.
// API key tidak pernah ditulis ke log, tidak ditampilkan penuh di UI,
// dan hanya dikirim ke base URL yang dikonfigurasi user.
//
// Gelombang N–Q memanggil chatComplete({ messages, feature, ... }) dengan
// feature masing-masing ("feynman", "penyanggah", "mentor", "interview").
// Halaman ini (/v2/pengaturan-ai) memakai feature "test" dan "sandbox".

export type AiPresetId = "kelontong" | "metamodel" | "custom";

export interface AiPreset {
  id: AiPresetId;
  label: string;
  desc: string;
  /** Placeholder/hint untuk base URL. "" = wajib diisi manual oleh user. */
  baseUrlHint: string;
  /** Placeholder/hint untuk nama model. "" = wajib diisi manual oleh user. */
  modelHint: string;
}

export const AI_PRESETS: AiPreset[] = [
  {
    id: "kelontong",
    label: "Kelontong AI",
    desc: "Provider coin-based (paling hemat & cepat menurut Septian). Ambil base URL dan API key dari dashboard Kelontong AI-mu.",
    baseUrlHint: "Base URL dari dashboard Kelontong AI, mis. https://…/v1",
    modelHint: "Nama model dari dashboard Kelontong AI",
  },
  {
    id: "metamodel",
    label: "Meta Model API",
    desc: "API resmi Meta (dev.meta.ai) — model Muse Wonder. Buat API key di dev.meta.ai. Catatan: kelayakan Indonesia belum terkonfirmasi saat Gelombang M dibangun.",
    baseUrlHint: "Base URL Meta Model API dari dokumentasi dev.meta.ai",
    modelHint: "mis. muse-wonder",
  },
  {
    id: "custom",
    label: "Kustom (OpenAI-compatible)",
    desc: "Provider lain apa pun yang mendukung endpoint POST /chat/completions ala OpenAI.",
    baseUrlHint: "mis. https://api.provider.com/v1",
    modelHint: "Nama model provider tersebut",
  },
];

export interface AiConfig {
  preset: AiPresetId;
  baseUrl: string;
  apiKey: string;
  model: string;
}

export interface AiMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export type AiFeature =
  | "feynman"
  | "penyanggah"
  | "mentor"
  | "interview"
  | "sandbox"
  | "test";

export interface AiUsage {
  promptTokens: number;
  completionTokens: number;
  /** true bila provider tidak mengirim usage dan kami mengestimasi dari panjang teks. */
  estimated: boolean;
}

export interface AiResult {
  text: string;
  usage: AiUsage;
  latencyMs: number;
}

export type AiErrorKind =
  | "not_configured"
  | "network"
  | "auth"
  | "rate_limit"
  | "server"
  | "bad_response"
  | "cancelled";

/** Error ternormalisasi dengan pesan Bahasa Indonesia siap tampil ke pengguna. */
export class AiError extends Error {
  readonly kind: AiErrorKind;
  constructor(kind: AiErrorKind, message: string) {
    super(message);
    this.name = "AiError";
    this.kind = kind;
  }
}

const CONFIG_KEY = "v2:ai:config";
const LEDGER_KEY = "v2:ai:usage";
const LEDGER_MAX = 500;

export function presetLabel(id: AiPresetId): string {
  return AI_PRESETS.find((p) => p.id === id)?.label ?? id;
}

/** Membaca konfigurasi dari localStorage. null bila belum pernah disimpan. */
export function loadAiConfig(): AiConfig | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Partial<AiConfig>;
    return {
      preset: c.preset === "metamodel" || c.preset === "custom" ? c.preset : "kelontong",
      baseUrl: typeof c.baseUrl === "string" ? c.baseUrl : "",
      apiKey: typeof c.apiKey === "string" ? c.apiKey : "",
      model: typeof c.model === "string" ? c.model : "",
    };
  } catch {
    return null;
  }
}

/** Menyimpan konfigurasi ke localStorage. */
export function saveAiConfig(cfg: AiConfig): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
}

/** Menghapus konfigurasi dari localStorage. */
export function clearAiConfig(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(CONFIG_KEY);
}

/** Terkonfigurasi = base URL + API key + model semuanya terisi. */
export function isAiConfigured(cfg: AiConfig | null): cfg is AiConfig {
  return (
    cfg !== null &&
    cfg.baseUrl.trim().length > 0 &&
    cfg.apiKey.trim().length > 0 &&
    cfg.model.trim().length > 0
  );
}

export interface ChatOptions {
  messages: AiMessage[];
  feature: AiFeature;
  temperature?: number;
  maxTokens?: number;
  /** Dipakai gelombang N–Q untuk membedakan panggilan di ledger. */
  signal?: AbortSignal;
}

const CHAT_TIMEOUT_MS = 60000;

/** Estimasi kasar token dari panjang teks (±1 token ≈ 4 karakter). */
export function estimateTokens(text: string): number {
  return Math.max(1, Math.ceil(text.length / 4));
}

function chatUrl(baseUrl: string): string {
  const b = baseUrl.trim().replace(/\/+$/, "");
  if (b.endsWith("/chat/completions")) return b;
  return b + "/chat/completions";
}

/**
 * Panggilan chat tunggal ke provider yang dikonfigurasi.
 * Mencatat pemakaian ke ledger localStorage setiap panggilan berhasil.
 * Throw AiError dengan kind yang ternormalisasi bila gagal.
 */
export async function chatComplete(opts: ChatOptions): Promise<AiResult> {
  const cfg = loadAiConfig();
  if (!isAiConfigured(cfg)) {
    throw new AiError(
      "not_configured",
      "AI belum dikonfigurasi. Buka Pengaturan AI untuk mengisi base URL, API key, dan model."
    );
  }
  const url = chatUrl(cfg.baseUrl);
  const startedAt = performance.now();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), CHAT_TIMEOUT_MS);
  const signal = opts.signal ?? ctrl.signal;

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + cfg.apiKey,
      },
      body: JSON.stringify({
        model: cfg.model,
        messages: opts.messages,
        temperature: opts.temperature ?? 0.3,
        max_tokens: opts.maxTokens ?? 800,
      }),
      signal,
    });
  } catch (e) {
    clearTimeout(timer);
    if (e instanceof DOMException && e.name === "AbortError") {
      throw new AiError(
        "cancelled",
        "Permintaan ke AI dibatalkan (timeout " + CHAT_TIMEOUT_MS / 1000 + " detik)."
      );
    }
    // fetch TypeError mencakup: DNS gagal, koneksi ditolak, dan CORS
    // diblokir browser (body respons tidak terbaca apa pun alasannya).
    throw new AiError(
      "network",
      "Tidak bisa menghubungi " +
        cfg.baseUrl +
        ". Kemungkinan: tidak ada koneksi internet, base URL salah, atau browser memblokir respons lintas-domain (kebijakan CORS provider). Coba tombol Tes koneksi di Pengaturan AI."
    );
  }
  clearTimeout(timer);
  const latencyMs = Math.round(performance.now() - startedAt);

  if (res.status === 401 || res.status === 403) {
    throw new AiError(
      "auth",
      "API key ditolak provider (HTTP " + res.status + "). Periksa kembali API key dan nama model di Pengaturan AI."
    );
  }
  if (res.status === 429) {
    throw new AiError(
      "rate_limit",
      "Provider membatasi laju permintaan (HTTP 429). Tunggu sebentar lalu coba lagi."
    );
  }
  if (res.status >= 500) {
    throw new AiError(
      "server",
      "Server provider bermasalah (HTTP " + res.status + "). Coba lagi nanti."
    );
  }
  if (!res.ok) {
    throw new AiError(
      "server",
      "Provider mengembalikan HTTP " + res.status + ". Periksa base URL di Pengaturan AI."
    );
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new AiError(
      "bad_response",
      "Respons provider bukan JSON yang valid. Periksa base URL di Pengaturan AI."
    );
  }
  const choice = (data as { choices?: { message?: { content?: unknown } }[] })?.choices?.[0];
  const text = typeof choice?.message?.content === "string" ? choice.message.content : "";
  if (!text) {
    throw new AiError(
      "bad_response",
      "Respons provider tidak memuat teks jawaban (choices kosong). Kemungkinan format API tidak OpenAI-compatible."
    );
  }

  const u = (data as { usage?: { prompt_tokens?: unknown; completion_tokens?: unknown } })?.usage;
  let usage: AiUsage;
  if (typeof u?.prompt_tokens === "number" && typeof u?.completion_tokens === "number") {
    usage = { promptTokens: u.prompt_tokens, completionTokens: u.completion_tokens, estimated: false };
  } else {
    const promptText = opts.messages.map((m) => m.content).join("\n");
    usage = {
      promptTokens: estimateTokens(promptText),
      completionTokens: estimateTokens(text),
      estimated: true,
    };
  }

  logUsage({
    ts: Date.now(),
    feature: opts.feature,
    model: cfg.model,
    promptTokens: usage.promptTokens,
    completionTokens: usage.completionTokens,
    estimated: usage.estimated,
  });

  return { text, usage, latencyMs };
}

export interface UsageEntry {
  ts: number;
  feature: AiFeature;
  model: string;
  promptTokens: number;
  completionTokens: number;
  estimated: boolean;
}

/** Mencatat satu panggilan ke ledger localStorage (capped, best-effort). */
export function logUsage(entry: UsageEntry): void {
  if (typeof localStorage === "undefined") return;
  try {
    const raw = localStorage.getItem(LEDGER_KEY);
    const arr: UsageEntry[] = raw ? JSON.parse(raw) : [];
    arr.push(entry);
    const trimmed = arr.length > LEDGER_MAX ? arr.slice(arr.length - LEDGER_MAX) : arr;
    localStorage.setItem(LEDGER_KEY, JSON.stringify(trimmed));
  } catch {
    /* ledger bersifat best-effort: kegagalan catat tidak boleh menggagalkan fitur */
  }
}

/** Membaca seluruh ledger pemakaian. */
export function getUsageLedger(): UsageEntry[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(LEDGER_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as UsageEntry[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

/** Menghapus seluruh ledger pemakaian. */
export function clearUsageLedger(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(LEDGER_KEY);
}

export interface UsageSummary {
  calls: number;
  promptTokens: number;
  completionTokens: number;
  estimatedCount: number;
  byFeature: Record<string, { calls: number; promptTokens: number; completionTokens: number }>;
}

/** Ringkasan pemakaian: total + per feature. */
export function getUsageSummary(): UsageSummary {
  const ledger = getUsageLedger();
  const byFeature: UsageSummary["byFeature"] = {};
  let promptTokens = 0;
  let completionTokens = 0;
  let estimatedCount = 0;
  for (const e of ledger) {
    promptTokens += e.promptTokens;
    completionTokens += e.completionTokens;
    if (e.estimated) estimatedCount += 1;
    const f = byFeature[e.feature] ?? { calls: 0, promptTokens: 0, completionTokens: 0 };
    f.calls += 1;
    f.promptTokens += e.promptTokens;
    f.completionTokens += e.completionTokens;
    byFeature[e.feature] = f;
  }
  return { calls: ledger.length, promptTokens, completionTokens, estimatedCount, byFeature };
}
