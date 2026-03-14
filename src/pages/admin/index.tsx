import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

interface Game {
  join_code: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const createGame = async () => {
    setLoading(true);
    const res = await fetch("/api/game/create", {
      method: "POST"
    });

    const data = await res.json();

    setGame(data);
    setCopied(false);
    setLoading(false);
  };

  const joinPath = game ? `/join/${game.join_code}` : "";

  const copyJoinLink = async () => {
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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top,#020617,#010106 70%,#000)",
        color: "#e2e8f0",
        fontFamily: "'Space Grotesk','Inter',sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 24
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 540,
          background: "rgba(15,23,42,0.85)",
          borderRadius: 32,
          padding: 36,
          border: "1px solid rgba(99,102,241,0.35)",
          boxShadow: "0 45px 80px rgba(2,6,23,0.7)",
          textAlign: "center"
        }}
      >
        <p style={{ letterSpacing: 4, textTransform: "uppercase", fontSize: 12, color: "#94a3b8" }}>
          Control room
        </p>
        <h1 style={{ fontSize: 34, marginTop: 10 }}>Create new lobby</h1>
        <p style={{ color: "#94a3b8", marginTop: 8 }}>
          Spin up a new match, distribute the join link, and monitor progress from the admin view.
        </p>

        <button
          onClick={createGame}
          disabled={loading}
          style={{
            marginTop: 28,
            width: "100%",
            padding: "14px 20px",
            borderRadius: 18,
            border: "none",
            background: loading
              ? "rgba(148,163,184,0.4)"
              : "linear-gradient(120deg,#6366f1,#ec4899)",
            color: "white",
            fontSize: 16,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Creating lobby..." : "Create game"}
        </button>

        {game && (
          <div
            style={{
              marginTop: 32,
              padding: 20,
              borderRadius: 18,
              background: "rgba(2,6,23,0.7)",
              border: "1px solid rgba(148,163,184,0.25)",
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              gap: 14
            }}
          >
            <h3 style={{ fontSize: 18 }}>Join link</h3>
            <p style={{ color: "#94a3b8", marginTop: 6 }}>Share with players to enter the lobby.</p>
            <div
              style={{
                marginTop: 10,
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                alignItems: "center"
              }}
            >
              <Link
                href={joinPath}
                style={{
                  fontSize: 16,
                  color: "#818cf8",
                  textDecoration: "underline",
                  wordBreak: "break-all"
                }}
              >
                {joinPath}
              </Link>
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
            </div>
            <button
              onClick={() => router.push(`/admin/lobby/${game.join_code}`)}
              style={{
                marginTop: 6,
                width: "100%",
                padding: "12px 20px",
                borderRadius: 16,
                border: "1px solid rgba(99,102,241,0.5)",
                background: "linear-gradient(120deg,#34d399,#22d3ee)",
                color: "#0f172a",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Go to admin lobby
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
