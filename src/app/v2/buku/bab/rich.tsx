"use client";

import React from "react";
import Tex from "@/components/Tex";

/**
 * RichInline — tokenizer ringan untuk teks konten Bedah Buku.
 *
 * Urutan tokenisasi:
 *  1. $$...$$            → blok rumus (KaTeX display) dalam kartu .bk-fcard
 *  2. $...$              → rumus inline, HANYA bila isinya mengandung [\^_{}]
 *                          (anti false-positive seperti "$5" atau "Rp 5.000")
 *  3. **tebal**, *miring*, `kode`
 *
 * Segmen teks biasa dirender sebagai React text node (auto-escape oleh React),
 * jadi tidak ada dangerouslySetInnerHTML untuk teks mentah — hanya lewat <Tex/>.
 */

type Token =
  | { kind: "text"; text: string }
  | { kind: "mathBlock"; math: string }
  | { kind: "mathInline"; math: string }
  | { kind: "bold"; inner: Token[] }
  | { kind: "italic"; inner: Token[] }
  | { kind: "code"; text: string };

/**
 * Isi $...$ dianggap rumus bila tampak seperti matematika.
 *
 * Guard anti false-positive (mis. "$5" sebagai harga) tetap ada, tetapi versi
 * lama terlalu ketat — ia menolak simbol polos seperti $K$, $|r|$, $= 3$,
 * $6$ sehingga tanda $ mentah bocor ke teks (temuan 2026-10-17, Bab 2).
 * Konvensi konten buku: nominal uang ditulis dengan kata ("lima dolar"),
 * jadi $...$ selalu diniatkan sebagai matematika.
 */
function looksLikeMath(s: string): boolean {
  const t = s.trim();
  if (!t) return false;
  // 1. Konstruk LaTeX eksplisit
  if (/[\\^_{}]/.test(t)) return true;
  // 2. Relasi / operator / simbol matematika khas
  if (/[=|<>≤≥≠±×÷·•≈≃∼→⇒←↔∞∂∇∑∏∫√∆∧∨¬∈∉]/.test(t)) return true;
  // 3. Operator aritmetika di antara dua operan, atau unar di depan token
  //    (mis. "ask - bid", "r_i - r_f", "- r_f")
  if (/[+\-*/^]\s*[0-9a-zA-Zα-ωΑ-Ω\\(|[{]/.test(t)) return true;
  if (/[0-9a-zA-Zα-ωΑ-Ω)\]|}]\s*[+\-*/^]/.test(t)) return true;
  // 4. Simbol tunggal: huruf/Greek (K, n, SR, ξ) atau angka pendek (6, 3).
  //    Pola uang (1,000 / 5.00) sengaja TIDAK lolos agar tetap literal.
  if (/^[a-zA-Zα-ωΑ-Ω]+$/.test(t)) return true;
  if (/^\d{1,2}$/.test(t)) return true;
  // 4b. Notasi fungsi/subskrip kurung: E[r], f(x), σ(r) — huruf diikuti satu
  //     grup kurung berisi konten sederhana (tanpa $). (temuan 2026-10-17:
  //     $E[r]$ bocor di Bab 3)
  if (/^[a-zA-Zα-ωΑ-Ω]+(\[[^\]$]*\]|\([^)$]*\))$/.test(t)) return true;
  return false;
}

/** Cari penutup '*' tunggal: '*' yang TIDAK diikuti '*' lain (agar '**' aman). */
function findItalicClose(text: string, from: number): number {
  let j = text.indexOf("*", from);
  while (j !== -1) {
    if (text[j + 1] !== "*") return j;
    j = text.indexOf("*", j + 2);
  }
  return -1;
}

function scan(text: string, allowBlock: boolean): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  let buf = "";
  const flush = () => {
    if (buf) {
      tokens.push({ kind: "text", text: buf });
      buf = "";
    }
  };

  while (i < text.length) {
    // 1. $$...$$ blok rumus
    if (allowBlock && text.startsWith("$$", i)) {
      const end = text.indexOf("$$", i + 2);
      if (end === -1) {
        buf += text[i];
        i++;
        continue;
      }
      flush();
      tokens.push({ kind: "mathBlock", math: text.slice(i + 2, end).trim() });
      i = end + 2;
      continue;
    }

    // 2. `kode` — diproses duluan supaya isi kode tidak ikut di-parse
    if (text[i] === "`") {
      const end = text.indexOf("`", i + 1);
      if (end === -1) {
        buf += text[i];
        i++;
        continue;
      }
      flush();
      tokens.push({ kind: "code", text: text.slice(i + 1, end) });
      i = end + 1;
      continue;
    }

    // 3. **tebal**
    if (text.startsWith("**", i)) {
      const end = text.indexOf("**", i + 2);
      if (end === -1) {
        buf += text[i];
        i++;
        continue;
      }
      flush();
      tokens.push({ kind: "bold", inner: scan(text.slice(i + 2, end), false) });
      i = end + 2;
      continue;
    }

    // 4. *miring*
    if (text[i] === "*") {
      const end = findItalicClose(text, i + 1);
      if (end === -1) {
        buf += text[i];
        i++;
        continue;
      }
      flush();
      tokens.push({ kind: "italic", inner: scan(text.slice(i + 1, end), false) });
      i = end + 1;
      continue;
    }

    // 5. $...$ rumus inline (dengan guard anti false-positive)
    if (text[i] === "$") {
      const end = text.indexOf("$", i + 1);
      if (end !== -1) {
        const inner = text.slice(i + 1, end);
        if (inner && looksLikeMath(inner)) {
          flush();
          tokens.push({ kind: "mathInline", math: inner });
          i = end + 1;
          continue;
        }
      }
      buf += text[i];
      i++;
      continue;
    }

    buf += text[i];
    i++;
  }

  flush();
  return tokens;
}

function renderTokens(tokens: Token[], keyPrefix: string): React.ReactNode[] {
  return tokens.map((t, i) => {
    const key = `${keyPrefix}-${i}`;
    switch (t.kind) {
      case "text":
        return <React.Fragment key={key}>{t.text}</React.Fragment>;
      case "code":
        return (
          <code key={key} className="bk-inline-code">
            {t.text}
          </code>
        );
      case "bold":
        return <strong key={key}>{renderTokens(t.inner, key)}</strong>;
      case "italic":
        return <em key={key}>{renderTokens(t.inner, key)}</em>;
      case "mathInline":
        return <Tex key={key} math={t.math} />;
      case "mathBlock":
        return (
          <div key={key} className="bk-fcard">
            <Tex block math={t.math} />
          </div>
        );
    }
  });
}

/** Render teks konten dengan dukungan $$blok$$, $inline$, **tebal**, *miring*, `kode`. */
export function RichInline({ text }: { text: string }) {
  const tokens = React.useMemo(() => scan(text ?? "", true), [text]);
  return <>{renderTokens(tokens, "rich")}</>;
}
