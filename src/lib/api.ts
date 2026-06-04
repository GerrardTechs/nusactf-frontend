import { getAccessToken } from "./auth";

import type {
  ApiErrorBody,
  Challenge,
  Profile,
  ScoreboardEntry,
  SubmitFlagResponse,
} from "@/types";
import { ApiError } from "@/types";

// ✅ Ambil base URL dari env variable
const BASE_URL = import.meta.env.VITE_API_URL as string;

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
  options: RequestInit = {}
): Promise<T> {
  const BASE_URL = import.meta.env.VITE_API_URL as string;
  const accessToken = await getAccessToken();

  // ✅ Gabungkan BASE_URL + path
  const response = await fetch(`${BASE_URL}${path}`, {
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

export async function fetchProfile(): Promise<Profile> {
  const data = await apiFetch<{ profile: Profile }>("/api/auth/me");
  return data.profile;
}

export async function fetchChallenges(): Promise<Challenge[]> {
  const data = await apiFetch<{ challenges: Challenge[] }>("/api/challenges");
  return data.challenges;
}

export async function submitFlag(
  challengeId: string,
  flag: string
): Promise<SubmitFlagResponse> {
  return apiFetch<SubmitFlagResponse>("/api/submissions", {
    method: "POST",
    body: JSON.stringify({ challenge_id: challengeId, flag }),
  });
}

export async function fetchScoreboardSnapshot(): Promise<ScoreboardEntry[]> {
  const BASE_URL = import.meta.env.VITE_API_URL as string;
  const response = await fetch(`${BASE_URL}/api/scoreboard`);
  if (!response.ok) throw await parseError(response);
  const data = (await response.json()) as { scoreboard: ScoreboardEntry[] };
  return data.scoreboard;
}

/** Challenge-specific sandbox links shown in the detail dialog. */
export function getChallengeLinks(slug: string): { label: string; href: string }[] {
  switch (slug) {
    case "warung-login":
      return [
        { label: "Buka sandbox SQLi", href: `${BASE_URL}/api/challenges/warung-login` },
      ];
    case "pesan-rahasia":
      return [
        { label: "Lihat pesan terenkripsi", href: `${BASE_URL}/api/challenges/pesan-rahasia` },
      ];
    case "foto-kenangan":
      return [
        {
          label: "Unduh foto (stego)",
          href: `${BASE_URL}/api/challenges/foto-kenangan/image`,
        },
      ];
    default:
      return [];
  }
}