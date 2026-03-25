"use client";

import { useState } from "react";
import Link from "next/link";
import GameLobby from "./components/GameLobby";
import GameRoom from "./components/GameRoom";
import { getActiveGame } from "./lib/localStorage";

export default function Home() {
  const [inGame, setInGame] = useState(false);

  const handleGameStart = () => {
    setInGame(true);
  };

  const handleLeaveGame = () => {
    setInGame(false);
  };

  const activeGame = inGame ? getActiveGame() : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center gap-12 py-32 px-16 bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Connect 4
          </h1>
          <Link
            href="/stats"
            className="text-blue-500 hover:text-blue-600 text-sm"
          >
            View Statistics →
          </Link>
        </div>

        {!inGame ? (
          <GameLobby onGameStart={handleGameStart} />
        ) : activeGame ? (
          <GameRoom
            gameId={activeGame.gameId}
            playerSecret={activeGame.playerSecret}
            playerNumber={activeGame.playerNumber}
            onLeave={handleLeaveGame}
          />
        ) : (
          <div className="text-red-600">Failed to load game data</div>
        )}
      </main>
    </div>
  );
}
