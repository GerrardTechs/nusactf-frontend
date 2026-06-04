import { NavLink, useNavigate } from "react-router-dom";
import { Flag, LogOut, Trophy, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/challenges", label: "Challenges", icon: Flag },
  { to: "/scoreboard", label: "Scoreboard", icon: Trophy },
];

export function Navbar() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <NavLink to="/challenges" className="flex items-center gap-2 font-mono">
          <span className="text-lg font-bold text-primary">
            {import.meta.env.VITE_APP_TITLE ?? "NusaCTF"}
          </span>
          <Badge variant="outline" className="hidden text-[10px] sm:inline-flex">
            beta
          </Badge>
        </NavLink>

        <nav className="flex items-center gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {profile && (
            <div className="hidden items-center gap-2 rounded-md border border-border/60 bg-card px-3 py-1.5 text-sm sm:flex">
              <User className="h-3.5 w-3.5 text-primary" />
              <span className="font-mono text-emerald-400">{profile.username}</span>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={() => void handleSignOut()}>
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
