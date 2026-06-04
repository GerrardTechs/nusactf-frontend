import { CheckCircle2, Circle, Trophy } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Challenge } from "@/types";
import { cn, getCategoryColor } from "@/lib/utils";

interface ChallengeCardProps {
  challenge: Challenge;
  onSelect: (challenge: Challenge) => void;
}

export function ChallengeCard({ challenge, onSelect }: ChallengeCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:border-primary/40 hover:shadow-lg",
        challenge.solved && "border-emerald-500/30 opacity-90"
      )}
      onClick={() => onSelect(challenge)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-mono">{challenge.title}</CardTitle>
          {challenge.solved ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
          ) : (
            <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
          )}
        </div>
        <CardDescription className="flex flex-wrap items-center gap-2 pt-1">
          <Badge variant="outline" className={getCategoryColor(challenge.category)}>
            {challenge.category}
          </Badge>
          <Badge variant="muted">{challenge.difficulty}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1 font-mono text-primary">
          <Trophy className="h-4 w-4" />
          {challenge.points} pts
        </span>
        <Badge variant={challenge.solved ? "success" : "secondary"}>
          {challenge.solved ? "Solved" : "Unsolved"}
        </Badge>
      </CardContent>
    </Card>
  );
}
