import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Shield } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid."),
  password: z.string().min(6, "Password minimal 6 karakter."),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { signIn } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    try {
      await signIn(data.email, data.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center cyber-grid px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Masuk NusaCTF</CardTitle>
          <CardDescription>
            Platform Capture The Flag untuk pemula
          </CardDescription>
        </CardHeader>
        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
          <CardContent className="space-y-4">
            {error && (
              <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="ctf@nusactf.id"
                autoComplete="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" />}
              Masuk
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Belum punya akun?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Daftar
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
