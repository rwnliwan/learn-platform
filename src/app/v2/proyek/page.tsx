import DashboardNav from "../lib/DashboardNav";
import Icon from "../lib/icons";
import ProyekStatus from "../lib/ProyekStatus";
import { getV2Lessons } from "../lib/registry";
import { PROYEK_LIST } from "../lib/reg-proyek";

export const metadata = {
  title: "Proyek Terpandu — Learn v2",
  description:
    "Proyek flagship terpandu: audit paket alpha dengan data snapshot nyata dan suntikan impostor.",
};

/* Menu Proyek sebelumnya menaut langsung ke rr19 tanpa konteks.
   Halaman ini = galeri proyek terpandu: konteks dulu, baru masuk workspace. */
export default function ProyekIndex() {
  const rr19 = getV2Lessons().find((l) => l.slug === "rr19-audit-impostor");
  const steps = rr19?.steps.length ?? 0;
  const minutes = rr19?.estMinutes ?? 0;

  return (
    <div className="shell">
      <DashboardNav active="proyek" />
      <main className="main">
        <div className="main-in">
          <div className="page-h">
            <h1>Proyek Terpandu</h1>
            <span className="date">5 proyek flagship</span>
          </div>
          <p style={{ maxWidth: 720, color: "var(--text-muted)" }}>
            Proyek terpandu adalah latihan flagship satu sesi penuh: kamu memegang{" "}
            <strong>peran auditor</strong>, bekerja dengan <strong>data snapshot nyata</strong>,
            dan dinilai dari <strong>deliverable</strong> yang kamu hasilkan — bukan dari
            hafalan. Di tengah jalan ada <strong>impostor</strong>: klaim palsu yang disuntikkan
            tanpa pengumuman untuk melatih ketajaman verifikasimu.
          </p>

          <div className="projgrid">
          {rr19 && (
            <article className="projcard">
              <div className="eyebrow">
                <Icon name="flask" />
                <span>{rr19.track} · Flagship</span>
              </div>
              <h2>{rr19.title}</h2>
              <p>
                Kamu mengaudit satu paket alpha WorldQuant Brain: 16 simulasi dari snapshot
                database nyata (2026-10-14). Sebagian klaim di berkas audit itu benar, sebagian
                dipalsukan sang impostor — angka ringkasan yang tidak cocok dengan detail,
                label yang ditukar, sampai self-correlation fiktif. Tugasmu: verifikasi semua
                klaim satu per satu, pisahkan yang aman dari yang harus dieskalasi, dan tutup
                dengan laporan audit yang bisa dipertahankan di depan komite.
              </p>
              <div className="projmeta">
                <span>{steps} langkah</span>
                <span>±{minutes} menit</span>
                <span>Data snapshot nyata</span>
                <span>Audit impostor</span>
                <span>Deliverable: laporan audit</span>
              </div>
              <div className="projskills" aria-label="Skill yang dilatih">
                {["Audit alpha Brain", "Self-correlation", "Verifikasi klaim", "Eskalasi & laporan audit"].map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
              <ProyekStatus slug={rr19.slug} />
            </article>
          )}

          {PROYEK_LIST.map((p) => (
            <article className="projcard" key={p.slug}>
              <div className="eyebrow">
                <Icon name="flask" />
                <span>{p.track} · Proyek Terpandu</span>
              </div>
              <h2>{p.title}</h2>
              <p>{p.tagline}</p>
              <div className="projmeta">
                <span>{p.steps.length} langkah</span>
                <span>±{p.estMinutes} menit · multi-sesi</span>
                <span>Peran: {p.role}</span>
                <span>Data snapshot nyata</span>
                <span>Audit impostor</span>
                {p.deliverable && <span>Deliverable: {p.deliverable}</span>}
              </div>
              {p.skills.length > 0 && (
                <div className="projskills" aria-label="Skill yang dilatih">
                  {p.skills.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
              )}
              <ProyekStatus slug={p.slug} base="/v2/proyek" />
            </article>
          ))}
          </div>

          <div className="projfmt" aria-label="Format proyek terpandu">
            <div>
              <strong>1 · Briefing peran</strong>
              <p>Kamu menerima mandat, konteks, dan batas wewenangmu sebagai auditor.</p>
            </div>
            <div>
              <strong>2 · Workspace multi-langkah</strong>
              <p>Periksa berkas dan data langkah demi langkah, dengan catatan temuanmu sendiri.</p>
            </div>
            <div>
              <strong>3 · Audit impostor</strong>
              <p>Klaim palsu muncul tanpa tanda — tangkap dari ketidakcocokan angka, bukan firasat.</p>
            </div>
            <div>
              <strong>4 · Deliverable &amp; debrief</strong>
              <p>Susun laporan audit, lalu baca debrief: klaim mana yang ternyata suntikan.</p>
            </div>
          </div>

          <p style={{ marginTop: 24, color: "var(--text-muted)", fontSize: 13 }}>
            Lima proyek terpandu menjaga format flagship tetap langka dan dalam. Untuk
            latihan end-to-end per domain lain, lihat menu <strong>Misi</strong>{" "}
            (75 misi dengan struktur serupa).
          </p>
        </div>
      </main>
    </div>
  );
}
