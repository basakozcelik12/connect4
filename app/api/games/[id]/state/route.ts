import { NextResponse } from "next/server";
import { getRedisGameState, sanitizeGameState } from "@/app/lib/redisGame";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id: gameId } = await context.params;
    const state = await getRedisGameState(gameId);

    if (!state) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    return NextResponse.json(sanitizeGameState(state));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to fetch game state: ${message}` },
      { status: 500 },
    );
  }
}
