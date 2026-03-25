import { GameStatus } from "./gameLogic";

export interface CreateGameResponse {
  gameId: string;
  playerSecret: string;
  playerNumber: 1;
}

export interface JoinGameResponse {
  gameId: string;
  playerSecret: string;
  playerNumber: 2;
}

export interface GameStateResponse {
  gameId: string;
  gameStatus: GameStatus;
  player1Id: string;
  player2Id: string | null;
}

export interface MoveRequest {
  column: number;
  playerSecret: string;
}

export interface MoveResponse {
  success: boolean;
  gameStatus: GameStatus;
}

export type GameEvent =
  | { type: "playerJoined"; gameId: string; state: { gameStatus: GameStatus; version: number } }
  | { type: "moveMade"; gameId: string; state: { gameStatus: GameStatus; version: number } }
  | { type: "gameEnded"; gameId: string; state: { gameStatus: GameStatus; version: number } };

export interface MultiplayerGameState {
  gameId: string;
  playerSecret: string;
  playerNumber: 1 | 2;
  gameStatus: GameStatus;
  isConnected: boolean;
}
