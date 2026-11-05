"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    if (res.ok) {
      router.push("/");
    } else {
      setErr("Password salah");
    }
  }

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-16)" }}>
      <div className="card" style={{ maxWidth: "400px", margin: "0 auto" }}>
        <span className="eyebrow">Akses Terbatas</span>
        <h2>Masuk</h2>
        <form onSubmit={submit}>
          <div className="field" style={{ marginTop: "var(--sp-4)" }}>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Password"
              autoFocus
            />
          </div>
          {err && <p className="text-small" style={{ color: "var(--red-600)" }}>{err}</p>}
          <button type="submit" className="btn btn-primary" style={{ marginTop: "var(--sp-4)" }}>
            Masuk →
          </button>
        </form>
      </div>
    </div>
  );
}
