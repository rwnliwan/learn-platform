import { chapters, Chapter } from "./chapters";

export type { Chapter };

export function getChapters(): Chapter[] {
  return chapters;
}

export function getChapter(slug: string): Chapter | null {
  return chapters.find((c) => c.slug === slug) || null;
}

// Minimal markdown → HTML (headings, bold, code, lists, paragraphs)
export function mdToHtml(md: string): string {
  const lines = md.split("\n");
  let html = "";
  let inList = false;
  let inCode = false;

  for (const line of lines) {
    if (line.startsWith("```")) {
      if (inCode) { html += "</pre></div>"; inCode = false; }
      else { html += '<div class="code-header"><span class="code-lang">code</span></div><pre class="codebox">'; inCode = true; }
      continue;
    }
    if (inCode) { html += escapeHtml(line) + "\n"; continue; }

    if (line.startsWith("### ")) { html += `<h3>${inline(line.slice(4))}</h3>`; }
    else if (line.startsWith("## ")) { html += `<h2>${inline(line.slice(3))}</h2>`; }
    else if (line.startsWith("# ")) { html += `<h1 class="display-title">${inline(line.slice(2))}</h1>`; }
    else if (line.startsWith("- ") || line.startsWith("* ")) {
      if (!inList) { html += "<ul>"; inList = true; }
      html += `<li>${inline(line.slice(2))}</li>`;
    }
    else if (line.trim() === "") {
      if (inList) { html += "</ul>"; inList = false; }
    }
    else {
      if (inList) { html += "</ul>"; inList = false; }
      html += `<p>${inline(line)}</p>`;
    }
  }
  if (inList) html += "</ul>";
  if (inCode) html += "</pre></div>";
  return html;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function inline(s: string): string {
  return escapeHtml(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.+?)`/g, '<code class="inline">$1</code>');
}
