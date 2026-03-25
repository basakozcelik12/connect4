"use client";

import { useEffect, useState, ReactNode } from "react";
import { CreateGameResponse, JoinGameResponse } from "../lib/multiplayerTypes";
import { Button } from "./Button";
import { saveActiveGame, getActiveGame, clearActiveGame, ActiveGame } from "../lib/localStorage";

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="text-red-600 bg-red-50 px-4 py-2 rounded-lg">
      {message}
    </div>
  );
}

function Container({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      {children}
    </div>
  );
}

function GameIdDisplay({ gameId, showCopy = false }: { gameId: string; showCopy?: boolean }) {
  return (
    <div className="flex items-center gap-2 w-full">
      <input
        type="text"
        value={gameId}
        readOnly
        className="flex-1 min-w-0 px-4 py-2 border border-gray-300 rounded-lg font-mono text-center text-sm"
      />
      {showCopy && (
        <Button
          onClick={() => navigator.clipboard.writeText(gameId)}
          variant="secondary"
          className="!px-3 !py-2 !text-sm whitespace-nowrap"
        >
          Copy
        </Button>
      )}
    </div>
  );
}

interface GameLobbyProps {
  onGameStart: () => void;
}

export default function GameLobby({ onGameStart }: GameLobbyProps) {
  const [mode, setMode] = useState<"menu" | "create" | "join" | "reconnect">("menu");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gameId, setGameId] = useState("");
  const [createdGameId, setCreatedGameId] = useState<string | null>(null);
  const [activeGame, setActiveGame] = useState<ActiveGame | null>(null);

  useEffect(() => {
    const existing = getActiveGame();
    if (existing) {
      setActiveGame(existing);
      setMode("reconnect");
    }
  }, []);

  const handleError = (err: unknown, fallback: string) => {
    setError(err instanceof Error ? err.message : fallback);
  };

  const handleCreateGame = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/games/create", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to create game");
      }

      const data: CreateGameResponse = await response.json();
      saveActiveGame(data.gameId, data.playerSecret, data.playerNumber);
      setCreatedGameId(data.gameId);
    } catch (err) {
      handleError(err, "Failed to create game");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGame = async () => {
    if (!gameId.trim()) {
      setError("Please enter a game ID");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/games/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: gameId.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to join game");
      }

      const data: JoinGameResponse = await response.json();
      saveActiveGame(data.gameId, data.playerSecret, data.playerNumber);
      onGameStart();
    } catch (err) {
      handleError(err, "Failed to join game");
    } finally {
      setLoading(false);
    }
  };

  const handleStartCreatedGame = () => {
    onGameStart();
  };

  const handleReconnect = async () => {
    if (!activeGame) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/games/${activeGame.gameId}/state`);
      if (!response.ok) {
        throw new Error("Game not found or expired");
      }
      onGameStart();
    } catch (err) {
      handleError(err, "Failed to reconnect");
      clearActiveGame();
      setActiveGame(null);
      setMode("menu");
    } finally {
      setLoading(false);
    }
  };

  const handleStartFresh = () => {
    clearActiveGame();
    setActiveGame(null);
    setMode("menu");
  };

  const renderMenu = () => (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="flex flex-col gap-4 w-64">
        <Button onClick={() => setMode("create")} variant="primary">
          Create New Game
        </Button>
        <Button onClick={() => setMode("join")} variant="success">
          Join Game
        </Button>
      </div>
    </div>
  );

  const renderCreateGame = () => (
    <Container title="Create Game">
      {!createdGameId ? (
        <div className="flex flex-col gap-4 w-80">
          <Button onClick={handleCreateGame} disabled={loading} variant="primary">
            {loading ? "Creating..." : "Create Game"}
          </Button>
          <Button onClick={() => setMode("menu")} variant="secondary">
            Back
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-80 p-6 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Share this Game ID:</p>
            <GameIdDisplay gameId={createdGameId} showCopy />
          </div>
          <p className="text-sm text-gray-500 text-center">
            Waiting for opponent to join...
          </p>
          <Button onClick={handleStartCreatedGame} variant="primary">
            Enter Game Room
          </Button>
          <Button
            onClick={() => {
              setCreatedGameId(null);
              setMode("menu");
            }}
            variant="secondary"
          >
            Cancel
          </Button>
        </div>
      )}
      {error && <ErrorMessage message={error} />}
    </Container>
  );

  const renderJoinGame = () => (
    <Container title="Join Game">
      <div className="flex flex-col gap-4 w-80">
        <input
          type="text"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
          placeholder="Enter Game ID"
          className="px-4 py-3 border border-gray-300 rounded-lg font-mono"
        />
        <Button
          onClick={handleJoinGame}
          disabled={loading || !gameId.trim()}
          variant="success"
        >
          {loading ? "Joining..." : "Join Game"}
        </Button>
        <Button onClick={() => setMode("menu")} variant="secondary">
          Back
        </Button>
      </div>
      {error && <ErrorMessage message={error} />}
    </Container>
  );

  const renderReconnect = () => {
    if (!activeGame) return null;
    
    return (
      <Container title="Resume Game?">
        <div className="flex flex-col gap-4 w-80 p-6 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Active game found:</p>
            <div className="px-4 py-2 bg-gray-100 rounded-lg font-mono text-sm">
              {activeGame.gameId}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              You are Player {activeGame.playerNumber}
            </p>
          </div>
          <Button onClick={handleReconnect} disabled={loading} variant="primary">
            {loading ? "Reconnecting..." : "Resume Game"}
          </Button>
          <Button onClick={handleStartFresh} variant="secondary">
            Start New Game
          </Button>
        </div>
        {error && <ErrorMessage message={error} />}
      </Container>
    );
  };

  const modeRenderers = {
    menu: renderMenu,
    create: renderCreateGame,
    join: renderJoinGame,
    reconnect: renderReconnect,
  };

  return modeRenderers[mode]();
}
