"use client";

import { GameStatus } from "../lib/gameLogic";
import { getPlayerColor } from "../lib/playerColors";

interface GridProps {
  gameStatus: GameStatus;
  onColumnClick: (column: number) => void;
  disabled?: boolean;
}

export default function Grid({ gameStatus, onColumnClick, disabled = false }: GridProps) {
  const handleColumnClick = (column: number) => {
    if (disabled || gameStatus.state !== "ongoing") return;
    onColumnClick(column);
  };
  const width = gameStatus.board[0]?.length || 7;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
      }}
    >
      {gameStatus.board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <button
            key={`${rowIndex}-${colIndex}`}
            className="aspect-square w-10 h-10 border border-gray-500 dark:border-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed"
            onClick={() => handleColumnClick(colIndex)}
            disabled={disabled}
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                backgroundColor: getPlayerColor(cell),
              }}
            />
          </button>
        )),
      )}
    </div>
  );
}
