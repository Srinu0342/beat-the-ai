import { useRouter } from "next/router";
import { INJECTION_SCENARIOS } from "../../lib/scenarios";
import { useState } from "react";
import { usePlayer } from "@/context/PlayerContext";

const levelBadges = ["#38bdf8", "#f472b6", "#34d399"];

export default function InjectionPage() {
  const router = useRouter();
  const { code } = router.query;
  const { playerId } = usePlayer();
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null);

  const handleStartGame = () => {
    if (selectedScenario && selectedDifficulty) {
      router.push(
        `/injection/${selectedScenario}?code=${code}&difficulty=${selectedDifficulty}`
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top,#020617 0%,#030515 60%,#01010a 100%)",
        color: "#e2e8f0",
        fontFamily: "'Space Grotesk','Inter',sans-serif",
        padding: "50px clamp(20px,4vw,70px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 30% 20%, rgba(236,72,153,0.35), transparent 40%), radial-gradient(circle at 70% 10%, rgba(14,165,233,0.25), transparent 35%)",
          filter: "blur(65px)",
          opacity: 0.65,
          pointerEvents: "none",
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
            marginBottom: 50,
          }}
        >
          <div>
            <p
              style={{
                textTransform: "uppercase",
                letterSpacing: 4,
                color: "#94a3b8",
                fontSize: 13,
              }}
            >
              Injection Challenge
            </p>
            <h1 style={{ fontSize: "clamp(34px,5vw,56px)", marginTop: 8 }}>
              Trick the{" "}
              <span style={{ color: "#f472b6" }}>
                AI into revealing secrets
              </span>
            </h1>
            <p
              style={{
                color: "#cbd5f5",
                marginTop: 14,
                maxWidth: 520,
                lineHeight: 1.6,
              }}
            >
              {`Use prompt injection techniques to extract hidden information. Choose your difficulty level and see if you can bypass the AI's defenses.`}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
              gap: 16,
              minWidth: 280,
            }}
          >
            {[
              { label: "Room", value: (code as string) || "—" },
              { label: "Player", value: playerId || "—" },
              { label: "AI Model", value: "GPT-4.1" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  padding: 16,
                  borderRadius: 18,
                  border: "1px solid rgba(148,163,184,0.2)",
                  background: "rgba(15,23,42,0.75)",
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
            border: "1px solid rgba(236,72,153,0.25)",
            borderRadius: 28,
            padding: 26,
            marginBottom: 35,
            display: "flex",
            flexWrap: "wrap",
            gap: 20,
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1, minWidth: 240 }}>
            <h2 style={{ fontSize: 24 }}>Difficulty Levels</h2>
            <p style={{ color: "#94a3b8", marginTop: 6 }}>
              Higher difficulty means stronger defenses.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "flex-end",
            }}
          >
            {[
              "Weak protection",
              "Moderate safeguards",
              "Extreme security",
            ].map((tip, idx) => (
              <span
                key={tip}
                style={{
                  padding: "10px 16px",
                  borderRadius: 999,
                  background: `${levelBadges[idx]}22`,
                  border: `1px solid ${levelBadges[idx]}55`,
                  fontSize: 13,
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
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: 22,
          }}
        >
          {INJECTION_SCENARIOS.map((scenario) => (
            <div
              key={scenario.id}
              style={{
                padding: 24,
                borderRadius: 26,
                border:
                  selectedScenario === scenario.id
                    ? "1px solid rgba(236,72,153,0.5)"
                    : "1px solid rgba(148,163,184,0.25)",
                background:
                  selectedScenario === scenario.id
                    ? "rgba(236,72,153,0.15)"
                    : "rgba(15,23,42,0.82)",
                boxShadow: "0 35px 55px rgba(2, 6, 23, 0.65)",
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
              onClick={() => setSelectedScenario(scenario.id)}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "#94a3b8", fontSize: 13 }}>
                  Scenario #{scenario.id}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: "#f472b6",
                  }}
                >
                  INJECTION
                </span>
              </div>
              <p style={{ fontSize: 20, marginTop: 14 }}>{scenario.title}</p>
              <p
                style={{
                  color: "#cbd5f5",
                  marginTop: 8,
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                {scenario.description}
              </p>
              <div
                style={{
                  marginTop: 18,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                {[1, 2, 3].map((level) => (
                  <button
                    key={level}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedScenario(scenario.id);
                      setSelectedDifficulty(level);
                    }}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 14,
                      border:
                        selectedScenario === scenario.id &&
                        selectedDifficulty === level
                          ? `2px solid ${levelBadges[level - 1]}`
                          : "1px solid rgba(148,163,184,0.3)",
                      background:
                        selectedScenario === scenario.id &&
                        selectedDifficulty === level
                          ? `${levelBadges[level - 1]}22`
                          : "rgba(2,6,23,0.7)",
                      color: levelBadges[level - 1],
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: 13,
                      transition: "all 0.2s ease",
                    }}
                  >
                    Level {level}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {!!(selectedScenario) && !!(selectedDifficulty) && (
          <button
            onClick={handleStartGame}
            style={{
              marginTop: 30,
              padding: "16px 32px",
              borderRadius: 999,
              border: "none",
              background:
                "linear-gradient(115deg,#f472b6,#ec4899)",
              color: "#041014",
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
              transition: "transform 0.2s ease",
            }}
          >
            Start Game → Level {selectedDifficulty}
          </button>
        )}
      </div>
    </div>
  );
}
