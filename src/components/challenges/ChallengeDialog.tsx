import { useState, type FormEvent } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { getChallengeLinks, submitFlag } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import type { Challenge } from "@/types";
import { ApiError } from "@/types";
import { cn, getCategoryColor } from "@/lib/utils";

interface ChallengeDialogProps {
  challenge: Challenge | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSolved: () => void;
}

export function ChallengeDialog({
  challenge,
  open,
  onOpenChange,
  onSolved,
}: ChallengeDialogProps) {
  const { accessToken } = useAuth();
  const [flag, setFlag] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  if (!challenge) return null;

  const links = getChallengeLinks(challenge.slug);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!accessToken || !flag.trim()) return;

    setSubmitting(true);
    setFeedback(null);

    try {
      const result = await submitFlag(accessToken, challenge.id, flag.trim());
      setFeedback({
        type: result.isCorrect ? "success" : "info",
        message: result.message,
      });
      if (result.isCorrect) {
        onSolved();
      }
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Gagal submit flag. Coba lagi.";
      setFeedback({ type: "error", message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setFlag("");
      setFeedback(null);
    }
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-mono text-xl">{challenge.title}</DialogTitle>
          <DialogDescription className="flex flex-wrap gap-2 pt-1">
            <Badge variant="outline" className={getCategoryColor(challenge.category)}>
              {challenge.category}
            </Badge>
            <Badge variant="muted">{challenge.difficulty}</Badge>
            <Badge variant="default">{challenge.points} pts</Badge>
            {challenge.solved && <Badge variant="success">Solved</Badge>}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="whitespace-pre-wrap rounded-md border border-border/60 bg-muted/30 p-4 text-sm leading-relaxed">
            {challenge.description}
          </div>

          {links.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {links.map((link) => (
                <Button key={link.href} variant="outline" size="sm" asChild>
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" />
                    {link.label}
                  </a>
                </Button>
              ))}
            </div>
          )}

          {!challenge.solved && (
            <form onSubmit={(e) => void handleSubmit(e)} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="flag">Submit Flag</Label>
                <Input
                  id="flag"
                  placeholder="NusaCTF{...}"
                  value={flag}
                  onChange={(e) => setFlag(e.target.value)}
                  disabled={submitting}
                />
              </div>
              {feedback && (
                <p
                  className={cn(
                    "rounded-md px-3 py-2 text-sm",
                    feedback.type === "success" &&
                      "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
                    feedback.type === "error" &&
                      "border border-destructive/30 bg-destructive/10 text-destructive",
                    feedback.type === "info" &&
                      "border border-border bg-muted text-muted-foreground"
                  )}
                >
                  {feedback.message}
                </p>
              )}
              <Button type="submit" disabled={submitting || !flag.trim()}>
                {submitting && <Loader2 className="animate-spin" />}
                Submit Flag
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
