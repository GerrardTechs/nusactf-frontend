import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { ChallengeCard } from "@/components/challenges/ChallengeCard";
import { ChallengeDialog } from "@/components/challenges/ChallengeDialog";
import { Button } from "@/components/ui/button";
import { fetchChallenges } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import type { Challenge } from "@/types";
import { ApiError } from "@/types";

export function ChallengesPage() {
  const { accessToken } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Challenge | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadChallenges = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchChallenges(accessToken);
      setChallenges(data);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Gagal memuat tantangan."
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void loadChallenges();
  }, [loadChallenges]);

  const grouped = useMemo(() => {
    const map = new Map<string, Challenge[]>();
    for (const challenge of challenges) {
      const list = map.get(challenge.category) ?? [];
      list.push(challenge);
      map.set(challenge.category, list);
    }
    return map;
  }, [challenges]);

  const handleSelect = (challenge: Challenge) => {
    setSelected(challenge);
    setDialogOpen(true);
  };

  const handleSolved = () => {
    void loadChallenges();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Challenges</h1>
          <p className="text-muted-foreground">
            Pilih tantangan, temukan flag, dan submit untuk dapat poin.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => void loadChallenges()}>
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {error && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {[...grouped.entries()].map(([category, items]) => (
        <section key={category} className="space-y-4">
          <h2 className="font-mono text-lg text-primary">{category}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onSelect={handleSelect}
              />
            ))}
          </div>
        </section>
      ))}

      <ChallengeDialog
        challenge={selected}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSolved={handleSolved}
      />
    </div>
  );
}
