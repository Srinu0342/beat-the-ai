import { useRouter } from "next/router";
import { useState } from "react";
import { usePlayer } from "@/context/PlayerContext";
 
export default function JoinPage() {
  const router = useRouter();
  const { code } = router.query;
 
  const [name, setName] = useState("");
  const [haloKey, setHaloKey] = useState("");
  const { setSession } = usePlayer();
 
  const joinGame = async () => {
    if (!name || !haloKey) {
      alert("Please enter name and Halo API key");
      return;
    }
 
    const res = await fetch("/api/game/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        code
      })
    });
 
    const data = await res.json();
 
    if (!res.ok) {
      alert(data?.error || "Failed to join game");
      return;
    }
 
    setSession({
      playerId: data.id,
      haloKey
    });
 
    router.push(`/lobby/${code}?player=${data.id}`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #020617 0%, #01030a 65%, #000)",
        color: "#e2e8f0",
        fontFamily: "'Space Grotesk','Inter',sans-serif",
        display: "grid",
        placeItems: "center",
        padding: 24
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "rgba(15,23,42,0.85)",
          borderRadius: 28,
          padding: 32,
          border: "1px solid rgba(99,102,241,0.4)",
          boxShadow: "0 45px 70px rgba(2,6,23,0.7)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at top, rgba(99,102,241,0.25), transparent 55%)",
            opacity: 0.6,
            pointerEvents: "none"
          }}
        />
        <div style={{ position: "relative", zIndex: 2 }}>
          <p style={{ textTransform: "uppercase", letterSpacing: 4, fontSize: 13, color: "#94a3b8" }}>
            Enter covert lobby
          </p>
          <h1 style={{ fontSize: 32, marginTop: 6 }}>Join Room {code || "—"}</h1>
          <p style={{ color: "#94a3b8", marginTop: 10 }}>
            Securely store your Halo key locally. Only judges ever read it.
          </p>

          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 20 }}>
            {[{
              label: "Player Alias",
              placeholder: "Agent codename",
              value: name,
              setter: setName
            },
            {
              label: "Halo API Key",
              placeholder: "halo_live_xxx",
              value: haloKey,
              setter: setHaloKey
            }].map((input) => (
              <label key={input.label} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ color: "#cbd5f5", fontSize: 14 }}>{input.label}</span>
                <input
                  placeholder={input.placeholder}
                  value={input.value}
                  onChange={(e) => input.setter(e.target.value)}
                  style={{
                    borderRadius: 16,
                    border: "1px solid rgba(148,163,184,0.4)",
                    padding: "14px 18px",
                    background: "rgba(15,23,42,0.8)",
                    color: "#f8fafc",
                    fontSize: 15
                  }}
                />
              </label>
            ))}
          </div>

          <button
            onClick={joinGame}
            style={{
              width: "100%",
              marginTop: 32,
              padding: "14px 20px",
              borderRadius: 18,
              border: "none",
              background: "linear-gradient(115deg,#6366f1,#ec4899)",
              color: "white",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 15px 35px rgba(236,72,153,0.35)"
            }}
          >
            Enter Lobby
          </button>
        </div>
      </div>
    </div>
  );
}
