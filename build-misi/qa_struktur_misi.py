#!/usr/bin/env python3
"""QA struktur file .ts misi M2 Data Management (tanpa mengeksekusi TS).

Cek: jumlah langkah naratif, tasks di tiap langkah, briefing di langkah 1,
decision 3 opsi + nextStepId + consequenceNote, cabang goto audit,
auditDossier (12-20 baris, 3-5 injections), deliverable (template 5,
rubric 4, bobot=100, 3 levels), summary di langkah terakhir,
starter mengandung '...', tanpa entitas HTML, tanpa frasa F1.
"""
import re
import sys

F1 = ["Pada lesson kali ini kita akan membahas",
      "Pada misi kali ini kita akan membahas",
      "Seperti yang telah dibahas sebelumnya",
      "Mari kita mulai pembahasan",
      "Selanjutnya, kita akan melihat",
      "Penting untuk diingat bahwa"]

FILES = {
    "misi-katalog-data-hilang.ts": ("misiKatalogData", 11),
    "misi-lineage-terputus.ts": ("misiLineageTerputus", 13),
}
BASE = "src/app/v2/content/"
fails = []


def fail(msg):
    fails.append(msg)
    print("FAIL:", msg)


for fname, (const, n_naratif) in FILES.items():
    src = open(BASE + fname, encoding="utf-8").read()
    print(f"── {fname} ──")

    # 1. langkah: hitung id langkah unik (cabang berbagi eyebrow "Langkah N")
    eyebrows = re.findall(r'eyebrow: "Langkah (\d+)', src)
    naratif = len(set(eyebrows))
    steps = len(re.findall(r'\n[ \t]+\{\n[ \t]+id: "', src)) + src.count('{\n    id: "briefing"')
    print(f"   eyebrow naratif unik: {sorted(set(eyebrows), key=int)} = {naratif} (target {n_naratif})")
    if naratif != n_naratif:
        fail(f"{fname}: langkah naratif {naratif} != {n_naratif}")

    # 2. setiap langkah punya tasks (satu eyebrow = satu step)
    n_tasks_field = len(re.findall(r"tasks: \[", src))
    n_steps = len(re.findall(r"eyebrow: ", src))
    print(f"   steps (eyebrow): {n_steps}, field tasks: {n_tasks_field}")
    if n_tasks_field != n_steps:
        fail(f"{fname}: jumlah field tasks ({n_tasks_field}) != jumlah step ({n_steps})")

    # 3. langkah 1 = briefing
    m = re.search(r'steps: \[\n\s+\{\n\s+id: "([a-z-]+)"', src)
    first_id = m.group(1) if m else None
    print(f"   step pertama: {first_id}")
    if first_id != "briefing":
        fail(f"{fname}: langkah 1 bukan briefing")
    if "briefing: {" not in src:
        fail(f"{fname}: tidak ada briefing spec")

    # 4. decision: 3 opsi + nextStepId + consequenceNote
    n_opt = len(re.findall(r'nextStepId: "', src))
    n_conseq = len(re.findall(r'consequenceNote:', src))
    print(f"   decision options: {n_opt}, consequenceNote: {n_conseq}")
    if n_opt != 3 or n_conseq != 3:
        fail(f"{fname}: decision harus 3 opsi + consequenceNote")

    # 5. cabang goto audit
    n_goto = len(re.findall(r'goto: "audit"', src))
    print(f"   goto audit: {n_goto}")
    if n_goto != 3:
        fail(f"{fname}: harus 3 langkah cabang goto audit")

    # 6. auditDossier
    rows = re.findall(r"\{ rowId: (\d+),", src)
    n_rows = len(rows)
    n_inj = len(re.findall(r'\{ key: "', src))
    print(f"   dossier rows: {n_rows}, injections: {n_inj}")
    if not (12 <= n_rows <= 20):
        fail(f"{fname}: dossier rows {n_rows} di luar 12-20")
    if not (3 <= n_inj <= 5):
        fail(f"{fname}: injections {n_inj} di luar 3-5")

    # 7. deliverable
    tm = re.search(r"template: \[(.*?)\],\n\s*rubric", src, re.S)
    n_tpl = tm.group(1).count('",\n') if tm else 0
    rub = re.findall(r'\{ criterion: "([^"]+)", weight: (\d+), levels: \[(.*?)\] \}', src)
    wsum = sum(int(w) for _, w, _ in rub)
    lvls = [lv.count('",') + 1 for _, _, lv in rub]
    print(f"   template poin: {n_tpl}, rubric: {len(rub)} kriteria, bobot: {wsum}, levels: {lvls}")
    if n_tpl != 5:
        fail(f"{fname}: template harus 5 poin")
    if len(rub) != 4 or wsum != 100 or any(l != 3 for l in lvls):
        fail(f"{fname}: rubric harus 4 kriteria, bobot 100, 3 levels")

    # 8. summary di langkah terakhir
    if "summary: [" not in src:
        fail(f"{fname}: tidak ada summary")
    sm = re.search(r"summary: \[(.*?)\],\n", src, re.S)
    n_sum = sm.group(1).count('",\n') if sm else 0
    print(f"   summary poin: {n_sum}")
    if n_sum != 5:
        fail(f"{fname}: summary harus 5 poin")
    # summary harus di step rangkuman (id terakhir)
    ids = re.findall(r'\n[ ]{2,4}\{\n[ ]{4,6}id: "([a-z0-9-]+)"', src)
    ids += re.findall(r'^\s+id: "([a-z0-9-]+)"', src, re.M)
    print(f"   step terakhir: {ids[-1] if ids else '?'}")

    # 9. starter mengandung ...
    n_starter = len(re.findall(r"starter: \[", src))
    n_dotdot = src.count('"...') + src.count('...')
    print(f"   starter blocks: {n_starter}")
    for mm in re.finditer(r"starter: \[\n(.*?)\n\s*\]\.join", src, re.S):
        if "..." not in mm.group(1):
            fail(f"{fname}: starter tanpa '...'")

    # 10. tanpa entitas HTML di prosa
    for ent in ["&lt;", "&gt;", "&amp;", "&quot;"]:
        if ent in src:
            fail(f"{fname}: entitas HTML {ent} ditemukan")

    # 11. frasa F1
    for f1 in F1:
        if f1 in src:
            fail(f"{fname}: frasa F1 '{f1}'")

    # 12. datasetNote menyebut SINTETIS
    if src.count("SINTETIS") < 3:
        fail(f"{fname}: deklarasi SINTETIS kurang eksplisit")

    print()

print("HASIL:", "SEMUA LOLOS" if not fails else f"{len(fails)} KEGAGALAN")
sys.exit(1 if fails else 0)
