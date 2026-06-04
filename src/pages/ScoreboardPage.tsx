import { Radio, Trophy } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useScoreboardStream } from "@/hooks/useScoreboardStream";
import { cn, formatDateTime } from "@/lib/utils";

export function ScoreboardPage() {
  const { entries, connected, error, movedRanks } = useScoreboardStream();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <Trophy className="h-8 w-8 text-primary" />
            Scoreboard
          </h1>
          <p className="text-muted-foreground">
            Peringkat real-time — update otomatis via SSE.
          </p>
        </div>
        <Badge
          variant={connected ? "success" : "destructive"}
          className="w-fit gap-1.5"
        >
          <Radio className={cn("h-3 w-3", connected && "animate-pulse")} />
          {connected ? "Live" : "Reconnecting..."}
        </Badge>
      </div>

      {error && (
        <p className="rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Username</TableHead>
              <TableHead className="text-right">Points</TableHead>
              <TableHead className="hidden text-right sm:table-cell">
                Solved
              </TableHead>
              <TableHead className="hidden text-right md:table-cell">
                Last Solve
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-12 text-center text-muted-foreground"
                >
                  Belum ada yang solve. Jadilah yang pertama!
                </TableCell>
              </TableRow>
            ) : (
              entries.map((entry) => (
                <TableRow
                  key={entry.user_id}
                  className={cn(
                    movedRanks.has(entry.rank) && "scoreboard-row-enter"
                  )}
                >
                  <TableCell className="font-mono font-bold text-primary">
                    #{entry.rank}
                  </TableCell>
                  <TableCell className="font-mono">{entry.username}</TableCell>
                  <TableCell className="text-right font-mono text-emerald-400">
                    {entry.total_points}
                  </TableCell>
                  <TableCell className="hidden text-right sm:table-cell">
                    {entry.challenges_solved}
                  </TableCell>
                  <TableCell className="hidden text-right font-mono text-xs text-muted-foreground md:table-cell">
                    {formatDateTime(entry.last_solve_at)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
