"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

const errorMessages: Record<string, { title: string; description: string }> = {
  Configuration: {
    title: "Erro de Configuração",
    description: "Há um problema na configuração do servidor. Contate o administrador.",
  },
  AccessDenied: {
    title: "Acesso Negado",
    description: "Você não tem permissão para acessar este recurso.",
  },
  Verification: {
    title: "Erro de Verificação",
    description: "O link de verificação expirou ou é inválido. Tente novamente.",
  },
  OAuthSignin: {
    title: "Erro no Login OAuth",
    description: "Não foi possível fazer login com o provedor. Tente novamente.",
  },
  OAuthCallback: {
    title: "Erro no Callback OAuth",
    description: "Erro ao processar o retorno do provedor. Tente novamente.",
  },
  OAuthCreateAccount: {
    title: "Erro ao Criar Conta",
    description: "Não foi possível criar sua conta. Tente novamente.",
  },
  EmailCreateAccount: {
    title: "Erro ao Criar Conta via Email",
    description: "Não foi possível criar sua conta via email. Tente novamente.",
  },
  Callback: {
    title: "Erro no Callback",
    description: "Erro ao processar o callback de autenticação.",
  },
  OAuthAccountNotLinked: {
    title: "Conta Não Vinculada",
    description: "Esta conta já existe com outro provedor. Faça login com o provedor original.",
  },
  EmailSignin: {
    title: "Erro no Email",
    description: "Erro ao enviar email de verificação. Verifique seu email e tente novamente.",
  },
  CredentialsSignin: {
    title: "Credenciais Inválidas",
    description: "Email ou senha incorretos.",
  },
  SessionRequired: {
    title: "Sessão Expirada",
    description: "Sua sessão expirou. Faça login novamente.",
  },
  Default: {
    title: "Erro de Autenticação",
    description: "Ocorreu um erro inesperado. Tente novamente.",
  },
};

export default function AuthErrorPage() {
  return (
    <Suspense fallback={null}>
      <AuthErrorContent />
    </Suspense>
  );
}

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Default";
  const errorInfo = errorMessages[error] || errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-destructive/5 via-background to-accent/5 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle>{errorInfo.title}</CardTitle>
          <CardDescription>{errorInfo.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Button className="flex-1" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
          </div>
          <Link href="/auth/signin" className="block text-center text-sm text-primary hover:underline">
            Ir para página de login
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}