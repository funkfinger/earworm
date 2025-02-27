import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Add paths that require authentication
const protectedPaths = ["/dashboard"];

export function middleware(request: NextRequest) {
  // Check if the path requires authentication
  if (
    protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))
  ) {
    const hasTokenCookie = request.cookies.has("spotify_tokens");

    if (!hasTokenCookie) {
      const url = new URL("/", request.url);
      url.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}
