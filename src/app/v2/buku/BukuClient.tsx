// Bedah Buku — Gelombang 1: Rak Buku (client).
// Menampilkan 1 buku + 15 bab: Bab 1–3 aktif (paket penuh), Bab 4–15
// "Gelombang berikutnya" (nonaktif, jujur — tidak ada link mati).
"use client";

import Link from "next/link";
import { BUKU, BABS, type BabMeta } from "../lib/bedahbuku";
import "./buku.css";

const GELOMBANG_LABEL: Record<number, string> = {
  1: "Gelombang 1 · live",
  2: "Gelombang 2",
  3: "Gelombang 3",
  4: "Gelombang 4",
  5: "Gelombang 5",
};

function BabCard({ b }: { b: BabMeta }) {
  if (b.aktif) {
    return (
      <Link href={`/v2/buku/${b.slug}`} className="bk-bab bk-bab-on">
        <span className="bk-bab-no">Bab {b.bab}</span>
        <span className="bk-bab-judul">{b.judul}</span>
        <span className="bk-bab-tag">Paket lengkap →</span>
      </Link>
    );
  }
  return (
    <div className="bk-bab bk-bab-off" aria-disabled="true" title="Belum diproduksi — hadir di gelombang berikutnya">
      <span className="bk-bab-no">Bab {b.bab}</span>
      <span className="bk-bab-judul">{b.judul}</span>
      <span className="bk-bab-tag bk-muted">{GELOMBANG_LABEL[b.gelombang]} · segera</span>
    </div>
  );
}

export default function BukuClient() {
  return (
    <div className="bk-wrap">
      <section className="bk-book" aria-label="Buku yang dibedah">
        <div className="bk-book-cover">
          <img
            src="/v2/buku/cover.jpg"
            alt="Sampul buku The Elements of Quantitative Investing — Giuseppe A. Paleologo (Wiley, 2025)"
            className="bk-cover-img"
            width={640}
            height={949}
          />
        </div>
        <div className="bk-book-info">
          <h2 className="bk-book-judul">{BUKU.judul}</h2>
          <p className="bk-book-meta">
            {BUKU.penulis} · {BUKU.penerbit}, {BUKU.tahun} · ISBN ePub {BUKU.isbnEpub}
          </p>
          <p className="bk-p">{BUKU.ringkasan}</p>
          <p className="bk-note">
            Bedah buku di sini memakai file ebook milikmu sendiri sebagai sumber
            — paket per bab dibangun sekali saat produksi, tanpa AI runtime
            saat kamu belajar.
          </p>
        </div>
      </section>

      <h2 className="bk-h2">Daftar Bab</h2>
      <div className="bk-bab-grid">
        {BABS.map((b) => (
          <BabCard key={b.slug} b={b} />
        ))}
      </div>
    </div>
  );
}
