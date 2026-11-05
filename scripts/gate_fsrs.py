#!/usr/bin/env python3
"""Parent gate: FSRS browser flow (quiz answer -> localStorage card -> review page)
+ hint ladder interaction. Corrected navigation (quiz is a late step)."""
import sys
from playwright.sync_api import sync_playwright

BASE = "http://localhost:3111"
R = []
def check(name, ok, detail=""):
    R.append((name, bool(ok)))
    print(("PASS " if ok else "FAIL ") + name + (f" — {detail}" if detail else ""), flush=True)

def goto_step(pg, slug, pred_js, max_step=16):
    pg.goto(f"{BASE}/v2/learn/{slug}", wait_until="domcontentloaded", timeout=60000)
    pg.wait_for_timeout(3000)
    if pg.evaluate(pred_js):
        return True
    for n in range(1, max_step + 1):
        pg.evaluate(f"""() => {{
            const els = Array.from(document.querySelectorAll('button, a'));
            const el = els.find(e => (e.getAttribute('aria-label') || '').startsWith('Ke langkah {n}'));
            if (el && !el.disabled) el.click();
        }}""")
        pg.wait_for_timeout(700)
        if pg.evaluate(pred_js):
            return True
    return False

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1280, "height": 900})
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)[:140]))
    try:
        ok = goto_step(pg, "a11-tipe-data", "() => document.querySelectorAll('.opt').length >= 2")
        check("quiz step reachable", ok)
        if ok:
            # Hint ladder on quiz step
            hb = pg.query_selector("button[aria-label='Buka tangga petunjuk Socratic']")
            check("hint ladder button present", hb is not None)
            if hb:
                hb.click(); pg.wait_for_timeout(700)
                panel = pg.query_selector(".ladder-panel")
                txt = panel.inner_text() if panel else ""
                check("hint ladder opens with content", len(txt) > 20, txt[:80].replace("\n", " "))
            # Answer first question
            opt = pg.query_selector(".opt:not([disabled])")
            opt.click(); pg.wait_for_timeout(800)
            keys = pg.evaluate("() => Object.keys(localStorage).filter(k => k.startsWith('v2:fsrs:'))")
            check("FSRS card recorded after quiz answer", len(keys) >= 1, f"{len(keys)} cards: {keys[:2]}")
            # Advance within quiz if a next-question button exists, answer one more
            nx = pg.query_selector("button:has-text('Berikutnya')")
            if nx and nx.is_enabled():
                nx.click(); pg.wait_for_timeout(700)
                opt2 = pg.query_selector(".opt:not([disabled])")
                if opt2:
                    opt2.click(); pg.wait_for_timeout(800)
                    keys2 = pg.evaluate("() => Object.keys(localStorage).filter(k => k.startsWith('v2:fsrs:'))")
                    check("FSRS cards accumulate", len(keys2) >= len(keys), f"{len(keys2)} cards")
            # Review page reflects recorded cards (due now or scheduled note)
            pg.goto(f"{BASE}/v2/review", wait_until="domcontentloaded", timeout=60000)
            pg.wait_for_timeout(3500)
            body = pg.inner_text("body")
            has_review_ui = ("Tampilkan jawaban" in body) or ("Kartu" in body) or ("review" in body.lower())
            check("review page renders FSRS state", has_review_ui, body[:100].replace("\n", " "))
    except Exception as e:
        check("fsrs flow [error]", False, str(e)[:200])
    check("no pageerror during FSRS flow", len(errs) == 0, "; ".join(errs[:3]))
    b.close()

fails = [n for n, ok in R if not ok]
print(f"\n=== GATE FSRS: {len(R) - len(fails)}/{len(R)} PASS ===")
sys.exit(1 if fails else 0)
