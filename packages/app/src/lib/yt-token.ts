import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

interface TokenPayload {
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpires?: number;
}

export async function getAccessToken(req: NextRequest): Promise<string | null> {
  const token = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as TokenPayload | null;

  if (!token?.accessToken) return null;

  if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
    return token.accessToken;
  }

  if (!token.refreshToken) return null;

  return refreshAccessToken(token.refreshToken);
}

async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.access_token as string | null;
  } catch (error) {
    console.error("Error refreshing YouTube access token:", error);
    return null;
  }
}