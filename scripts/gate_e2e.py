#!/usr/bin/env python3
"""Parent deploy-gate E2E: impostor scenarios, FSRS smoke, Tandai Selesai
persistence, dashboard/track counts, nav Proyek. Run against prod server :3111."""
import sys
from playwright.sync_api import sync_playwright

BASE = "http://localhost:3111"
R = []
def check(name, ok, detail=""):
    R.append((name, bool(ok)))
    print(("PASS " if ok else "FAIL ") + name + (f" — {detail}" if detail else ""), flush=True)

def goto_lesson_audit(pg):
    pg.goto(f"{BASE}/v2/learn/rr19-audit-impostor", wait_until="domcontentloaded", timeout=60000)
    pg.wait_for_timeout(3500)
    if pg.query_selector("[data-testid^='flag-']"):
        return True
    # Step pills carry aria-label "Ke langkah N"; audit = step 10. JS-click them.
    for n in range(13, 0, -1):
        pg.evaluate(f"""() => {{
            const els = Array.from(document.querySelectorAll('button, a'));
            const el = els.find(e => (e.getAttribute('aria-label') || '').startsWith('Ke langkah {n}'));
            if (el && !el.disabled) el.click();
        }}""")
        pg.wait_for_timeout(800)
        if pg.query_selector("[data-testid^='flag-']"):
            return True
    return pg.query_selector("[data-testid^='flag-']") is not None

with sync_playwright() as p:
    b = p.chromium.launch()
    errs = []
    # ---------- Impostor scenario A: flag all 5 injected -> 5/5 ----------
    try:
        pg = b.new_page(viewport={"width": 1280, "height": 900})
        pg.on("pageerror", lambda e: errs.append(str(e)[:140]))
        ok = goto_lesson_audit(pg)
        check("impostor: audit table reachable", ok)
        if ok:
            for rid in (1, 5, 7, 8, 10):
                btn = pg.query_selector(f"[data-testid='flag-{rid}']")
                if btn: btn.click(); pg.wait_for_timeout(200)
            pg.click("[data-testid='open-debrief']"); pg.wait_for_timeout(800)
            score = pg.inner_text("[data-testid='debrief-score']")
            check("impostor scenario A score 5/5", "5/5" in score, score.strip())
        pg.close()
    except Exception as e:
        check("impostor scenario A [error]", False, str(e)[:200])
    # ---------- Impostor scenario B: flag nothing -> 0/5 ----------
    try:
        pg = b.new_page(viewport={"width": 1280, "height": 900})
        ok = goto_lesson_audit(pg)
        check("impostor B: audit reachable", ok)
        if ok:
            pg.click("[data-testid='open-debrief']"); pg.wait_for_timeout(800)
            score = pg.inner_text("[data-testid='debrief-score']")
            check("impostor scenario B score 0/5", "0/5" in score, score.strip())
        pg.close()
    except Exception as e:
        check("impostor scenario B [error]", False, str(e)[:200])
    # ---------- Dashboard & nav ----------
    try:
        pg = b.new_page(viewport={"width": 1280, "height": 900})
        pg.on("pageerror", lambda e: errs.append(str(e)[:140]))
        pg.goto(f"{BASE}/v2", wait_until="domcontentloaded", timeout=60000)
        pg.wait_for_timeout(3000)
        body = pg.inner_text("body")
        check("dashboard shows WQB track", "WorldQuant Brain" in body)
        check("dashboard shows 607 lessons", "607" in body, body[:0])
        # 2026-10-15 (feedback Septian): nav Proyek kini ke galeri /v2/proyek,
        # bukan langsung masuk rr19; galeri yang menaut ke workspace rr19.
        proyek = pg.query_selector("a[href='/v2/proyek']")
        check("nav Proyek links to gallery", proyek is not None)
        pg.goto(f"{BASE}/v2/proyek", wait_until="domcontentloaded", timeout=60000)
        pg.wait_for_timeout(2000)
        pbody = pg.inner_text("body")
        plink = pg.query_selector("a[href='/v2/learn/rr19-audit-impostor']")
        check("proyek gallery renders + links rr19",
              "Proyek Terpandu" in pbody and plink is not None)
        n_cards = len(pg.query_selector_all(".projcard"))
        a1 = pg.query_selector("a[href='/v2/proyek/pj-audit-portofolio']")
        a2 = pg.query_selector("a[href='/v2/proyek/pj-scorecard-kredit']")
        check("proyek gallery has 3 cards + links 2 new projects",
              n_cards >= 3 and a1 is not None and a2 is not None)
        pg.goto(f"{BASE}/v2/proyek/pj-audit-portofolio", wait_until="domcontentloaded", timeout=60000)
        pg.wait_for_timeout(2500)
        check("proyek audit portofolio renders", "LANGKAH" in pg.inner_text("body").upper())
        pg.goto(f"{BASE}/v2/proyek/pj-scorecard-kredit", wait_until="domcontentloaded", timeout=60000)
        pg.wait_for_timeout(2500)
        check("proyek scorecard renders", "LANGKAH" in pg.inner_text("body").upper())
        pg.goto(f"{BASE}/v2/proyek/pj-aml-monitoring", wait_until="domcontentloaded", timeout=60000)
        pg.wait_for_timeout(2500)
        check("proyek AML renders", "LANGKAH" in pg.inner_text("body").upper())
        # 2026-10-15 (ACC Septian): tugas inspeksi data harus menautkan file
        # snapshot langsung — misi pipeline kotor langkah 2 -> CSV September.
        pg.goto(f"{BASE}/v2/misi/misi-gabung-pipeline-kotor", wait_until="domcontentloaded", timeout=60000)
        pg.wait_for_timeout(2500)
        nxt = pg.query_selector("button:has-text('Lanjut')")
        if nxt:
            nxt.click()
            pg.wait_for_timeout(2000)
        fl = pg.query_selector("a[href$='transaksi_2026-09.csv']")
        fl2 = pg.query_selector("a[href$='transaksi_2026-10.csv']")
        check("mission task file links to snapshot CSVs", fl is not None and fl2 is not None)
        pg.goto(f"{BASE}/v2", wait_until="domcontentloaded", timeout=60000)
        pg.wait_for_timeout(2000)
        rev = pg.query_selector("a[href='/v2/review']")
        kar = pg.query_selector("a[href='/v2/karier']")
        check("nav Review + Karier links", rev is not None and kar is not None)
        pg.goto(f"{BASE}/v2/karier", wait_until="domcontentloaded", timeout=60000)
        pg.wait_for_timeout(2500)
        kbody = pg.inner_text("body")
        check("karier page renders", "Kesiapan karier" in kbody)
        pg.goto(f"{BASE}/v2/review", wait_until="domcontentloaded", timeout=60000)
        pg.wait_for_timeout(2500)
        rbody = pg.inner_text("body")
        check("review page renders", "Review Hari Ini" in rbody)
        pg.close()
    except Exception as e:
        check("dashboard/nav [error]", False, str(e)[:200])
    # ---------- Tandai Selesai persistence (cookie + API readback) ----------
    try:
        ctx = b.new_context(viewport={"width": 1280, "height": 900})
        ctx.add_cookies([{"name": "learn_auth", "value": "1", "url": BASE}])
        pg = ctx.new_page()
        pg.goto(f"{BASE}/v2/learn/rr15-risk-appetite", wait_until="domcontentloaded", timeout=60000)
        pg.wait_for_timeout(3000)
        btn = pg.query_selector("button:has-text('Tandai Selesai')")
        check("tandai button present", btn is not None)
        if btn:
            pressed = btn.get_attribute("aria-pressed")
            if pressed != "true":
                btn.click(); pg.wait_for_timeout(1200)
            resp = pg.evaluate("() => fetch('/api/progress').then(r => r.text())")
            check("progress API contains rr15 after click", "rr15-risk-appetite" in resp, resp[:120])
            pg.reload(wait_until="domcontentloaded"); pg.wait_for_timeout(2500)
            btn2 = pg.query_selector("button[aria-pressed='true']")
            check("tandai persists after reload", btn2 is not None)
            if btn2:
                btn2.click(); pg.wait_for_timeout(1200)
                resp2 = pg.evaluate("() => fetch('/api/progress').then(r => r.text())")
                check("progress API cleaned after unclick", "rr15-risk-appetite" not in resp2, resp2[:120])
        ctx.close()
    except Exception as e:
        check("tandai selesai [error]", False, str(e)[:200])
    check("no pageerror during gate E2E", len(errs) == 0, "; ".join(errs[:3]))
    b.close()

fails = [n for n, ok in R if not ok]
print(f"\n=== GATE E2E: {len(R) - len(fails)}/{len(R)} PASS ===")
sys.exit(1 if fails else 0)
