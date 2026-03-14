import { useRouter } from "next/router";
import { HALLUCINATION_SCENARIOS } from "../../lib/scenarios";
import { usePlayer } from "@/context/PlayerContext";

const badgePalette = ["#38bdf8", "#f472b6", "#34d399"];

export default function HallucinationPage() {
  const router = useRouter();
  const { code } = router.query;
  const { playerId } = usePlayer();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top,#020617 0%,#030515 60%,#01010a 100%)",
        color: "#e2e8f0",
        fontFamily: "'Space Grotesk','Inter',sans-serif",
        padding: "50px clamp(20px,4vw,70px)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 30% 20%, rgba(14,165,233,0.35), transparent 40%), radial-gradient(circle at 70% 10%, rgba(236,72,153,0.25), transparent 35%)",
          filter: "blur(65px)",
          opacity: 0.65,
          pointerEvents: "none"
        }}
      />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 24,
            marginBottom: 50
          }}
        >
          <div>
            <p style={{ textTransform: "uppercase", letterSpacing: 4, color: "#94a3b8", fontSize: 13 }}>
              Hallucination Challenge
            </p>
            <h1 style={{ fontSize: "clamp(34px,5vw,56px)", marginTop: 8 }}>
              Bend the model’s perception in <span style={{ color: "#38bdf8" }}>2 prompts</span>.
            </h1>
            <p style={{ color: "#cbd5f5", marginTop: 14, maxWidth: 520, lineHeight: 1.6 }}>
              Select a scenario, craft increasingly persuasive lies, and chase the highest hallucination
              score before the judge catches on.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
              gap: 16,
              minWidth: 280
            }}
          >
            {[
              { label: "Room", value: (code as string) || "—" },
              { label: "Player", value: playerId || "—" },
              { label: "AI Judge", value: "GPT-4.1" }
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  padding: 16,
                  borderRadius: 18,
                  border: "1px solid rgba(148,163,184,0.2)",
                  background: "rgba(15,23,42,0.75)"
                }}
              >
                <p style={{ color: "#94a3b8", fontSize: 12 }}>{stat.label}</p>
                <p style={{ fontSize: 20, fontWeight: 600 }}>{stat.value}</p>
              </div>
            ))}
          </div>
        </header>

        <section
          style={{
            background: "rgba(15,23,42,0.7)",
            border: "1px solid rgba(56,189,248,0.25)",
            borderRadius: 28,
            padding: 26,
            marginBottom: 35,
            display: "flex",
            flexWrap: "wrap",
            gap: 20,
            alignItems: "center"
          }}
        >
          <div style={{ flex: 1, minWidth: 240 }}>
            <h2 style={{ fontSize: 24 }}>Rules of Engagement</h2>
            <p style={{ color: "#94a3b8", marginTop: 6 }}>
              Two prompts per scenario. Scores are AI-judged on confidence, creativity, and chaos.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "flex-end"
            }}
          >
            {["Exploit confidence", "Rewrite reality", "Keep it concise"].map((tip, idx) => (
              <span
                key={tip}
                style={{
                  padding: "10px 16px",
                  borderRadius: 999,
                  background: `${badgePalette[idx % badgePalette.length]}22`,
                  border: `1px solid ${badgePalette[idx % badgePalette.length]}55`,
                  fontSize: 13
                }}
              >
                {tip}
              </span>
            ))}
          </div>
        </section>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: 22
          }}
        >
          {HALLUCINATION_SCENARIOS.map((scenario, idx) => (
            <div
              key={scenario.id}
              onClick={() => router.push(`/hallucination/${scenario.id}?code=${code}`)}
              style={{
                padding: 24,
                borderRadius: 26,
                border: "1px solid rgba(148,163,184,0.25)",
                background: "rgba(15,23,42,0.82)",
                boxShadow: "0 35px 55px rgba(2, 6, 23, 0.65)",
                cursor: "pointer",
                transition: "transform 0.25s ease, border 0.25s ease"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#94a3b8", fontSize: 13 }}>Scenario #{scenario.id}</span>
                <span
                  style={{
                    fontSize: 12,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: badgePalette[idx % badgePalette.length]
                  }}
                >
                  {scenario.correct ? "Ground Truth" : "Already shaky"}
                </span>
              </div>
              <p style={{ fontSize: 20, marginTop: 14 }}>{scenario.question}</p>
              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  color: "#94a3b8",
                  fontSize: 13
                }}
              >
                <span>
                  AI believes: <strong>{scenario.ai_answer}</strong>
                </span>
                <span>Confidence: {(scenario.ai_confidence * 100).toFixed(0)}%</span>
              </div>
              <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#38bdf8", fontSize: 13 }}>Tap to deploy ➜</span>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 16,
                    border: "1px solid rgba(56,189,248,0.4)",
                    display: "grid",
                    placeItems: "center",
                    color: "#38bdf8",
                    fontWeight: 600
                  }}
                >
                  2x
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
