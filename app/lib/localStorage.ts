export interface ActiveGame {
  gameId: string;
  playerSecret: string;
  playerNumber: 1 | 2;
  lastActive: number;
}

const ACTIVE_GAME_KEY = "connect4_active_game";

export function saveActiveGame(gameId: string, playerSecret: string, playerNumber: 1 | 2) {
  const activeGame: ActiveGame = {
    gameId,
    playerSecret,
    playerNumber,
    lastActive: Date.now(),
  };
  localStorage.setItem(ACTIVE_GAME_KEY, JSON.stringify(activeGame));
}

export function getActiveGame(): ActiveGame | null {
  const stored = localStorage.getItem(ACTIVE_GAME_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as ActiveGame;
  } catch {
    return null;
  }
}

export function clearActiveGame() {
  localStorage.removeItem(ACTIVE_GAME_KEY);
}
