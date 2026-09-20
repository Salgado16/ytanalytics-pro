"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui";
import { Youtube, Mail, Loader2, CheckCircle } from "lucide-react";

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInContent />
    </Suspense>
  );
}

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignIn = async (provider: string) => {
    setLoading(true);
    try {
      await signIn(provider, { callbackUrl });
    } catch (error) {
      console.error("Sign in error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
            <Youtube className="h-8 w-8 text-primary" />
          </div>
          <h1 className="sr-only">Login - YouTube Analytics Suite</h1>
          <CardTitle>YouTube Analytics Suite</CardTitle>
          <CardDescription>
            Faça login para acessar seu dashboard de analytics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            className="w-full gap-3"
            onClick={() => handleSignIn("google")}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Conectando...
              </>
            ) : (
              <>
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continuar com Google</span>
              </>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Ou continue com email</span>
            </div>
          </div>

          <Button variant="outline" className="w-full gap-3" onClick={() => handleSignIn("email")} disabled={loading}>
            <Mail className="h-4 w-4" />
            <span>Link mágico por email</span>
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>Ao continuar, você concorda com nossos</p>
            <div className="flex justify-center gap-4 mt-1">
              <a href="/terms" className="hover:underline">Termos de Uso</a>
              <a href="/privacy" className="hover:underline">Política de Privacidade</a>
            </div>
          </div>

          {success && (
            <div className="flex items-center justify-center gap-2 text-green-600 text-sm">
              <CheckCircle className="h-4 w-4" />
              <span>Verifique seu email para o link de acesso</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}