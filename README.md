# NusaCTF Frontend

UI untuk platform CTF NusaCTF (Vite + React + TypeScript + Tailwind + shadcn/ui).

Repo terpisah dari backend — lihat `nusactf-backend` untuk API.

## Setup

```bash
cp .env.example .env   # isi VITE_SUPABASE_* dan VITE_API_URL
npm install
npm run dev            # http://localhost:5173
```

## Environment

| Variable | Deskripsi |
|----------|-----------|
| `VITE_SUPABASE_URL` | URL project Supabase |
| `VITE_SUPABASE_ANON_KEY` | Anon/public key Supabase |
| `VITE_API_URL` | URL backend (default `http://localhost:3001`) |

Dev proxy: request `/api/*` di-forward ke `VITE_API_URL`.

## Status

Scaffold + konfigurasi siap. Implementasi UI (Langkah 5) belum dikerjakan.
