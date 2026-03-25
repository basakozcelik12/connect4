import { createHash, randomBytes } from "crypto";
import { GameStatus } from "@/app/lib/gameLogic";
import { redis } from "@/app/lib/redis";

export interface RedisGameState {
  gameStatus: GameStatus;
  player1Id: string;
  player2Id: string | null;
  version: number;
}

export type GameEventType = "playerJoined" | "moveMade" | "gameEnded";

export interface GameEvent {
  type: GameEventType;
  gameId: string;
  state: RedisGameState;
}

export const ACTIVE_GAME_TTL_SECONDS = 60 * 60 * 24;
export const COMPLETED_GAME_TTL_SECONDS = 60 * 60;

export function getGameStateKey(gameId: string) {
  return `game:${gameId}:state`;
}

export function getGameEventsChannel(gameId: string) {
  return `game:${gameId}`;
}

export function getPlayerGameLookupKey(secretHash: string) {
  return `player:${secretHash}:game`;
}

export function generateGameId() {
  return randomBytes(6).toString("hex");
}

export function generatePlayerSecret() {
  return randomBytes(32).toString("base64url");
}

export function hashPlayerSecret(secret: string) {
  return createHash("sha256").update(secret).digest("hex");
}

export async function getRedisGameState(gameId: string): Promise<RedisGameState | null> {
  const serializedState = await redis.get(getGameStateKey(gameId));

  if (!serializedState) {
    return null;
  }

  return JSON.parse(serializedState) as RedisGameState;
}

export async function setRedisGameState(gameId: string, state: RedisGameState) {
  await redis.set(
    getGameStateKey(gameId),
    JSON.stringify(state),
    "EX",
    ACTIVE_GAME_TTL_SECONDS,
  );
}

export async function setPlayerGameLookup(secretHash: string, gameId: string) {
  await redis.set(
    getPlayerGameLookupKey(secretHash),
    gameId,
    "EX",
    ACTIVE_GAME_TTL_SECONDS,
  );
}

export async function markGameCompletedWithShortTtl(gameId: string) {
  await redis.expire(getGameStateKey(gameId), COMPLETED_GAME_TTL_SECONDS);
}

export async function getPlayerNumberFromSecret(
  gameId: string,
  secret: string,
): Promise<1 | 2 | null> {
  const secretHash = hashPlayerSecret(secret);
  const gameState = await getRedisGameState(gameId);

  if (!gameState) {
    return null;
  }

  if (gameState.player1Id === secretHash) {
    return 1;
  }

  if (gameState.player2Id && gameState.player2Id === secretHash) {
    return 2;
  }

  return null;
}

export async function publishGameEvent(event: GameEvent) {
  await redis.publish(getGameEventsChannel(event.gameId), JSON.stringify(event));
}

export function sanitizeGameState(state: RedisGameState) {
  return {
    gameStatus: state.gameStatus,
    version: state.version,
  };
}
