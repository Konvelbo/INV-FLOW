import { NextResponse } from "next/server";
import { bridgeSessions } from "@/lib/auth-bridge-state";

/**
 * Handle session bridging between Chrome and Electron.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "ID manquant" }, { status: 400 });
  }

  // Poll for the token
  const token = bridgeSessions.get(id);
  if (token) {
    // Consume the token (delete it after successful poll)
    bridgeSessions.delete(id);
    return NextResponse.json({ token });
  }

  return NextResponse.json({ token: null });
}

export async function POST(req: Request) {
  try {
    const { id, token } = await req.json();

    if (!id || !token) {
      return NextResponse.json({ message: "Données manquantes" }, { status: 400 });
    }

    // Save the token in memory
    bridgeSessions.set(id, token);
    
    return NextResponse.json({ success: true, message: "Session enregistrée" });
  } catch (error) {
    console.error("Error in /api/auth/bridge:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
