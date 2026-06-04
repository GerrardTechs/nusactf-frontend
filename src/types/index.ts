export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Challenge {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  points: number;
  difficulty: string;
  is_active: boolean;
  created_at: string;
  solved: boolean;
  solvedAt: string | null;
}

export interface ScoreboardEntry {
  user_id: string;
  username: string;
  avatar_url: string | null;
  total_points: number;
  challenges_solved: number;
  last_solve_at: string | null;
  rank: number;
}

export interface SubmitFlagResponse {
  isCorrect: boolean;
  message: string;
  alreadySolved: boolean;
  pointsAwarded: number;
}

export interface ApiErrorBody {
  error?: string;
  code?: string;
  message?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}
