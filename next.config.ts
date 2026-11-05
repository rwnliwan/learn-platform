import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ts-fsrs dipakai hanya di komponen client (lib/fsrs.ts, Workspace, ReviewClient).
  // Tanpa ini, static-paths worker dev gagal: server webpack-runtime mencoba
  // me-require './vendor-chunks/ts-fsrs.js' yang tidak ada di server bundle
  // (error 2026-10-14). Pure-TS, aman dieksternal dari server bundle.
  serverExternalPackages: ["ts-fsrs"],
};

export default nextConfig;
