import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { applyMove } from "@/app/lib/gameLogic";
import { prisma } from "@/app/lib/prisma";
import {
  GameEvent,
  getPlayerNumberFromSecret,
  getRedisGameState,
  markGameCompletedWithShortTtl,
  publishGameEvent,
  sanitizeGameState,
  setRedisGameState,
} from "@/app/lib/redisGame";

interface MoveBody {
  gameId: string;
  secret: string;
  column: number;
}

function validateMoveRequest(body: Partial<MoveBody>): body is MoveBody {
  return !!body.gameId && !!body.secret && body.column !== undefined;
}

function calculateLoser(winner: number): number {
  return winner === 1 ? 2 : winner === 2 ? 1 : 0;
}

async function handleGameCompletion(
  gameId: string,
  gameStatus: { state: string; winner?: number }
) {
  const winner = gameStatus.state === "draw" ? 0 : (gameStatus.winner ?? 0);
  const loser = calculateLoser(winner);

  await Promise.all([
    prisma.game.create({ data: { winner, loser } }),
    markGameCompletedWithShortTtl(gameId),
  ]);

  revalidateTag("stats", { expire: 0 });
  revalidatePath("/stats");
}

function createErrorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!validateMoveRequest(body)) {
      return createErrorResponse("Missing gameId, secret, or column", 400);
    }

    const playerNumber = await getPlayerNumberFromSecret(body.gameId, body.secret);
    if (!playerNumber) {
      return createErrorResponse("Invalid player secret", 403);
    }

    const currentState = await getRedisGameState(body.gameId);

    if (!currentState) {
      return createErrorResponse("Game not found", 404);
    }

    const { gameStatus } = currentState;

    if (gameStatus.state !== "ongoing") {
      return createErrorResponse("Game is not ongoing", 409);
    }

    if (gameStatus.currentPlayer !== playerNumber) {
      return createErrorResponse("Not your turn", 409);
    }

    const nextStatus = applyMove(gameStatus, body.column);

    if (!nextStatus) {
      return createErrorResponse("Invalid move", 400);
    }

    const nextState = {
      ...currentState,
      gameStatus: nextStatus,
      version: currentState.version + 1,
    };

    await setRedisGameState(body.gameId, nextState);

    const gameEnded = nextState.gameStatus.state === "won" || nextState.gameStatus.state === "draw";

    const event: GameEvent = {
      type: gameEnded ? "gameEnded" : "moveMade",
      gameId: body.gameId,
      state: nextState,
    };

    await publishGameEvent(event);

    if (gameEnded) {
      await handleGameCompletion(body.gameId, nextState.gameStatus);
    }

    return NextResponse.json({
      success: true,
      state: sanitizeGameState(nextState),
    });
  } catch (error) {
    return createErrorResponse(
      `Failed to make move: ${error instanceof Error ? error.message : "Unknown error"}`,
      500
    );
  }
}
