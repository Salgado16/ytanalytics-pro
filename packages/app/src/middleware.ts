import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req: any) {
    const token = req.nextauth.token;
    const path = req.nextUrl?.pathname || new URL(req.url).pathname;

    const protectedPaths = [
      "/channels",
      "/dashboard",
      "/ideas",
      "/settings",
      "/niche",
      "/viral",
      "/skills",
      "/references",
      "/media",
      "/transcriptions",
      "/text-tools",
      "/tts",
    ];

    const isProtected = protectedPaths.some((p) => path.startsWith(p));

    if (isProtected && !token) {
      const url = new URL("/", req.url);
      url.searchParams.set("redirect", path);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/channels/:path*",
    "/dashboard/:path*",
    "/ideas/:path*",
    "/settings/:path*",
    "/niche/:path*",
    "/viral/:path*",
    "/skills/:path*",
    "/references/:path*",
    "/media/:path*",
    "/transcriptions/:path*",
    "/text-tools/:path*",
    "/tts/:path*",
  ],
};