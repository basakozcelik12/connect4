import { NextResponse } from "next/server";
import { createNewGame } from "@/app/lib/gameLogic";
import {
  generateGameId,
  generatePlayerSecret,
  hashPlayerSecret,
  RedisGameState,
  setPlayerGameLookup,
  setRedisGameState,
} from "@/app/lib/redisGame";

export async function POST() {
  try {
    const gameId = generateGameId();
    const playerSecret = generatePlayerSecret();
    const playerSecretHash = hashPlayerSecret(playerSecret);

    const gameStatus = createNewGame();

    const state: RedisGameState = {
      gameStatus,
      player1Id: playerSecretHash,
      player2Id: null,
      version: 0,
    };

    await Promise.all([
      setRedisGameState(gameId, state),
      setPlayerGameLookup(playerSecretHash, gameId),
    ]);

    return NextResponse.json(
      {
        gameId,
        playerSecret,
        playerNumber: 1,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create game: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    );
  }
}
