// Entry bundle KHUSUS untuk scripts/gen-lesson-meta.mjs — BUKAN dipakai
// komponen runtime. Mengumpulkan tiga registry (lesson, misi, proyek) ke
// satu bundle esbuild agar generator bisa mengekstrak metadata ramping
// tanpa menarik konten lesson ke dalam bundle client.
// Pakai: ./node_modules/.bin/esbuild scripts/meta-entry.ts --bundle \
//   --format=esm --outfile=/tmp/metabundle.mjs --log-level=error && \
//   node scripts/gen-lesson-meta.mjs
import { getV2Lessons } from "../src/app/v2/lib/registry";
import { REG_MISI } from "../src/app/v2/lib/reg-misi";
import { PROYEK_REGISTRY } from "../src/app/v2/lib/reg-proyek";

export { getV2Lessons, REG_MISI, PROYEK_REGISTRY };
