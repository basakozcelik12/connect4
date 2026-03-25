import { NextRequest, NextResponse } from "next/server";
import {
  GameEvent,
  generatePlayerSecret,
  getRedisGameState,
  hashPlayerSecret,
  publishGameEvent,
  RedisGameState,
  setPlayerGameLookup,
  setRedisGameState,
} from "@/app/lib/redisGame";

interface JoinGameBody {
  gameId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as JoinGameBody;

    if (!body.gameId) {
      return NextResponse.json({ error: "Missing gameId" }, { status: 400 });
    }

    const currentState = await getRedisGameState(body.gameId);

    if (!currentState) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    if (currentState.player2Id) {
      return NextResponse.json({ error: "Game already has two players" }, { status: 409 });
    }

    const playerSecret = generatePlayerSecret();
    const playerSecretHash = hashPlayerSecret(playerSecret);

    const nextState: RedisGameState = {
      ...currentState,
      player2Id: playerSecretHash,
    };

    await Promise.all([
      setRedisGameState(body.gameId, nextState),
      setPlayerGameLookup(playerSecretHash, body.gameId),
    ]);

    const event: GameEvent = {
      type: "playerJoined",
      gameId: body.gameId,
      state: nextState,
    };

    await publishGameEvent(event);

    return NextResponse.json({
      gameId: body.gameId,
      playerSecret,
      playerNumber: 2,
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to join game: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    );
  }
}
