"use client";
import { useState } from "react";
import { decodeEntities } from "@/lib/decodeEntities";

interface QuizProps {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  onAnswer?: (ok: boolean) => void;
}

export default function Quiz({ question, options, correct, explanation, onAnswer }: QuizProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  function choose(idx: number) {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    onAnswer?.(idx === correct);
  }

  return (
    <div className="quiz-card">
      <p className="quiz-question">{question}</p>
      <div className="quiz-options">
        {options.map((opt, i) => {
          let cls = "quiz-option";
          if (showResult) {
            if (i === correct) cls += " correct";
            else if (i === selected) cls += " wrong";
          }
          return (
            <button key={i} className={cls} onClick={() => choose(i)} disabled={showResult}>
              <span className="quiz-letter">{String.fromCharCode(65 + i)}</span>
              {opt}
            </button>
          );
        })}
      </div>
      {showResult && (
        <div className={`quiz-feedback show ${selected === correct ? "correct" : "wrong"}`}>
          <strong>{selected === correct ? "✅ Benar!" : "❌ Kurang tepat."}</strong>
          <p>{decodeEntities(explanation)}</p>
          <button className="btn btn-sm btn-secondary" onClick={() => { setSelected(null); setShowResult(false); }}>
            Ulangi
          </button>
        </div>
      )}
    </div>
  );
}
