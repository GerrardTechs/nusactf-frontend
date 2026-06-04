import { useEffect, useRef, useState } from "react";
import type { ScoreboardEntry } from "@/types";

interface ScoreboardStreamPayload {
  scoreboard: ScoreboardEntry[];
}

interface UseScoreboardStreamResult {
  entries: ScoreboardEntry[];
  connected: boolean;
  error: string | null;
  movedRanks: Set<number>;
}

/**
 * Subscribes to backend SSE at /api/scoreboard/stream.
 * Tracks rank changes to trigger row highlight animation.
 */
export function useScoreboardStream(): UseScoreboardStreamResult {
  const [entries, setEntries] = useState<ScoreboardEntry[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [movedRanks, setMovedRanks] = useState<Set<number>>(new Set());
  const prevRanksRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const source = new EventSource("/api/scoreboard/stream");

    const applyUpdate = (next: ScoreboardEntry[]) => {
      const moved = new Set<number>();
      const prev = prevRanksRef.current;

      for (const entry of next) {
        const oldRank = prev.get(entry.user_id);
        if (oldRank !== undefined && oldRank !== entry.rank) {
          moved.add(entry.rank);
        }
      }

      const nextMap = new Map<string, number>();
      for (const entry of next) {
        nextMap.set(entry.user_id, entry.rank);
      }
      prevRanksRef.current = nextMap;

      setEntries(next);
      if (moved.size > 0) {
        setMovedRanks(moved);
        window.setTimeout(() => setMovedRanks(new Set()), 500);
      }
    };

    source.addEventListener("open", () => {
      setConnected(true);
      setError(null);
    });

    source.addEventListener("scoreboard", (event) => {
      try {
        const payload = JSON.parse(
          (event as MessageEvent<string>).data
        ) as ScoreboardStreamPayload;
        applyUpdate(payload.scoreboard ?? []);
      } catch {
        setError("Gagal memparse data scoreboard.");
      }
    });

    source.onerror = () => {
      setConnected(false);
      setError("Koneksi SSE terputus. Mencoba reconnect...");
    };

    return () => {
      source.close();
      setConnected(false);
    };
  }, []);

  return { entries, connected, error, movedRanks };
}
