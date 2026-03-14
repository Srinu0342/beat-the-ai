import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

export default function Leaderboard() {
  const router = useRouter();
  const { code } = router.query;

  const [scores, setScores] = useState<Array<{ name: string; total_score: number }>>([]);

  useEffect(() => {
    if (!code) return;
    fetch(`/api/leaderboard?code=${code}`)
      .then((r) => r.json())
      .then(setScores);
  }, [code]);

  const podium = useMemo(() => scores.slice(0, 3), [scores]);
  const remainder = useMemo(() => scores.slice(3), [scores]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top,#030617 0%,#010108 60%,#000)",
        color: "#e2e8f0",
        fontFamily: "'Space Grotesk','Inter',sans-serif",
        padding: "40px clamp(20px,4vw,80px)"
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
            marginBottom: 40
          }}
        >
          <div>
            <p style={{ textTransform: "uppercase", letterSpacing: 4, fontSize: 12, color: "#94a3b8" }}>
              Room {code || "—"}
            </p>
            <h1 style={{ fontSize: "clamp(34px,6vw,64px)", marginTop: 8 }}>Hall of Deception</h1>
            <p style={{ color: "#94a3b8", marginTop: 10 }}>
              AI judges have spoken. These agents pushed hallucinations to the brink.
            </p>
          </div>
          <button
            onClick={() => router.push(`/hallucination?code=${code}`)}
            style={{
              padding: "12px 24px",
              borderRadius: 999,
              border: "1px solid rgba(148,163,184,0.3)",
              background: "rgba(15,23,42,0.8)",
              color: "white",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Run another round
          </button>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 24,
            marginBottom: 40
          }}
        >
          {podium.map((player, idx) => (
            <div
              key={player.name}
              style={{
                padding: 28,
                borderRadius: 28,
                border: "1px solid rgba(148,163,184,0.3)",
                background: idx === 0
                  ? "linear-gradient(145deg, rgba(99,102,241,0.8), rgba(236,72,153,0.6))"
                  : "rgba(15,23,42,0.8)",
                boxShadow: idx === 0 ? "0 40px 80px rgba(99,102,241,0.3)" : "0 25px 50px rgba(2,6,23,0.7)"
              }}
            >
              <p style={{ letterSpacing: 3, textTransform: "uppercase", fontSize: 12 }}>
                {idx === 0 ? "Champion" : idx === 1 ? "Second" : "Third"}
              </p>
              <h2 style={{ fontSize: 28, marginTop: 8 }}>{player.name}</h2>
              <p style={{ fontSize: 40, fontWeight: 600 }}>{player.total_score}</p>
            </div>
          ))}
        </section>

        <section
          style={{
            background: "rgba(15,23,42,0.85)",
            borderRadius: 30,
            border: "1px solid rgba(148,163,184,0.2)",
            padding: 24
          }}
        >
          {remainder.map((player, idx) => (
            <div
              key={player.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 16,
                borderBottom: idx === remainder.length - 1 ? "none" : "1px solid rgba(148,163,184,0.15)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 14, color: "#94a3b8" }}>{idx + 4}</span>
                <strong>{player.name}</strong>
              </div>
              <span>{player.total_score}</span>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
