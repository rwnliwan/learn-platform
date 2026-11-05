# SVG helpers (theme-aware) — re-inserted into gen.py before LESSONS = []
C1, C2, C3, C4 = "var(--c1)", "var(--c2)", "var(--c3)", "var(--c4)"

def bars_svg(pairs, title="", w=480, h=200, unit="", colors=None):
    """pairs: [(label, value)]. Simple vertical bars, theme-aware."""
    n = len(pairs)
    pad_l, pad_b, pad_t = 46, 34, 26
    cw, ch = w - pad_l - 14, h - pad_t - pad_b
    mx = max(v for _, v in pairs) or 1
    bw = cw / n
    cols = colors or [C1, C2, C3, C4]
    parts = [f'<svg viewBox="0 0 {w} {h}" role="img" aria-label="{title}">']
    parts.append(f'<text x="{w/2}" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">{title}</text>')
    for i in range(5):
        y = pad_t + ch - ch * i / 4
        val = mx * i / 4
        parts.append(f'<line x1="{pad_l}" y1="{y:.1f}" x2="{w-14}" y2="{y:.1f}" stroke="var(--chart-grid)" stroke-width="1"/>')
        parts.append(f'<text x="{pad_l-6}" y="{y+4:.1f}" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">{val:.1f}</text>')
    for i, (lab, v) in enumerate(pairs):
        x = pad_l + i * bw + bw * 0.18
        bw2 = bw * 0.64
        bh = ch * v / mx
        y = pad_t + ch - bh
        parts.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{bw2:.1f}" height="{bh:.1f}" fill="{cols[i % len(cols)]}" rx="3"/>')
        parts.append(f'<text x="{x+bw2/2:.1f}" y="{y-6:.1f}" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">{v:g}{unit}</text>')
        parts.append(f'<text x="{x+bw2/2:.1f}" y="{pad_t+ch+16:.1f}" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">{lab}</text>')
    parts.append(f'<line x1="{pad_l}" y1="{pad_t+ch}" x2="{w-14}" y2="{pad_t+ch}" stroke="var(--chart-grid)" stroke-width="1"/>')
    parts.append('</svg>')
    return "\n".join(parts)

def funnel_svg(stages, title="", w=480, h=230):
    """stages: [(label, count)]. Horizontal funnel bars."""
    pad_l, pad_t = 130, 34
    cw = w - pad_l - 60
    mx = max(c for _, c in stages)
    parts = [f'<svg viewBox="0 0 {w} {h}" role="img" aria-label="{title}">']
    parts.append(f'<text x="{w/2}" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">{title}</text>')
    rh = (h - pad_t - 16) / len(stages)
    cols = [C1, C2, C3, C4]
    for i, (lab, c) in enumerate(stages):
        y = pad_t + i * rh + 4
        bw = cw * c / mx
        parts.append(f'<text x="{pad_l-8}" y="{y+rh/2-2+4:.1f}" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">{lab}</text>')
        parts.append(f'<rect x="{pad_l}" y="{y:.1f}" width="{bw:.1f}" height="{rh-10:.1f}" fill="{cols[i % 4]}" rx="4"/>')
        parts.append(f'<text x="{pad_l+bw+8:.1f}" y="{y+rh/2-2+4:.1f}" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">{c}</text>')
    parts.append('</svg>')
    return "\n".join(parts)

def line_svg(series, title="", xlab="", ylab="", w=480, h=220, marks=None):
    """series: [(x, y)] polyline."""
    pad_l, pad_b, pad_t = 48, 34, 26
    cw, ch = w - pad_l - 14, h - pad_t - pad_b
    xs = [x for x, _ in series]; ys = [y for _, y in series]
    x0, x1 = min(xs), max(xs); y0, y1 = min(ys), max(ys)
    if x1 == x0: x1 = x0 + 1
    if y1 == y0: y1 = y0 + 1
    def X(x): return pad_l + cw * (x - x0) / (x1 - x0)
    def Y(y): return pad_t + ch - ch * (y - y0) / (y1 - y0)
    pts = " ".join(f"{X(x):.1f},{Y(y):.1f}" for x, y in series)
    parts = [f'<svg viewBox="0 0 {w} {h}" role="img" aria-label="{title}">']
    parts.append(f'<text x="{w/2}" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">{title}</text>')
    parts.append(f'<polyline points="{pts}" fill="none" stroke="{C1}" stroke-width="2.5"/>')
    for x, y in series[::max(1, len(series)//8)]:
        parts.append(f'<circle cx="{X(x):.1f}" cy="{Y(y):.1f}" r="3" fill="{C1}"/>')
    if marks:
        for x, y, lab in marks:
            parts.append(f'<circle cx="{X(x):.1f}" cy="{Y(y):.1f}" r="4.5" fill="{C4}"/>')
            parts.append(f'<text x="{X(x):.1f}" y="{Y(y)-10:.1f}" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">{lab}</text>')
    parts.append(f'<text x="{pad_l+cw/2}" y="{h-8}" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">{xlab}</text>')
    parts.append(f'<text x="14" y="{pad_t+ch/2}" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" transform="rotate(-90 14 {pad_t+ch/2})">{ylab}</text>')
    parts.append('</svg>')
    return "\n".join(parts)

