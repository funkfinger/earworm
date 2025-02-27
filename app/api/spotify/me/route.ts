import { NextResponse } from "next/server";
import { getValidToken } from "@/app/actions/auth";

export async function GET() {
  try {
    const token = await getValidToken();

    if (!token) {
      return new NextResponse(null, { status: 401 });
    }

    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Profile fetch error:", error);
    return new NextResponse(null, { status: 500 });
  }
}
