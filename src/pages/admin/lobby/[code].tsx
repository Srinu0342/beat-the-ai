import { useRouter } from "next/router";
import { useEffect, useState } from "react";
 
interface Player {
  id: string;
  name: string;
}

interface InjectionEntry {
  player_id: string;
  players: {
    name: string;
  };
  created_at: string;
  scenario: number;
  prompt_text: string;
}
 
export default function AdminLobby() {
  const router = useRouter();
  const { code } = router.query;
  const lobbyCode = typeof code === "string" ? code : undefined;
 
  const [players, setPlayers] = useState<Player[]>([]);
  const [injectionLeaderboard, setInjectionLeaderboard] = useState<InjectionEntry[]>([]);
  const [status, setStatus] = useState("lobby");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

 
  useEffect(() => {
    if (!lobbyCode) return;
 
    const loadLobby = async () => {
      try {
        const res = await fetch(`/api/game/lobby?code=${lobbyCode}`);
        if (!res.ok) throw new Error("Failed to fetch lobby state");
        const data = await res.json();
 
        setPlayers(data.players || []);
 
        const nextState = data.game?.state || "lobby";
        setStatus(nextState);
 
        if (nextState !== "lobby") {
          try {
            const injectionRes = await fetch(`/api/injection/leaderboard?code=${lobbyCode}`);
            if (!injectionRes.ok) throw new Error("Failed to fetch injection leaderboard");
            const injectionData = await injectionRes.json();
            setInjectionLeaderboard(Array.isArray(injectionData) ? injectionData : []);
          } catch (error) {
            console.error("Injection leaderboard fetch failed", error);
          }
        } else {
          setInjectionLeaderboard([]);
        }
      } catch (error) {
        console.error("Lobby fetch failed", error);
      }
    };
 
    loadLobby();
    const interval = setInterval(loadLobby, 2000);
 
    return () => clearInterval(interval);
  }, [lobbyCode]);
 
  const startGame = async () => {
    if (!lobbyCode) return;
    setLoading(true);
 
    try {
      const res = await fetch("/api/game/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          code: lobbyCode
        })
      });
 
      if (!res.ok) throw new Error("Failed to start game");
      setStatus("playing");
    } catch (error) {
      console.error("Start game failed", error);
    } finally {
      setLoading(false);
    }
  };

  const copyJoinLink = async () => {
    const joinPath = lobbyCode ? `/join/${lobbyCode}` : "";
    if (!joinPath) return;

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const urlToCopy = origin ? `${origin}${joinPath}` : joinPath;

    try {
      await navigator.clipboard.writeText(urlToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy join link", error);
    }
  };
 
  const endGame = async () => {
    if (!lobbyCode) return;
    setLoading(true);
 
    try {
      const res = await fetch("/api/game/end", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          code: lobbyCode
        })
      });
 
      if (!res.ok) throw new Error("Failed to end game");
      setStatus("ended");
    } catch (error) {
      console.error("End game failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top,#020617,#010108 70%,#000)",
        color: "#e2e8f0",
        fontFamily: "'Space Grotesk','Inter',sans-serif",
        padding: "40px clamp(20px,4vw,80px)"
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 20,
            marginBottom: 32
          }}
        >
          <div>
            <p style={{ textTransform: "uppercase", letterSpacing: 4, fontSize: 12, color: "#94a3b8" }}>
              Admin Lobby — Room {code || "—"}
            </p>
            <h1 style={{ fontSize: "clamp(32px,5vw,52px)", marginTop: 10 }}>Command & Control</h1>
            <p style={{ color: "#94a3b8", marginTop: 10 }}>Monitor players and trigger the round when ready.</p>
          </div>
          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap"
            }}
          >
            <div
              style={{
                padding: "12px 18px",
                borderRadius: 16,
                background: "rgba(15,23,42,0.85)",
                border: "1px solid rgba(99,102,241,0.4)",
                minWidth: 160
              }}
            >
              <span style={{ fontSize: 12, color: "#94a3b8" }}>Status</span>
              <p style={{ fontSize: 20, fontWeight: 600 }}>{status}</p>
            </div>
            <button
              onClick={status === "playing" ? endGame : startGame}
              disabled={status === "ended" || loading || !lobbyCode}
              style={{
                padding: "14px 24px",
                borderRadius: 18,
                border: "none",
                background:
                  status === "ended"
                    ? "rgba(148,163,184,0.4)"
                    : status === "playing"
                      ? "linear-gradient(120deg,#f87171,#fb7185)"
                      : "linear-gradient(120deg,#34d399,#22d3ee)",
                color: "#0f172a",
                fontWeight: 600,
                cursor: status === "ended" ? "not-allowed" : "pointer"
              }}
            >
              {loading
                ? status === "playing"
                  ? "Ending..."
                  : "Launching..."
                : status === "ended"
                  ? "Ended"
                  : status === "playing"
                    ? "End game"
                    : "Start game"}
            </button>
          </div>
        </header>

        <div
          style={{
            background: "rgba(15,23,42,0.8)",
            borderRadius: 30,
            border: "1px solid rgba(148,163,184,0.25)",
            padding: 28,
            boxShadow: "0 45px 80px rgba(2,6,23,0.65)",
            display: "grid",
            gap: 32,
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))"
          }}
        >
          <div>
            <h2 style={{ fontSize: 24, marginBottom: 20 }}>Players in lobby</h2>
            {players.length === 0 && (
              <div
                style={{
                  padding: 20,
                  borderRadius: 20,
                  border: "1px dashed rgba(148,163,184,0.3)",
                  color: "#94a3b8"
                }}
              >
                No players joined yet
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {players.map((player) => (
                <div
                  key={player.id}
                  style={{
                    padding: 16,
                    borderRadius: 18,
                    background: "rgba(2,6,23,0.7)",
                    border: "1px solid rgba(148,163,184,0.2)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{player.name}</span>
                  <span style={{ color: "#34d399", fontSize: 14 }}>Ready</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: 24, marginBottom: 20 }}>Injection Leaderboard</h2>
            {injectionLeaderboard.length === 0 && status === "playing" && (
              <div
                style={{
                  padding: 20,
                  borderRadius: 20,
                  border: "1px dashed rgba(248,250,252,0.2)",
                  color: "#94a3b8"
                }}
              >
                Successful injection hacks will appear here.
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {injectionLeaderboard.map((entry, index) => (
                <div
                  key={`${entry.player_id}-${index}`}
                  style={{
                    padding: 16,
                    borderRadius: 18,
                    background: "rgba(2,6,23,0.7)",
                    border: "1px solid rgba(148,163,184,0.2)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ color: "#94a3b8" }}>#{index + 1}</span>
                      <strong>{entry.players?.name || entry.player_id}</strong>
                    </div>
                    <span style={{ fontWeight: 600, color: "#f472b6" }}>Scenario {entry.scenario}</span>
                  </div>
                  <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 4 }}>
                    Prompt:
                  </div>
                  <div style={{ fontSize: 14, color: "#e2e8f0", background: "rgba(2,6,23,0.5)", padding: 8, borderRadius: 8, wordBreak: "break-word" }}>
                    {entry.prompt_text}
                  </div>
                </div>
              ))}

              {injectionLeaderboard.length === 0 && status === "ended" && (
                <div
                  style={{
                    padding: 18,
                    borderRadius: 16,
                    border: "1px dashed rgba(248,250,252,0.2)",
                    color: "#94a3b8"
                  }}
                >
                  No successful hacks.
                </div>
              )}
            </div>
          </div>
        </div>

        <section style={{ marginTop: 32 }}>
          <h3 style={{ fontSize: 20, marginBottom: 12 }}>Join link</h3>
          <p style={{ color: "#94a3b8" }}>Share with players:</p>
          <div
            style={{
              marginTop: 10,
              padding: 16,
              borderRadius: 18,
              background: "rgba(2,6,23,0.7)",
              border: "1px solid rgba(148,163,184,0.2)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12
            }}
          >
            <button
                onClick={copyJoinLink}
                style={{
                  padding: "8px 14px",
                  borderRadius: 12,
                  border: "1px solid rgba(148,163,184,0.35)",
                  background: copied
                    ? "linear-gradient(120deg,#34d399,#22d3ee)"
                    : "rgba(15,23,42,0.6)",
                  color: copied ? "#0f172a" : "#e2e8f0",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background 0.2s ease"
                }}
              >
                {copied ? "Copied!" : "Copy link"}
              </button>
            <small style={{ color: "#94a3b8" }}>Copy to share</small>
          </div>
        </section>
      </div>
    </div>
  );
}
