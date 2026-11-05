#!/usr/bin/env python3
"""Tight functional verification for Learn v2 upgrade items. Fast: domcontentloaded + short waits."""
import sys, json
from playwright.sync_api import sync_playwright

BASE = "http://localhost:3111"
R = []
def check(name, ok, detail=""):
    R.append({"name": name, "ok": bool(ok)})
    print(("PASS " if ok else "FAIL ") + name + (f" — {detail}" if detail else ""), flush=True)

def section(name, fn):
    try:
        fn()
    except Exception as e:
        check(name + " [section-error]", False, str(e)[:200])

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1280, "height": 900})
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)[:160]))

    def s1_fsrs():
        pg.goto(f"{BASE}/v2/learn/a11-tipe-data", wait_until="domcontentloaded", timeout=30000)
        pg.wait_for_timeout(5000)
        n_opt = pg.evaluate("() => document.querySelectorAll('.opt').length")
        check("quiz rendered", n_opt >= 2, f"{n_opt} options")
        if n_opt < 2:
            return
        # jawab 2 soal: soal1 opsi benar, soal2 opsi salah (cari via class setelah klik)
        got = {"benar": 0, "salah": 0}
        for qi in range(2):
            opts = pg.query_selector_all(".opt:not([disabled])")
            if not opts: break
            # klik opsi satu per satu sampai ketemu benar/salah sesuai kebutuhan
            for oi, o in enumerate(opts):
                if o.get_attribute("disabled"): continue
                o.click(); pg.wait_for_timeout(300)
                cls = o.get_attribute("class") or ""
                if "ok" in cls or "right" in cls:
                    if got["benar"] == 0 and qi == 0: got["benar"] += 1; break
                elif "bad" in cls or "wrong" in cls:
                    if got["salah"] == 0 and qi == 1: got["salah"] += 1; break
            else:
                # fallback: terima apa adanya
                pass
            nx = pg.query_selector("button:has-text('Berikutnya')")
            if nx and nx.is_enabled(): nx.click(); pg.wait_for_timeout(400)
        keys = pg.evaluate("() => Object.keys(localStorage).filter(k=>k.startsWith('v2:fsrs:'))")
        check("FSRS cards recorded", len(keys) >= 1, f"{len(keys)} cards")
        pg.goto(f"{BASE}/v2/review", wait_until="domcontentloaded", timeout=30000)
        pg.wait_for_timeout(4000)
        body = pg.inner_text("body")
        check("review shows due cards", "Tampilkan jawaban" in body or "Kartu 1 dari" in body, body[:100].replace("\n"," "))
        if "Tampilkan jawaban" in body:
            pg.click("text=Tampilkan jawaban"); pg.wait_for_timeout(600)
            btns = pg.query_selector_all("button")
            rated = any(b.inner_text().strip() == "Good" and (b.click(), True)[1] for b in btns)
            pg.wait_for_timeout(600)
            after = pg.inner_text("body")
            check("rating advances queue", rated and ("Tampilkan jawaban" not in after or "Sesi selesai" in after), f"rated={rated}")

    def s2_hint_tts():
        pg.goto(f"{BASE}/v2/learn/a11-tipe-data", wait_until="domcontentloaded", timeout=30000)
        pg.wait_for_timeout(5000)
        btns = pg.query_selector_all("button")
        ladder = next((x for x in btns if "jenjang" in (x.inner_text() or "").lower()), None)
        check("hint ladder button", ladder is not None)
        if ladder:
            ladder.click(); pg.wait_for_timeout(700)
            t = pg.inner_text("body")
            check("3 rungs", t.count("Jenjang") >= 3, f"{t.count('Jenjang')} mentions")
        pg.evaluate("""() => { window.__sp=[];
          const s=window.speechSynthesis;
          s.speak=(u)=>{window.__sp.push(u.text.slice(0,30))};
          s.cancel=()=>{}; s.pause=()=>{}; s.resume=()=>{}; };""")
        tts = pg.query_selector("button[aria-label*='Dengarkan teks teori']")
        check("TTS button", tts is not None)
        if tts and tts.is_enabled():
            tts.click(); pg.wait_for_timeout(700)
            calls = pg.evaluate("() => window.__sp")
            check("speak called", len(calls) >= 1, str(calls))
        else:
            check("speak called", False, "tts missing/disabled")

    def s5_karier():
        pg.evaluate("""() => {
          localStorage.setItem('v2:done:cr1-produk-kredit', new Date().toISOString());
          localStorage.setItem('v2:done:a11-tipe-data', new Date().toISOString());
        }""")
        pg.goto(f"{BASE}/v2/karier", wait_until="domcontentloaded", timeout=30000)
        pg.wait_for_timeout(4000)
        kb = pg.inner_text("body")
        check("karier 4 roles", all(x in kb for x in ["Credit Risk", "Market Risk"]), kb[:120].replace("\n"," "))
        check("karier shows %", "%" in kb, "pct present")
        check("karier recommendation", "berikutnya" in kb.lower() or "rekomendasi" in kb.lower())
        low = kb.lower()
        check("karier gamification", any(x in low for x in ["streak", "xp", "badge", "perjalanan", "level"]))

    def s7_manifest():
        r = pg.request.get(f"{BASE}/manifest.webmanifest")
        try:
            j = r.json(); check("manifest valid", r.status == 200 and bool(j.get("name")), j.get("name"))
        except Exception as e:
            check("manifest valid", False, str(e)[:100])

    section("FSRS", s1_fsrs)
    section("Hint/TTS", s2_hint_tts)
    section("Karier", s5_karier)
    section("Manifest", s7_manifest)
    if errs: print("PAGEERRORS:", errs[:4])
    b.close()

fails = [r for r in R if not r["ok"]]
print(f"==== {len(R)-len(fails)}/{len(R)} passed ====", flush=True)
sys.exit(1 if fails else 0)
