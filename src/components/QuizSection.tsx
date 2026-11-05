"use client";
import { useState } from "react";
import Quiz from "./Quiz";

export interface QuizItem {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface QuizSectionProps {
  quizzes: QuizItem[];
  passMark?: number;
}

export default function QuizSection({ quizzes, passMark }: QuizSectionProps) {
  const n = quizzes.length;
  const pass = passMark ?? Math.ceil(n * 0.8);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<boolean[]>(() => quizzes.map(() => false));

  function onAnswer(i: number, ok: boolean) {
    if (answered[i]) return;
    const na = [...answered];
    na[i] = true;
    setAnswered(na);
    if (ok) setScore((s) => s + 1);
  }

  const done = answered.every(Boolean);
  const passed = done && score >= pass;

  return (
    <div>
      <div
        className="callout"
        style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)", flexWrap: "wrap" }}
      >
        <strong>
          📊 Skor: {score}/{n}
        </strong>
        <span className="text-small text-muted">lulus ≥ {pass}</span>
        {done && (
          <strong style={{ color: passed ? "var(--success)" : "var(--warning)" }}>
            {passed ? "🎉 Lulus! Lanjut ke lesson berikutnya." : "💪 Belum lulus — baca ulang bagian yang sulit, lalu ulangi quiz."}
          </strong>
        )}
      </div>
      {quizzes.map((q, i) => (
        <Quiz
          key={i}
          question={q.question}
          options={q.options}
          correct={q.correct}
          explanation={q.explanation}
          onAnswer={(ok) => onAnswer(i, ok)}
        />
      ))}
    </div>
  );
}
