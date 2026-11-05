"use client";
import katex from "katex";
import "katex/dist/katex.min.css";

interface TexProps {
  math: string;
  block?: boolean;
}

export default function Tex({ math, block }: TexProps) {
  let html = "";
  try {
    html = katex.renderToString(math, {
      throwOnError: false,
      displayMode: !!block,
      strict: false,
    });
  } catch {
    html = `<span style="font-family:monospace">${math}</span>`;
  }

  if (block) {
    return <div className="tex-block" dangerouslySetInnerHTML={{ __html: html }} />;
  }
  return <span className="tex-inline" dangerouslySetInnerHTML={{ __html: html }} />;
}
