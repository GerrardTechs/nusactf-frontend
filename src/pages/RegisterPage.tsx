import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, UserPlus } from "lucide-react";
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

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username minimal 3 karakter.")
      .max(50)
      .regex(/^[a-zA-Z0-9_]+$/, "Hanya huruf, angka, dan underscore."),
    email: z.string().email("Email tidak valid."),
    password: z.string().min(6, "Password minimal 6 karakter."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok.",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const { signUp } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setError(null);
    try {
      await signUp(data.email, data.password, data.username);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registrasi gagal.");
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center cyber-grid px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-primary">Registrasi Berhasil!</CardTitle>
            <CardDescription>
              Cek email untuk verifikasi (jika diaktifkan), lalu masuk.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button asChild>
              <Link to="/login">Ke halaman login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center cyber-grid px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <UserPlus className="h-6 w-6 text-accent" />
          </div>
          <CardTitle className="text-2xl">Daftar NusaCTF</CardTitle>
          <CardDescription>Buat akun untuk mulai mengerjakan CTF</CardDescription>
        </CardHeader>
        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
          <CardContent className="space-y-4">
            {error && (
              <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="nusa_hacker"
                autoComplete="username"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-xs text-destructive">
                  {errors.username.message}
                </p>
              )}
            </div>
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
                autoComplete="new-password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" />}
              Daftar
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Masuk
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
