import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

/**
 * Checks auth for API routes. Accepts either:
 * 1. A valid NextAuth session (cookie-based)
 * 2. A valid x-api-key header (for Reedy)
 *
 * Returns null if authorized, or an error NextResponse if not.
 */
export async function requireAuth(
  request: NextRequest
): Promise<NextResponse | null> {
  // Check API key first (for programmatic access)
  const apiKey = request.headers.get("x-api-key");
  const expectedKey = process.env.REEDY_API_KEY;

  if (apiKey && expectedKey && apiKey === expectedKey) {
    return null; // Authorized via API key
  }

  // Fall back to session auth
  const session = await getServerSession(authOptions);

  if (session) {
    return null; // Authorized via session
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
