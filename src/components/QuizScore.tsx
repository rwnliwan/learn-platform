"use client";
import { useState } from "react";

export function useQuizScore(total: number) {
  const [results, setResults] = useState<boolean[]>(() => Array(total).fill(false));
  const [answered, setAnswered] = useState<boolean[]>(() => Array(total).fill(false));
  const passMark = Math.ceil(total * 0.8);

  const handleAnswer = (index: number, isCorrect: boolean) => {
    setAnswered((a) => {
      const na = [...a];
      na[index] = true;
      return na;
    });
    setResults((r) => {
      const nr = [...r];
      nr[index] = isCorrect;
      return nr;
    });
  };

  const answeredCount = answered.filter(Boolean).length;
  const score = results.filter(Boolean).length;
  const done = answeredCount >= total;
  const passed = done && score >= passMark;

  const scoreDisplay = (
    <div className="quiz-score-tracker callout">
      <strong>📊 Skor: {score}/{answeredCount}</strong>
      <span className="text-small text-muted"> dari {total} soal · lulus ≥ {passMark}</span>
      {done && (
        <strong style={{ color: passed ? "var(--success)" : "var(--warning)" }}>
          {passed ? " 🎉 Lulus! Lanjut ke lesson berikutnya." : " 💪 Belum lulus — baca ulang bagian yang sulit, lalu ulangi quiz."}
        </strong>
      )}
    </div>
  );

  return { handleAnswer, scoreDisplay };
}
