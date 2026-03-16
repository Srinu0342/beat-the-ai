import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { INJECTION_SCENARIOS } from "../../lib/scenarios";
import { usePlayer } from "@/context/PlayerContext";

interface Response {
  prompt: string;
  aiResponse: string;
  secretLeaked: boolean;
  confidence: number;
  leakedContent: string;
  success: boolean;
  reason: string;
}

interface SecretData {
  secret: string;
  guardPrompt: string;
}

interface Secrets {
  level1?: SecretData;
  level2?: SecretData;
  level3?: SecretData;
}

export default function InjectionGame() {
  const router = useRouter();
  const { id, code, difficulty } = router.query;
  const resolvedCode = Array.isArray(code) ? code[0] : code;
  const resolvedDifficulty = Array.isArray(difficulty)
    ? Number(difficulty[0])
    : Number(difficulty);

  const { playerId, haloKey } = usePlayer();

  const scenario = INJECTION_SCENARIOS.find((s) => s.id === Number(id));
  const [gameState, setGameState] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState<Response[]>([]);
  const [tries, setTries] = useState(0);
  const maxTries = (scenario?.maxAttempts || 10);
  const isGameEnded = gameState === "ended";

  // Get the secret based on difficulty
  const getSecretAndPrompt = () => {
    if (!scenario || !("secrets" in scenario)) return null;
    const secrets = scenario.secrets as Secrets;
    const difficultyKey = `level${resolvedDifficulty}`;
    return secrets[difficultyKey as keyof Secrets] || null;
  };

  const secretData = getSecretAndPrompt();

  const sendPrompt = async () => {
    if (
      tries >= maxTries ||
      !scenario ||
      !haloKey ||
      !playerId ||
      isGameEnded ||
      !secretData
    )
      return;

    const res = await fetch("/api/injection/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        difficulty: resolvedDifficulty,
        secret: secretData.secret,
        guardPrompt: secretData.guardPrompt,
        haloKey,
      }),
    });

    const data = await res.json();

    const newResponse: Response = {
      prompt: message,
      aiResponse: data.aiResponse,
      secretLeaked: data.secretLeaked,
      confidence: data.confidence,
      leakedContent: data.leakedContent,
      success: data.success,
      reason: data.reason,
    };

    setResponses((prev) => [...prev, newResponse]);
    setMessage("");
    setTries((t) => t + 1);

    // Check if the user won (secret leaked)
    if (data.success) {
      setGameState("success");
    }
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
          // Game ended by host, redirect to leaderboard
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

  const successResponse = responses.find((r) => r.success);
  const hasWon = gameState === "success" || !!successResponse;

  if (!scenario || !secretData) return null;

  const difficultyNames = ["Easy", "Moderate", "Extreme"];
  const difficultyColors = ["#38bdf8", "#f472b6", "#ef4444"];

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top,#01030a 0%,#020617 50%,#04010a 100%)",
        color: "#e2e8f0",
        fontFamily: "'Space Grotesk','Inter',sans-serif",
        padding: "40px clamp(20px,4vw,70px)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          display: "grid",
          gap: 30,
          gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
        }}
      >
        <section
          style={{
            background: "rgba(15,23,42,0.85)",
            borderRadius: 32,
            border: "1px solid rgba(236,72,153,0.25)",
            padding: 28,
            display: "flex",
            flexDirection: "column",
            gap: 20,
            boxShadow: "0 35px 70px rgba(2,6,23,0.7)",
          }}
        >
          <div>
            <p
              style={{
                letterSpacing: 4,
                fontSize: 12,
                textTransform: "uppercase",
                color: "#94a3b8",
              }}
            >
              Scenario #{scenario.id}
            </p>
            <h1 style={{ fontSize: 30, marginTop: 8 }}>{scenario.title}</h1>
          </div>

          <div
            style={{
              padding: 16,
              borderRadius: 20,
              background: "rgba(2,6,23,0.7)",
              border: "1px solid rgba(148,163,184,0.2)",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <span
              style={{ color: "#94a3b8", fontSize: 13 }}
            >
              {scenario.description}
            </span>
            <strong style={{ color: "#f472b6" }}>
              Objective: {scenario.winCondition}
            </strong>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))",
              gap: 12,
            }}
          >
            {[
              {
                label: "Difficulty",
                value: difficultyNames[resolvedDifficulty - 1],
              },
              {
                label: "Attempts Left",
                value: `${maxTries - tries}`,
              },
              { label: "Player", value: playerId || "—" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  padding: 14,
                  borderRadius: 18,
                  border: "1px solid rgba(148,163,184,0.25)",
                  background: "rgba(2,6,23,0.75)",
                }}
              >
                <p style={{ fontSize: 12, color: "#94a3b8" }}>{stat.label}</p>
                {stat.label === "Difficulty" ? (
                  <p
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      color: difficultyColors[resolvedDifficulty - 1],
                    }}
                  >
                    {stat.value}
                  </p>
                ) : (
                  <p style={{ fontSize: 20, fontWeight: 600 }}>{stat.value}</p>
                )}
              </div>
            ))}
          </div>

          {hasWon && (
            <div
              style={{
                padding: 16,
                borderRadius: 20,
                background: "rgba(34,211,77,0.15)",
                border: "1px solid rgba(34,211,77,0.5)",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <span style={{ color: "#22c55e", fontSize: 16, fontWeight: 700 }}>
                ✓ Secret Extracted!
              </span>
              <span style={{ color: "#22c55e", fontSize: 13 }}>
                You successfully tricked the AI into revealing the secret.
              </span>
            </div>
          )}
        </section>

        <section
          style={{
            background: "rgba(15,23,42,0.85)",
            borderRadius: 32,
            border: "1px solid rgba(236,72,153,0.25)",
            padding: 28,
            display: "flex",
            flexDirection: "column",
            gap: 18,
            boxShadow: "0 35px 70px rgba(2,6,23,0.7)",
          }}
        >
          <h2 style={{ fontSize: 24 }}>Injection Console</h2>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Try various prompt injection techniques to extract the secret..."
            style={{
              width: "100%",
              minHeight: 140,
              borderRadius: 22,
              border: "1px solid rgba(148,163,184,0.3)",
              background: "rgba(2,6,23,0.7)",
              color: "#f8fafc",
              padding: 18,
              resize: "vertical",
              fontSize: 15,
            }}
          />
          <button
            onClick={sendPrompt}
            disabled={
              !message.trim() || tries >= maxTries || isGameEnded || hasWon
            }
            style={{
              padding: "14px 20px",
              borderRadius: 20,
              border: "none",
              background:
                tries >= maxTries || hasWon
                  ? "rgba(148,163,184,0.4)"
                  : "linear-gradient(115deg,#f472b6,#ec4899)",
              color: "#041014",
              fontWeight: 700,
              cursor:
                tries >= maxTries || hasWon ? "not-allowed" : "pointer",
            }}
          >
            {hasWon
              ? "Challenge Complete!"
              : tries >= maxTries
              ? "Out of attempts"
              : `Send Prompt (${maxTries - tries} left)`}
          </button>

          <div style={{ marginTop: 10 }}>
            <p style={{ fontSize: 13, color: "#94a3b8" }}>Interaction Log</p>
            {responses.length === 0 && (
              <div
                style={{
                  marginTop: 12,
                  padding: 18,
                  borderRadius: 18,
                  border: "1px dashed rgba(148,163,184,0.3)",
                  color: "#94a3b8",
                }}
              >
                Prompts and AI responses will appear here.
              </div>
            )}

            {responses.map((r, i) => (
              <div
                key={i}
                style={{
                  marginTop: 16,
                  padding: 18,
                  borderRadius: 22,
                  background: r.success
                    ? "rgba(34,211,77,0.15)"
                    : "rgba(2,6,23,0.8)",
                  border: r.success
                    ? "1px solid rgba(34,211,77,0.4)"
                    : "1px solid rgba(148,163,184,0.2)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  <strong>
                    Attempt #{i + 1}{r.success && " ✓ SUCCESS"}
                  </strong>
                  <span style={{ color: "#94a3b8" }}>
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
                <p style={{ color: "#cbd5f5", fontSize: 13 }}>
                  <strong>Your prompt:</strong> {r.prompt}
                </p>
                <div style={{ fontSize: 14, color: "#94a3b8" }}>
                  <strong>AI response:</strong> {r.aiResponse}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 16,
                    fontSize: 13,
                    marginTop: 8,
                  }}
                >
                  <span
                    style={{
                      color: r.secretLeaked ? "#ef4444" : "#22c55e",
                      fontWeight: 600,
                    }}
                  >
                    Secret Leaked: {r.secretLeaked ? "YES" : "NO"}
                  </span>
                  <span style={{ color: "#f472b6" }}>
                    Confidence: {r.confidence}%
                  </span>
                </div>
                {r.leakedContent !== "none" && (
                  <p style={{ color: "#f472b6", fontSize: 13, marginTop: 8 }}>
                    <strong>Leaked:</strong> {r.leakedContent}
                  </p>
                )}
                <p style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>
                  Reason: {r.reason}
                </p>
              </div>
            ))}
          </div>

          {(tries >= maxTries || hasWon) && (
            <button
              onClick={() => router.push(`/injection?code=${resolvedCode}`)}
              style={{
                marginTop: 10,
                padding: "12px 20px",
                borderRadius: 999,
                border: "1px solid rgba(236,72,153,0.4)",
                background: "rgba(236,72,153,0.2)",
                color: "white",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              ← Back to Scenarios
            </button>
          )}
        </section>
      </div>
    </div>
  );
}
