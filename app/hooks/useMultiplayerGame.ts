import { useEffect, useRef, useState } from "react";
import { GameEvent, MultiplayerGameState } from "../lib/multiplayerTypes";

export function useMultiplayerGame(
  gameId: string,
  playerSecret: string,
  playerNumber: 1 | 2,
) {
  const [gameState, setGameState] = useState<MultiplayerGameState>({
    gameId,
    playerSecret,
    playerNumber,
    gameStatus: {
      board: Array.from({ length: 6 }, () => Array(7).fill(0)),
      currentPlayer: 1,
      state: "ongoing",
    },
    isConnected: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchInitialState = async () => {
      try {
        const response = await fetch(`/api/games/${gameId}/state`);
        if (!response.ok) {
          throw new Error("Failed to fetch game state");
        }
        const data = await response.json();
        if (mounted) {
          setGameState((prev) => ({
            ...prev,
            gameStatus: data.gameStatus,
          }));
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to load game");
          setLoading(false);
        }
      }
    };

    const connectSSE = () => {
      const eventSource = new EventSource(`/api/games/${gameId}/events`);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        if (mounted) {
          setGameState((prev) => ({ ...prev, isConnected: true }));
          setError(null);
        }
      };

      eventSource.onerror = () => {
        if (mounted) {
          setGameState((prev) => ({ ...prev, isConnected: false }));
          setError("Connection lost. Reconnecting...");
        }
      };

      eventSource.addEventListener("gameUpdate", (event) => {
        try {
          const gameEvent: GameEvent = JSON.parse(event.data);
          if (mounted) {
            handleGameEvent(gameEvent);
          }
        } catch (err) {
          console.error("Failed to parse SSE event:", err);
        }
      });
    };

    const handleGameEvent = (event: GameEvent) => {
      switch (event.type) {
        case "playerJoined":
          setError(null);
          break;
        case "moveMade":
          setGameState((prev) => ({
            ...prev,
            gameStatus: event.state.gameStatus,
          }));
          break;
        case "gameEnded":
          setGameState((prev) => ({
            ...prev,
            gameStatus: event.state.gameStatus,
          }));
          break;
      }
    };

    fetchInitialState();
    connectSSE();

    return () => {
      mounted = false;
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [gameId]);

  const makeMove = async (column: number): Promise<boolean> => {
    try {
      const response = await fetch(`/api/games/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId,
          column,
          secret: playerSecret,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Move failed");
        return false;
      }

      const data = await response.json();
      setGameState((prev) => ({
        ...prev,
        gameStatus: data.state.gameStatus,
      }));
      setError(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to make move");
      return false;
    }
  };

  return {
    gameState,
    makeMove,
    loading,
    error,
  };
}
