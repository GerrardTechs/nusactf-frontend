import type {
  ApiErrorBody,
  Challenge,
  Profile,
  ScoreboardEntry,
  SubmitFlagResponse,
} from "@/types";
import { ApiError } from "@/types";

async function parseError(response: Response): Promise<ApiError> {
  let body: ApiErrorBody = {};
  try {
    body = (await response.json()) as ApiErrorBody;
  } catch {
    /* empty */
  }
  return new ApiError(
    body.message ?? `Request failed (${response.status})`,
    response.status,
    body.code
  );
}

export async function apiFetch<T>(
  path: string,
  accessToken: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  return response.json() as Promise<T>;
}

export async function fetchProfile(accessToken: string): Promise<Profile> {
  const data = await apiFetch<{ profile: Profile }>(
    "/api/auth/me",
    accessToken
  );
  return data.profile;
}

export async function fetchChallenges(
  accessToken: string
): Promise<Challenge[]> {
  const data = await apiFetch<{ challenges: Challenge[] }>(
    "/api/challenges",
    accessToken
  );
  return data.challenges;
}

export async function submitFlag(
  accessToken: string,
  challengeId: string,
  flag: string
): Promise<SubmitFlagResponse> {
  return apiFetch<SubmitFlagResponse>("/api/submissions", accessToken, {
    method: "POST",
    body: JSON.stringify({ challenge_id: challengeId, flag }),
  });
}

export async function fetchScoreboardSnapshot(): Promise<ScoreboardEntry[]> {
  const response = await fetch("/api/scoreboard");
  if (!response.ok) {
    throw await parseError(response);
  }
  const data = (await response.json()) as { scoreboard: ScoreboardEntry[] };
  return data.scoreboard;
}

/** Challenge-specific sandbox links shown in the detail dialog. */
export function getChallengeLinks(slug: string): { label: string; href: string }[] {
  switch (slug) {
    case "warung-login":
      return [
        { label: "Buka sandbox SQLi", href: "/api/challenges/warung-login" },
      ];
    case "pesan-rahasia":
      return [
        { label: "Lihat pesan terenkripsi", href: "/api/challenges/pesan-rahasia" },
      ];
    case "foto-kenangan":
      return [
        {
          label: "Unduh foto (stego)",
          href: "/api/challenges/foto-kenangan/image",
        },
      ];
    default:
      return [];
  }
}
