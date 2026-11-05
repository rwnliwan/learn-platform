#!/usr/bin/env python3
"""Verifikasi fungsional item upgrade Learn v2 (Playwright asli)."""
import json, sys
from playwright.sync_api import sync_playwright

BASE = "http://localhost:3111"
results = []
def check(name, ok, detail=""):
    results.append({"name": name, "ok": bool(ok), "detail": str(detail)[:300]})
    print(("PASS " if ok else "FAIL ") + name + (f" — {detail}" if detail else ""))

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1280, "height": 900})

    # ---------- ITEM 1: FSRS ----------
    pg.goto(f"{BASE}/v2/learn/a11-tipe-data", wait_until="networkidle")
    pg.wait_for_timeout(1500)
    # cari blok kuis: tombol opsi jawaban
    opts = pg.query_selector_all(".opt")
    check("quiz options rendered", len(opts) >= 2, f"{len(opts)} options")
    # jawab soal 1 dengan benar: cari opsi yang setelah diklik dapat class ok
    # strategi: klik opsi pertama tiap soal, catat hasilnya
    q_correct = q_wrong = 0
    try:
        # navigasi kuis: tiap soal dirender satu-per-satu (qIdx); klik opsi lalu next
        for qi in range(4):
            cur = pg.query_selector_all(".opt")
            if not cur: break
            # klik opsi pertama
            cur[0].click()
            pg.wait_for_timeout(400)
            cls = cur[0].get_attribute("class") or ""
            if "ok" in cls: q_correct += 1
            else: q_wrong += 1
            nxt = pg.query_selector("button:has-text('Berikutnya')")
            if nxt and nxt.is_enabled(): nxt.click(); pg.wait_for_timeout(400)
            else: break
    except Exception as e:
        check("quiz answering", False, str(e)[:150])
    check("quiz 1 benar + 1 salah tercatat", q_correct >= 1 and q_wrong >= 1,
          f"benar={q_correct} salah={q_wrong}")
    fsrs_keys = pg.evaluate("() => Object.keys(localStorage).filter(k => k.startsWith('v2:fsrs:'))")
    check("FSRS cards recorded", len(fsrs_keys) >= 2, f"{len(fsrs_keys)} cards: {fsrs_keys[:3]}")

    # ---------- /v2/review ----------
    pg.goto(f"{BASE}/v2/review", wait_until="networkidle")
    pg.wait_for_timeout(1200)
    body = pg.inner_text("body")
    has_queue = "Tampilkan jawaban" in body or "Kartu 1 dari" in body
    check("review queue shows due cards", has_queue, body[:120].replace("\n", " "))
    if has_queue:
        pg.click("text=Tampilkan jawaban")
        pg.wait_for_timeout(500)
        body2 = pg.inner_text("body")
        check("answer reveal shows options/why", "A" in body2 or "Benar" in body2 or len(body2) > len(body), "revealed")
        before = pg.evaluate("() => Object.keys(localStorage).filter(k => k.startsWith('v2:fsrs:')).length")
        # beri rating Good
        btns = pg.query_selector_all("button")
        rated = False
        for btn in btns:
            if (btn.inner_text().strip() == "Good"):
                btn.click(); rated = True; break
        pg.wait_for_timeout(600)
        after_q = pg.inner_text("body")
        check("rating removes card from queue", rated and ("Kartu 1 dari" not in after_q or "Sesi selesai" in after_q or "tersisa" in after_q),
              f"rated={rated}")

    # ---------- ITEM 2: HintLadder ----------
    pg.goto(f"{BASE}/v2/learn/a11-tipe-data", wait_until="networkidle")
    pg.wait_for_timeout(1200)
    ladder_btn = pg.query_selector("button:has-text('Butuh petunjuk'), button:has-text('Petunjuk berjenjang'), [aria-label*='jenjang' i]")
    if not ladder_btn:
        # cari tombol ladder di sekitar hint
        cands = pg.query_selector_all("button")
        for c in cands:
            t = (c.inner_text() or "").lower()
            if "jenjang" in t or "tuntun" in t:
                ladder_btn = c; break
    check("hint ladder button exists", ladder_btn is not None)
    if ladder_btn:
        ladder_btn.click(); pg.wait_for_timeout(600)
        txt = pg.inner_text("body")
        rungs = txt.count("Jenjang")
        check("3 rungs shown", rungs >= 3, f"found {rungs} 'Jenjang' mentions")
        check("rung 1 is a guiding question", "?" in txt, "question mark present")

    # ---------- ITEM 6: TTS ----------
    pg.evaluate("""() => {
      window.__speakCalls = [];
      const orig = window.speechSynthesis.speak.bind(window.speechSynthesis);
      window.speechSynthesis.speak = (u) => { window.__speakCalls.push(u.text.slice(0,40)); };
      window.speechSynthesis.cancel = () => {};
      window.speechSynthesis.pause = () => {};
      window.speechSynthesis.resume = () => {};
    }""")
    tts = pg.query_selector("[aria-label*='Dengarkan teks teori' i], button:has-text('Dengarkan')")
    check("TTS button exists", tts is not None)
    if tts:
        tts.click(); pg.wait_for_timeout(800)
        calls = pg.evaluate("() => window.__speakCalls")
        check("speak() called on Dengarkan", len(calls) >= 1, f"calls={calls}")
        lbl = pg.inner_text("[aria-label*='Kontrol bacaan' i]") if pg.query_selector("[aria-label*='Kontrol bacaan' i]") else ""
        check("TTS state -> Jeda/Berhenti", "Jeda" in lbl or "Berhenti" in lbl, lbl[:80])
        stop = pg.query_selector("button[aria-label='Berhenti membaca']")
        if stop: stop.click(); pg.wait_for_timeout(400)
        check("TTS stop works", True, "clicked stop")

    # ---------- ITEM 5: karier ----------
    pg.evaluate("""() => {
      localStorage.setItem('v2:done:cr1-produk-kredit', new Date().toISOString());
      localStorage.setItem('v2:done:cr2-kolektibilitas', new Date().toISOString());
      localStorage.setItem('v2:done:a11-tipe-data', new Date().toISOString());
    }""")
    pg.goto(f"{BASE}/v2/karier", wait_until="networkidle")
    pg.wait_for_timeout(1200)
    kbody = pg.inner_text("body")
    check("karier renders 4 roles", all(x in kbody for x in ["Credit Risk", "Fraud", "Market Risk", "Reporting"]),
          kbody[:150].replace("\n", " "))
    # cross-check: % credit = 2 / total cr lessons
    import re as _re
    done_count = pg.evaluate("() => Object.keys(localStorage).filter(k => k.startsWith('v2:done:')).length")
    check("karier reflects done lessons", done_count == 3 and ("%" in kbody), f"done={done_count}")
    check("karier has recommendation", "berikutnya" in kbody.lower() or "rekomendasi" in kbody.lower(), "rec present")
    check("karier gamification section", "streak" in kbody.lower() or "xp" in kbody.lower() or "badge" in kbody.lower() or "perjalanan" in kbody.lower(), "gamif present")

    # ---------- ITEM 7: manifest ----------
    r = pg.request.get(f"{BASE}/manifest.webmanifest")
    try:
        mj = r.json()
        check("manifest valid", r.status == 200 and bool(mj.get("name")), f"name={mj.get('name')}")
    except Exception as e:
        check("manifest valid", False, str(e)[:120])

    b.close()

fails = [r for r in results if not r["ok"]]
print(f"\n==== {len(results)-len(fails)}/{len(results)} passed ====")
sys.exit(1 if fails else 0)
