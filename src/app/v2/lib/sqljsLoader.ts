// sql.js loader — pola sama seperti PlotlyChart: script tag CDN, singleton.
// wasm (sql-wasm.wasm) diarahkan ke CDN via locateFile.
declare global {
  interface Window {
    initSqlJs?: (config?: { locateFile?: (file: string) => string }) => Promise<unknown>;
  }
}

const SQLJS_CDN = "https://cdn.jsdelivr.net/npm/sql.js@1/dist";

let sqlJsPromise: Promise<unknown> | null = null;

export function loadSqlJs(): Promise<unknown> {
  if (typeof window === "undefined") return Promise.reject(new Error("SSR"));
  if (sqlJsPromise) return sqlJsPromise;
  sqlJsPromise = new Promise((resolve, reject) => {
    if (window.initSqlJs) {
      resolve(window.initSqlJs);
      return;
    }
    const script = document.createElement("script");
    script.src = `${SQLJS_CDN}/sql-wasm.js`;
    script.async = true;
    script.onload = () => {
      if (window.initSqlJs) resolve(window.initSqlJs);
      else reject(new Error("initSqlJs tidak ditemukan setelah script dimuat"));
    };
    script.onerror = () => reject(new Error("Gagal memuat sql.js dari CDN"));
    document.head.appendChild(script);
  }).then((initSqlJs) =>
    (initSqlJs as (config?: { locateFile?: (file: string) => string }) => Promise<unknown>)({
      locateFile: (file: string) => `${SQLJS_CDN}/${file}`,
    })
  );
  return sqlJsPromise;
}

/** Minimal typing untuk API sql.js yang dipakai SqlLab. */
export interface SqlJsDb {
  exec(sql: string): Array<{ columns: string[]; values: unknown[][] }>;
  close(): void;
}
export interface SqlJsModule {
  Database: new () => SqlJsDb;
}
