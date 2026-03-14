import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

interface PlayerContextValue {
  playerId: string | null;
  haloKey: string | null;
  setSession: (values: { playerId?: string | null; haloKey?: string | null }) => void;
  clearSession: () => void;
}

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

const HALO_STORAGE_KEY = "halo_api_key";
const PLAYER_STORAGE_KEY = "player_id";

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [playerId, setPlayerId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(PLAYER_STORAGE_KEY);
  });
  const [haloKey, setHaloKey] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(HALO_STORAGE_KEY);
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (haloKey) {
      window.localStorage.setItem(HALO_STORAGE_KEY, haloKey);
    } else {
      window.localStorage.removeItem(HALO_STORAGE_KEY);
    }
  }, [haloKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (playerId) {
      window.localStorage.setItem(PLAYER_STORAGE_KEY, playerId);
    } else {
      window.localStorage.removeItem(PLAYER_STORAGE_KEY);
    }
  }, [playerId]);

  const setSession = ({ playerId: nextPlayerId, haloKey: nextHaloKey }: { playerId?: string | null; haloKey?: string | null }) => {
    if (typeof nextPlayerId !== "undefined") {
      setPlayerId(nextPlayerId);
    }

    if (typeof nextHaloKey !== "undefined") {
      setHaloKey(nextHaloKey);
    }
  };

  const clearSession = () => {
    setPlayerId(null);
    setHaloKey(null);
  };

  const value = useMemo(
    () => ({
      playerId,
      haloKey,
      setSession,
      clearSession
    }),
    [playerId, haloKey]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }

  return context;
}
