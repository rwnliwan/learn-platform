// Pengaturan AI — Gelombang M (AI runtime foundation).
// Semua state localStorage dibaca di useEffect (bukan initializer useState)
// agar HTML prerender cocok dengan render awal (pelajaran Gelombang J).
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AI_PRESETS,
  AiConfig,
  AiError,
  AiPresetId,
  chatComplete,
  clearAiConfig,
  clearUsageLedger,
  getUsageSummary,
  isAiConfigured,
  loadAiConfig,
  presetLabel,
  saveAiConfig,
  UsageSummary,
} from "../lib/ai";

const FEATURE_LABELS: Record<string, string> = {
  feynman: "Feynman Gate",
  penyanggah: "AI Penyanggah",
  mentor: "Silent Mentor",
  interview: "Interview Simulator",
  sandbox: "Coba AI",
  test: "Tes koneksi",
};

type TestState =
  | { status: "idle" }
  | { status: "running" }
  | { status: "ok"; text: string; latencyMs: number }
  | { status: "error"; kind: string; message: string };

export default function AiSettingsClient() {
  // Konfigurasi dibaca setelah mount — hindari hydration mismatch.
  const [config, setConfig] = useState<AiConfig | null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setConfig(loadAiConfig());
    setLoaded(true);
  }, []);

  const [preset, setPreset] = useState<AiPresetId>("kelontong");
  const [baseUrl, setBaseUrl] = useState("");
  const [model, setModel] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  const [testState, setTestState] = useState<TestState>({ status: "idle" });
  const [sandboxPrompt, setSandboxPrompt] = useState("");
  const [sandboxOut, setSandboxOut] = useState<TestState>({ status: "idle" });
  const [usage, setUsage] = useState<UsageSummary | null>(null);

  useEffect(() => {
    const c = loadAiConfig();
    if (c) {
      setPreset(c.preset);
      setBaseUrl(c.baseUrl);
      setModel(c.model);
      setApiKey(c.apiKey);
    }
    setUsage(getUsageSummary());
  }, [loaded]);

  const presetInfo = AI_PRESETS.find((p) => p.id === preset);

  const onSave = () => {
    saveAiConfig({ preset, baseUrl: baseUrl.trim(), apiKey: apiKey.trim(), model: model.trim() });
    setConfig(loadAiConfig());
    setUsage(getUsageSummary());
    setSavedMsg("Konfigurasi tersimpan di browser ini.");
    setTimeout(() => setSavedMsg(""), 3000);
  };

  const onClear = () => {
    clearAiConfig();
    setConfig(null);
    setSavedMsg("Konfigurasi dihapus.");
    setTimeout(() => setSavedMsg(""), 3000);
  };

  const onTest = async () => {
    setTestState({ status: "running" });
    try {
      const r = await chatComplete({
        messages: [{ role: "user", content: "Balas hanya dengan kata: OK" }],
        feature: "test",
        temperature: 0,
        maxTokens: 8,
      });
      setTestState({ status: "ok", text: r.text, latencyMs: r.latencyMs });
    } catch (e) {
      const err = e instanceof AiError ? e : new AiError("server", "Kesalahan tak dikenal.");
      setTestState({ status: "error", kind: err.kind, message: err.message });
    }
    setUsage(getUsageSummary());
  };

  const onSandbox = async () => {
    if (!sandboxPrompt.trim()) return;
    setSandboxOut({ status: "running" });
    try {
      const r = await chatComplete({
        messages: [{ role: "user", content: sandboxPrompt.trim() }],
        feature: "sandbox",
        maxTokens: 600,
      });
      setSandboxOut({ status: "ok", text: r.text, latencyMs: r.latencyMs });
    } catch (e) {
      const err = e instanceof AiError ? e : new AiError("server", "Kesalahan tak dikenal.");
      setSandboxOut({ status: "error", kind: err.kind, message: err.message });
    }
    setUsage(getUsageSummary());
  };

  const onResetUsage = () => {
    clearUsageLedger();
    setUsage(getUsageSummary());
  };

  const configured = isAiConfigured(config);

  return (
    <div className="ai-wrap">
      <p className="ai-intro">
        Fitur AI Learn v2 (Feynman Gate, AI Penyanggah, Silent Mentor, Interview
        Simulator) berjalan di atas <b>AI runtime</b> ini. Kamu membawa kuncimu
        sendiri: isi base URL + API key + model dari provider pilihanmu —
        browser memanggil provider itu langsung, tanpa server perantara.
      </p>

      {/* Status */}
      <div className={`ai-status ${configured ? "ai-ok" : "ai-off"}`} role="status">
        {configured ? (
          <>
            <b>Terhubung.</b> Preset {presetLabel(config.preset)} · model{" "}
            <code>{config.model}</code>
          </>
        ) : (
          <>
            <b>Belum dikonfigurasi.</b>{" "}
            {loaded ? "Isi form di bawah lalu simpan." : "Memuat…"}
          </>
        )}
      </div>

      {/* Form konfigurasi */}
      <section className="ai-card" aria-label="Konfigurasi provider">
        <h2 className="ai-h2">Konfigurasi provider</h2>
        <div className="ai-field">
          <label htmlFor="ai-preset">Preset</label>
          <select
            id="ai-preset"
            value={preset}
            onChange={(e) => setPreset(e.target.value as AiPresetId)}
          >
            {AI_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          {presetInfo && <p className="ai-mut">{presetInfo.desc}</p>}
        </div>
        <div className="ai-field">
          <label htmlFor="ai-baseurl">Base URL</label>
          <input
            id="ai-baseurl"
            type="text"
            inputMode="url"
            value={baseUrl}
            placeholder={presetInfo?.baseUrlHint}
            onChange={(e) => setBaseUrl(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="ai-field">
          <label htmlFor="ai-model">Model</label>
          <input
            id="ai-model"
            type="text"
            value={model}
            placeholder={presetInfo?.modelHint}
            onChange={(e) => setModel(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="ai-field">
          <label htmlFor="ai-key">API key</label>
          <div className="ai-keyrow">
            <input
              id="ai-key"
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              autoComplete="off"
              placeholder="Tempel API key provider-mu di sini"
            />
            <button
              type="button"
              className="ai-ghost"
              onClick={() => setShowKey((s) => !s)}
              aria-pressed={showKey}
            >
              {showKey ? "Sembunyikan" : "Intip"}
            </button>
          </div>
        </div>
        <div className="ai-actions">
          <button type="button" className="ai-btn" onClick={onSave}>
            Simpan
          </button>
          <button type="button" className="ai-ghost" onClick={onClear}>
            Hapus konfigurasi
          </button>
          {savedMsg && <span className="ai-saved">{savedMsg}</span>}
        </div>
        <p className="ai-mut ai-tight">
          Jujur soal keamanan: API key hanya tersimpan di browser ini
          (localStorage) dan hanya dikirim ke base URL yang kamu isi di atas.
          Tidak ada server Learn yang melihat atau menyimpan key-mu. Jangan
          tempel key di perangkat yang bukan milikmu.
        </p>
      </section>

      {/* Tes koneksi */}
      <section className="ai-card" aria-label="Tes koneksi">
        <h2 className="ai-h2">Tes koneksi</h2>
        <p className="ai-mut">
          Mengirim satu prompt singkat ke provider. Berguna untuk memastikan
          base URL, key, dan model-mu benar — termasuk mendeteksi bila browser
          memblokir respons (kebijakan CORS provider).
        </p>
        <button type="button" className="ai-btn" onClick={onTest}>
          Tes koneksi
        </button>
        <TestResult state={testState} />
      </section>

      {/* Sandbox */}
      <section className="ai-card" aria-label="Coba AI">
        <h2 className="ai-h2">Coba AI</h2>
        <p className="ai-mut">
          Kotak percobaan bebas untuk memverifikasi koneksimu end-to-end.
          Pemakaian di sini ikut tercatat di panel pemakaian.
        </p>
        <div className="ai-field">
          <label htmlFor="ai-sandbox">Prompt</label>
          <textarea
            id="ai-sandbox"
            rows={3}
            value={sandboxPrompt}
            placeholder="Tulis prompt apa pun untuk dicoba…"
            onChange={(e) => setSandboxPrompt(e.target.value)}
          />
        </div>
        <button type="button" className="ai-btn" onClick={onSandbox}>
          Kirim
        </button>
        <TestResult state={sandboxOut} />
      </section>

      {/* Pemakaian */}
      <section className="ai-card" aria-label="Pemakaian token">
        <h2 className="ai-h2">Pemakaian</h2>
        {usage && usage.calls > 0 ? (
          <>
            <p className="ai-mut">
              <b>{usage.calls}</b> panggilan · masuk{" "}
              <b>{usage.promptTokens.toLocaleString("id-ID")}</b> token · keluar{" "}
              <b>{usage.completionTokens.toLocaleString("id-ID")}</b> token.
              {usage.estimatedCount > 0 &&
                ` (${usage.estimatedCount} panggilan memakai estimasi karena provider tidak mengirim angka usage.)`}
            </p>
            <table className="ai-table">
              <thead>
                <tr>
                  <th>Fitur</th>
                  <th>Panggilan</th>
                  <th>Masuk</th>
                  <th>Keluar</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(usage.byFeature).map(([f, s]) => (
                  <tr key={f}>
                    <td>{FEATURE_LABELS[f] ?? f}</td>
                    <td>{s.calls}</td>
                    <td>{s.promptTokens.toLocaleString("id-ID")}</td>
                    <td>{s.completionTokens.toLocaleString("id-ID")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" className="ai-ghost" onClick={onResetUsage}>
              Reset catatan pemakaian
            </button>
          </>
        ) : (
          <p className="ai-mut">
            Belum ada panggilan AI tercatat. Setiap panggilan dari fitur AI
            (termasuk tes & coba di halaman ini) akan dicatat di sini.
          </p>
        )}
      </section>

      <p className="ai-mut">
        Kembali ke <Link href="/v2">Beranda</Link>.
      </p>
    </div>
  );
}

function TestResult({ state }: { state: TestState }) {
  if (state.status === "idle") return null;
  if (state.status === "running")
    return (
      <p className="ai-mut" role="status">
        Menghubungi provider…
      </p>
    );
  if (state.status === "ok")
    return (
      <div className="ai-result ai-ok" role="status">
        <p>
          <b>Berhasil</b> — model menjawab dalam {state.latencyMs} ms:
        </p>
        <pre className="ai-pre">{state.text}</pre>
      </div>
    );
  return (
    <div className="ai-result ai-err" role="alert">
      <p>
        <b>Gagal</b> <span className="ai-kind">({state.kind})</span>
      </p>
      <p className="ai-mut">{state.message}</p>
    </div>
  );
}
