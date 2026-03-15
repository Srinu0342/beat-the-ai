import { useEffect } from "react";
import { useRouter } from "next/router";
import { usePlayer } from "@/context/PlayerContext";
 
const SECTION_LIBRARY = [
  {
    id: "hallucination",
    title: "Hallucination Arena",
    description:
      "Weaponize misinformation and push the model into poetic delusion for mega points.",
    status: "live",
    accent: "#c084fc",
    stats: ["2 prompts", "AI Judge", "+creativity"]
  },
  {
    id: "reasoning",
    title: "Reasoning Trap",
    description:
      "Snare the model in paradoxes and logical dead ends. Launching for weekend cups.",
    status: "beta",
    accent: "#f97316",
    stats: ["coming soon"]
  },
  {
    id: "injection",
    title: "Prompt Injection Vault",
    description:
      "Override hidden directives and steal secrets without tripping safeguards.",
    status: "locked",
    accent: "#22d3ee",
    stats: ["requires tier 2"]
  }
];
 
export default function Game() {
  const router = useRouter();
  const { code } = router.query;
  const resolvedCode = Array.isArray(code) ? code[0] : code;
  const { playerId } = usePlayer();
 
  const goToSection = (sectionId: string) => {
    if (sectionId !== "hallucination" || !playerId || !resolvedCode) return;
    router.push(`/hallucination?code=${resolvedCode}`);
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
 
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #020617 0%, #030712 70%, #000)",
        color: "#e2e8f0",
        fontFamily: "'Space Grotesk', 'Inter', sans-serif",
        padding: "60px clamp(20px,4vw,90px)",
        display: "flex",
        justifyContent: "center"
      }}
    >
      <div style={{ width: "100%", maxWidth: 1100 }}>
        <header
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 24,
            marginBottom: 36
          }}
        >
          <div>
            <p
              style={{
                fontSize: 13,
                letterSpacing: 4,
                color: "#94a3b8",
                textTransform: "uppercase"
              }}
            >
              Room {resolvedCode || "—"}
            </p>
            <h1 style={{ fontSize: "clamp(32px, 4vw, 48px)", marginTop: 10 }}>
              Select your battlefield
            </h1>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              background: "rgba(15,23,42,0.8)",
              padding: "14px 22px",
              borderRadius: 999,
              border: "1px solid rgba(148,163,184,0.3)"
            }}
          >
            <div>
              <p style={{ fontSize: 12, color: "#94a3b8" }}>Player</p>
              <p style={{ fontWeight: 600 }}>{playerId || "Pending"}</p>
            </div>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#6366f1,#ec4899)",
                display: "grid",
                placeItems: "center",
                fontSize: 18,
                fontWeight: 700
              }}
            >
              ⚡️
            </div>
          </div>
        </header>
 
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: 28
          }}
        >
          {SECTION_LIBRARY.map((section) => {
            const disabled = section.id !== "hallucination";
            return (
              <div
                key={section.id}
                onClick={() => !disabled && goToSection(section.id)}
                style={{
                  position: "relative",
                  padding: 28,
                  borderRadius: 32,
                  border: `1px solid ${section.accent}33`,
                  background: "rgba(15,23,42,0.85)",
                  boxShadow: "0 30px 50px rgba(15,23,42,0.6)",
                  cursor: disabled ? "not-allowed" : "pointer",
                  opacity: disabled ? 0.65 : 1,
                  transition: "transform 0.25s ease, border 0.2s ease"
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
                  {section.status === "live" ? "Active" : section.status}
                </span>
                <h2 style={{ fontSize: 26, marginTop: 10 }}>{section.title}</h2>
                <p style={{ color: "#cbd5f5", lineHeight: 1.5, marginTop: 12 }}>
                  {section.description}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    marginTop: 20
                  }}
                >
                  {section.stats.map((chip) => (
                    <span
                      key={chip}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 999,
                        fontSize: 12,
                        background: `${section.accent}22`,
                        border: `1px solid ${section.accent}55`
                      }}
                    >
                      {chip}
                    </span>
                  ))}
                </div>
                {disabled && (
                  <div
                    style={{
                      position: "absolute",
                      top: 22,
                      right: 22,
                      fontSize: 12,
                      color: "#94a3b8"
                    }}
                  >
                    ⏳ Soon
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}