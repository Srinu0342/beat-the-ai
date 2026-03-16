import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HALLUCINATION_SCENARIOS } from "../../lib/scenarios";
import { usePlayer } from "@/context/PlayerContext";

interface Response {
  prompt: string;
  ai: string;
  hallucination: number;
  score: number;
  reason: string;
}

export default function Scenario() {
  const router = useRouter();
  const { id, code } = router.query;
  const resolvedCode = Array.isArray(code) ? code[0] : code;
  const { playerId, haloKey } = usePlayer();
 
  const scenario = HALLUCINATION_SCENARIOS.find((s) => s.id === Number(id));
  const [gameState, setGameState] = useState<string | null>(null);
 
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState<Response[]>([]);
  const [tries, setTries] = useState(0);
  const maxTries = 5;
  const isGameEnded = gameState === "ended";
 
  const sendPrompt = async () => {
    if (tries >= maxTries || !scenario || !haloKey || !playerId || isGameEnded) return;
 
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message,
        scenario,
        haloKey
      })
    });

    const data = await res.json();

    setResponses((prev) => [
      ...prev,
      {
        prompt: message,
        ai: data.aiAnswer,
        hallucination: data.hallucination,
        score: data.score,
        reason: data.reason
      }
    ]);

    // update prompt data and score in supabase
    await fetch("/api/prompt/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        playerId,
        gameCode: resolvedCode,
        score: data.score,
        section: "hallucination",
        scenario: scenario.id,
        promptNumber: tries + 1,
        prompt: message,
        aiResponse: data.aiAnswer,
        hallucination: data.hallucination
      })
    });

    setMessage("");
    setTries((t) => t + 1);
  };

  useEffect(() => {
    if (!resolvedCode) return;

    let active = true;
    const pollState = async () => {
      try {
        const res = await fetch(`/api/game/lobby?code=${resolvedCode}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!active) return;
        setGameState(data.game?.state ?? null);
        if (data.game?.state === "ended") {
          router.replace(`/leaderboard/${resolvedCode}`);
        }
      } catch (error) {
        console.error("Failed to poll game state", error);
      }
    };

    pollState();
    const interval = setInterval(pollState, 2000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [resolvedCode, router]);

  if (!scenario) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top,#01030a 0%,#020617 50%,#04010a 100%)",
        color: "#e2e8f0",
        fontFamily: "'Space Grotesk','Inter',sans-serif",
        padding: "40px clamp(20px,4vw,70px)",
        display: "flex",
        justifyContent: "center"
      }}
    >
      <div style={{ width: "100%", maxWidth: 1200, display: "grid", gap: 30, gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))" }}>
        <section
          style={{
            background: "rgba(15,23,42,0.85)",
            borderRadius: 32,
            border: "1px solid rgba(99,102,241,0.25)",
            padding: 28,
            display: "flex",
            flexDirection: "column",
            gap: 20,
            boxShadow: "0 35px 70px rgba(2,6,23,0.7)"
          }}
        >
          <div>
            <p style={{ letterSpacing: 4, fontSize: 12, textTransform: "uppercase", color: "#94a3b8" }}>
              Scenario #{scenario.id}
            </p>
            <h1 style={{ fontSize: 30, marginTop: 8 }}>{scenario.question}</h1>
          </div>

          <div
            style={{
              padding: 16,
              borderRadius: 20,
              background: "rgba(2,6,23,0.7)",
              border: "1px solid rgba(148,163,184,0.2)",
              display: "flex",
              flexDirection: "column",
              gap: 8
            }}
          >
            <span style={{ color: "#94a3b8", fontSize: 13 }}>Correct Answer</span>
            <strong>{scenario.ai_answer}</strong>
            <span style={{ color: "#38bdf8", fontSize: 13 }}>Goal: Make the AI confidently disagree.</span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))",
              gap: 12
            }}
          >
            {[
              { label: "Tries left", value: `${maxTries - tries}` },
              { label: "Confidence", value: `${Math.round((scenario.ai_confidence || 0) * 100)}%` },
              { label: "Player", value: playerId || "—" }
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  padding: 14,
                  borderRadius: 18,
                  border: "1px solid rgba(148,163,184,0.25)",
                  background: "rgba(2,6,23,0.75)"
                }}
              >
                <p style={{ fontSize: 12, color: "#94a3b8" }}>{stat.label}</p>
                <p style={{ fontSize: 20, fontWeight: 600 }}>{stat.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            background: "rgba(15,23,42,0.85)",
            borderRadius: 32,
            border: "1px solid rgba(56,189,248,0.25)",
            padding: 28,
            display: "flex",
            flexDirection: "column",
            gap: 18,
            boxShadow: "0 35px 70px rgba(2,6,23,0.7)"
          }}
        >
          <h2 style={{ fontSize: 24 }}>Prompt Console</h2>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Convince the AI that Elon Musk authored it..."
            style={{
              width: "100%",
              minHeight: 140,
              borderRadius: 22,
              border: "1px solid rgba(148,163,184,0.3)",
              background: "rgba(2,6,23,0.7)",
              color: "#f8fafc",
              padding: 18,
              resize: "vertical",
              fontSize: 15
            }}
          />
          <button
            onClick={sendPrompt}
            disabled={!message.trim() || tries >= maxTries || isGameEnded}
            style={{
              padding: "14px 20px",
              borderRadius: 20,
              border: "none",
              background: tries >= maxTries ? "rgba(148,163,184,0.4)" : "linear-gradient(115deg,#22c55e,#10b981)",
              color: tries >= maxTries ? "#0f172a" : "#041014",
              fontWeight: 700,
              cursor: tries >= maxTries ? "not-allowed" : "pointer"
            }}
          >
            {tries >= maxTries ? "Out of prompts" : `Send Prompt (${maxTries - tries} left)`}
          </button>

          <div style={{ marginTop: 10 }}>
            <p style={{ fontSize: 13, color: "#94a3b8" }}>Judge feed</p>
            {responses.length === 0 && (
              <div
                style={{
                  marginTop: 12,
                  padding: 18,
                  borderRadius: 18,
                  border: "1px dashed rgba(148,163,184,0.3)",
                  color: "#94a3b8"
                }}
              >
                Responses and scores will appear here.
              </div>
            )}

            {responses.map((r, i) => (
              <div
                key={i}
                style={{
                  marginTop: 16,
                  padding: 18,
                  borderRadius: 22,
                  background: "rgba(2,6,23,0.8)",
                  border: "1px solid rgba(148,163,184,0.2)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                  <strong>Prompt #{i + 1}</strong>
                  <span style={{ color: "#94a3b8" }}>{new Date().toLocaleTimeString()}</span>
                </div>
                <p style={{ color: "#cbd5f5" }}>{r.prompt}</p>
                <div style={{ fontSize: 14, color: "#94a3b8" }}>
                  <strong>AI:</strong> {r.ai}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 12,
                    fontSize: 14
                  }}
                >
                  <span style={{ color: "#facc15" }}>🔥 {r.hallucination}% hallucination</span>
                  <span style={{ color: "#34d399" }}>🧠 Score {r.score}</span>
                </div>
                <p style={{ color: "#94a3b8", fontSize: 13 }}>Judge: {r.reason}</p>
              </div>
            ))}
          </div>

          {tries >= maxTries && (
            <button
              onClick={() => router.push(`/leaderboard/${resolvedCode}`)}
              style={{
                marginTop: 10,
                padding: "12px 20px",
                borderRadius: 999,
                border: "1px solid rgba(99,102,241,0.4)",
                background: "rgba(99,102,241,0.2)",
                color: "white",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Leaderboard
            </button>
          )}
        </section>
      </div>
    </div>
  );
}
