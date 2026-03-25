"use client";

import { useEffect } from "react";
import { useMultiplayerGame } from "../hooks/useMultiplayerGame";
import Grid from "./Grid";
import { clearActiveGame } from "../lib/localStorage";
import { getPlayerColor } from "../lib/playerColors";

interface GameRoomProps {
  gameId: string;
  playerSecret: string;
  playerNumber: 1 | 2;
  onLeave: () => void;
}

export default function GameRoom({
  gameId,
  playerSecret,
  playerNumber,
  onLeave,
}: GameRoomProps) {
  const { gameState, makeMove, loading, error } = useMultiplayerGame(
    gameId,
    playerSecret,
    playerNumber,
  );

  useEffect(() => {
    if (gameState.gameStatus && 
        (gameState.gameStatus.state === "won" || gameState.gameStatus.state === "draw")) {
      clearActiveGame();
    }
  }, [gameState.gameStatus]);

  const handleLeave = () => {
    clearActiveGame();
    onLeave();
  };

  const handleColumnClick = async (column: number) => {
    await makeMove(column);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-6 p-8">
        <div className="text-lg text-gray-600">Loading game...</div>
      </div>
    );
  }

  if (!gameState.gameStatus) {
    return (
      <div className="flex flex-col items-center gap-6 p-8">
        <div className="text-red-600">Failed to load game state</div>
        <button
          onClick={handleLeave}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Back to Lobby
        </button>
      </div>
    );
  }

  const getStatusMessage = () => {
    const { state, currentPlayer, winner } = gameState.gameStatus;

    if (state === "won") {
      if (winner === playerNumber) {
        return "🎉 You won!";
      } else {
        return "😔 You lost";
      }
    }

    if (state === "draw") {
      return "🤝 It's a draw!";
    }

    if (currentPlayer === playerNumber) {
      return "Your turn";
    } else {
      return "Opponent's turn...";
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <div className="flex items-center justify-between w-full max-w-2xl">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full border border-gray-300"
              style={{ backgroundColor: getPlayerColor(playerNumber) }}
            />
            <span className="text-sm text-gray-600">
              You are Player {playerNumber}
            </span>
          </div>
        </div>
        <button
          onClick={handleLeave}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Leave Game
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div
          className={`w-3 h-3 rounded-full ${
            gameState.isConnected ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span className="text-lg font-semibold text-gray-700">
          {getStatusMessage()}
        </span>
      </div>

      {error && (
        <div className="text-red-600 bg-red-50 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      <Grid
        gameStatus={gameState.gameStatus}
        onColumnClick={handleColumnClick}
        disabled={
          gameState.gameStatus.currentPlayer !== playerNumber ||
          gameState.gameStatus.state !== "ongoing"
        }
      />

      {gameState.gameStatus.state !== "ongoing" && (
        <button
          onClick={handleLeave}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Back to Lobby
        </button>
      )}
    </div>
  );
}
