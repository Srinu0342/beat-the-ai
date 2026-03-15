import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { usePlayer } from "@/context/PlayerContext";
 
interface Player {
  id: string;
  name: string;
}

export default function Lobby() {
  const router = useRouter();
  const { code, player } = router.query;
  const resolvedCode = Array.isArray(code) ? code[0] : code;
  const { setSession } = usePlayer();
 
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const poll = async () => {
      if (!resolvedCode) return;
      const res = await fetch(`/api/game/lobby?code=${resolvedCode}`);
      const data = await res.json();
      setPlayers(data.players);
 
      if (data.game.state === "playing") {
        setSession({ playerId: player as string });
        router.push(`/game/${resolvedCode}`);
      }

      if (data.game.state === "ended") {
        router.replace(`/leaderboard/${resolvedCode}`);
      }
    };

    const interval = setInterval(poll, 2000);
    return () => clearInterval(interval);
  }, [resolvedCode, router, player, setSession]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top,#020617 10%,#030712 70%,#000)",
        color: "#e2e8f0",
        fontFamily: "'Space Grotesk','Inter',sans-serif",
        padding: "40px clamp(20px,4vw,80px)",
        display: "flex",
        justifyContent: "center"
      }}
    >
      <div style={{ width: "100%", maxWidth: 900 }}>
        <header
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
            marginBottom: 32
          }}
        >
          <div>
            <p style={{ textTransform: "uppercase", letterSpacing: 4, fontSize: 13, color: "#94a3b8" }}>
              Room {resolvedCode || "—"}
            </p>
            <h1 style={{ fontSize: "clamp(32px,5vw,48px)" }}>Waiting for contenders</h1>
          </div>
          <div
            style={{
              padding: "12px 20px",
              borderRadius: 999,
              background: "rgba(15,23,42,0.85)",
              border: "1px solid rgba(56,189,248,0.35)",
              display: "flex",
              flexDirection: "column",
              minWidth: 180
            }}
          >
            <span style={{ fontSize: 12, color: "#94a3b8" }}>Status</span>
            <span style={{ fontSize: 18, fontWeight: 600 }}>Pre-game</span>
          </div>
        </header>

        <div
          style={{
            background: "rgba(15,23,42,0.75)",
            borderRadius: 28,
            border: "1px solid rgba(148,163,184,0.2)",
            padding: 24,
            boxShadow: "0 40px 80px rgba(2,6,23,0.65)"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20
            }}
          >
            <h2 style={{ fontSize: 24 }}>Players in lobby</h2>
            <span style={{ color: "#94a3b8" }}>{players.length} joined</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {players.length === 0 && (
              <div
                style={{
                  padding: 18,
                  borderRadius: 16,
                  background: "rgba(2,6,23,0.6)",
                  border: "1px dashed rgba(148,163,184,0.3)",
                  textAlign: "center",
                  color: "#94a3b8"
                }}
              >
                Waiting for agents to connect…
              </div>
            )}

            {players.map((p, idx) => (
              <div
                key={p.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: 18,
                  borderRadius: 18,
                  background: "rgba(2,6,23,0.65)",
                  border: "1px solid rgba(148,163,184,0.2)"
                }}
              >
                <span style={{ fontWeight: 600 }}>
                  #{idx + 1} {p.name}
                </span>
                <span style={{ color: "#38bdf8", fontSize: 14 }}>READY</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
