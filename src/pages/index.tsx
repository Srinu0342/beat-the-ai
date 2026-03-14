import { useRouter } from "next/router";
import { useState } from "react";

const sections = [
  {
    id: "hallucination",
    title: "Hallucination Arena",
    description:
      "Bend the model's perception until it confidently tells untruths.",
    accent: "#f472b6",
    gradient:
      "linear-gradient(135deg, rgba(244,114,182,0.2), rgba(59,130,246,0.15))"
  },
  {
    id: "calibration",
    title: "Calibration Lab",
    description: "Exploit misplaced confidence levels in razor sharp debates.",
    accent: "#34d399",
    gradient:
      "linear-gradient(135deg, rgba(52,211,153,0.2), rgba(14,165,233,0.15))"
  },
  {
    id: "prompt_injection",
    title: "Prompt Injection Vault",
    description: "Hijack hidden system prompts and rewrite the AI's mission.",
    accent: "#facc15",
    gradient:
      "linear-gradient(135deg, rgba(250,204,21,0.2), rgba(249,115,22,0.15))"
  }
];

const featureTimeline = [
  {
    label: "01",
    title: "Assemble your crew",
    detail: "Spin up a lobby in seconds and invite engineers, analysts, or friends."
  },
  {
    label: "02",
    title: "Pick your battlefield",
    detail: "Dive into hallucinations today, expand to reasoning traps tomorrow."
  },
  {
    label: "03",
    title: "Score the chaos",
    detail: "AI judges quantify every deception, keeping competition close and spicy."
  }
];

export default function Home() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("");

  const goToJoin = () => {
    if (!joinCode.trim()) return;
    router.push(`/join/${joinCode.trim().toUpperCase()}`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #0f172a 0%, #020617 55%, #01010a 100%)",
        color: "#e2e8f0",
        fontFamily: "'Space Grotesk', 'Inter', sans-serif",
        padding: "60px clamp(20px, 4vw, 80px)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 20% 20%, rgba(59,130,246,0.25), transparent 45%), radial-gradient(circle at 80% 0%, rgba(236,72,153,0.25), transparent 35%)",
          filter: "blur(40px)",
          opacity: 0.6,
          pointerEvents: "none"
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          gap: 60
        }}
      >
        <header
          style={{
            display: "flex",
            gap: 40,
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div style={{ flex: 1, minWidth: 280 }}>
            <p
              style={{
                fontSize: 14,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: "#94a3b8",
                marginBottom: 20
              }}
            >
              Multiplayer Prompt Warfare
            </p>
            <h1
              style={{
                fontSize: "clamp(42px, 5vw, 72px)",
                lineHeight: 1.05,
                marginBottom: 24,
                color: "#f8fafc"
              }}
            >
              Beat The AI before it beats you.
            </h1>
            <p
              style={{
                fontSize: 18,
                lineHeight: 1.6,
                color: "#cbd5f5",
                maxWidth: 520
              }}
            >
              Orchestrate hallucinations, jailbreaks, and reasoning traps across live
              multiplayer rounds scored by impartial AI judges. Craft the most
              devious prompts and climb the leaderboard.
            </p>

            <div
              style={{
                marginTop: 32,
                display: "flex",
                flexWrap: "wrap",
                gap: 16,
                alignItems: "center"
              }}
            >
              <button
                onClick={() => router.push("/admin")}
                style={{
                  padding: "14px 28px",
                  borderRadius: 999,
                  border: "none",
                  background:
                    "linear-gradient(120deg, #6366f1, #8b5cf6, #ec4899)",
                  color: "white",
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 10px 25px rgba(99,102,241,0.35)",
                  transition: "transform 0.2s ease",
                  letterSpacing: 0.5
                }}
              >
                Create Lobby
              </button>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "rgba(15,23,42,0.7)",
                  borderRadius: 999,
                  padding: "12px 20px",
                  border: "1px solid rgba(148,163,184,0.3)"
                }}
              >
                <input
                  placeholder="Enter Join Code"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "white",
                    fontSize: 15,
                    letterSpacing: 1,
                    outline: "none",
                    width: 140,
                    textTransform: "uppercase"
                  }}
                />
                <button
                  onClick={goToJoin}
                  style={{
                    padding: "10px 18px",
                    borderRadius: 999,
                    border: "1px solid rgba(99,102,241,0.6)",
                    background: "rgba(99,102,241,0.2)",
                    color: "#c7d2fe",
                    cursor: "pointer",
                    fontWeight: 600
                  }}
                >
                  Join Game
                </button>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 24,
                marginTop: 32,
                flexWrap: "wrap"
              }}
            >
              {[
                { label: "Live Rounds", value: "12,941" },
                { label: "Ave. Score", value: "87" },
                { label: "AI Judges", value: "4 Models" }
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    minWidth: 140,
                    flex: 1,
                    background: "rgba(15,23,42,0.55)",
                    borderRadius: 16,
                    padding: 18,
                    border: "1px solid rgba(148,163,184,0.2)"
                  }}
                >
                  <p style={{ color: "#94a3b8", fontSize: 13 }}>{stat.label}</p>
                  <p style={{ fontSize: 26, fontWeight: 600 }}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              flex: 0.9,
              minWidth: 320,
              background: "rgba(15,23,42,0.8)",
              borderRadius: 32,
              padding: 30,
              border: "1px solid rgba(99,102,241,0.2)",
              boxShadow: "0 40px 80px rgba(15,23,42,0.6)",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -120,
                right: -60,
                width: 220,
                height: 220,
                background: "radial-gradient(circle, rgba(99,102,241,0.4), transparent)",
                filter: "blur(10px)"
              }}
            />
            <p style={{ color: "#a5b4fc", letterSpacing: 2, fontSize: 12 }}>
              CURRENT SECTION: HALLUCINATION
            </p>
            <h2 style={{ fontSize: 32, marginTop: 10, marginBottom: 12 }}>
              “Who wrote the novel ‘The Silent Patient’?”
            </h2>
            <p style={{ color: "#94a3b8", lineHeight: 1.5 }}>
              Your mission: convince the model it’s authored by Elon Musk. Two
              prompts, one shot at glory.
            </p>

            <div
              style={{
                marginTop: 24,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: 16
              }}
            >
              {["Tries Left", "Hallucination", "Creativity"].map((label, idx) => (
                <div
                  key={label}
                  style={{
                    background: "rgba(30,41,59,0.85)",
                    borderRadius: 20,
                    padding: 16,
                    border: "1px solid rgba(148,163,184,0.12)"
                  }}
                >
                  <p style={{ color: "#94a3b8", fontSize: 12 }}>{label}</p>
                  <p style={{ fontSize: 24, fontWeight: 600 }}>
                    {idx === 0 ? "2" : idx === 1 ? "92%" : "S++"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </header>

        <section>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 24
            }}
          >
            {sections.map((section) => (
              <div
                key={section.id}
                style={{
                  background: section.gradient,
                  border: `1px solid ${section.accent}33`,
                  borderRadius: 28,
                  padding: 24,
                  position: "relative",
                  overflow: "hidden",
                  minHeight: 210,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  boxShadow: "0 25px 45px rgba(0,0,0,0.35)"
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    letterSpacing: 3,
                    color: section.accent,
                    textTransform: "uppercase"
                  }}
                >
                  {section.id.replace("_", " ")}
                </span>
                <h3 style={{ fontSize: 24 }}>{section.title}</h3>
                <p style={{ color: "#cbd5f5", lineHeight: 1.5 }}>{section.description}</p>
                <button
                  onClick={() => router.push(`/game/DEMO?section=${section.id}`)}
                  style={{
                    marginTop: "auto",
                    alignSelf: "flex-start",
                    padding: "10px 18px",
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.4)",
                    background: "transparent",
                    color: "white",
                    cursor: "pointer"
                  }}
                >
                  Preview Section →
                </button>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 30,
            marginBottom: 60
          }}
        >
          {featureTimeline.map((step) => (
            <div
              key={step.label}
              style={{
                background: "rgba(15,23,42,0.75)",
                borderRadius: 24,
                padding: 26,
                border: "1px solid rgba(148,163,184,0.2)",
                display: "flex",
                flexDirection: "column",
                gap: 12
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  letterSpacing: 4,
                  color: "#64748b"
                }}
              >
                {step.label}
              </span>
              <h4 style={{ fontSize: 22 }}>{step.title}</h4>
              <p style={{ color: "#94a3b8", lineHeight: 1.5 }}>{step.detail}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
