import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export function AppLayout() {
  return (
    <div className="min-h-screen cyber-grid">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
