import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("spotify_token");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No token found" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, token: token.value });
  } catch (error) {
    console.error("Token retrieval error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve token" },
      { status: 500 }
    );
  }
}
