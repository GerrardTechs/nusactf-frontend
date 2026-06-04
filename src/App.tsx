import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  GuestRoute,
  ProtectedRoute,
} from "@/components/layout/ProtectedRoute";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { ChallengesPage } from "@/pages/ChallengesPage";
import { ScoreboardPage } from "@/pages/ScoreboardPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/challenges" element={<ChallengesPage />} />
              <Route path="/scoreboard" element={<ScoreboardPage />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/challenges" replace />} />
          <Route path="*" element={<Navigate to="/challenges" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
