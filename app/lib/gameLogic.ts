export type GameState = "ongoing" | "won" | "draw" | "idle";
export type Player = 0 | 1 | 2; // 0 = empty, 1 = player 1, 2 = player 2

export interface GameStatus {
  state: GameState;
  winner?: Player;
  currentPlayer: Player;
  board: Player[][];
}

const WIN_CONDITION = 4;

function isBoardFull(board: Player[][]): boolean {
  return board[0].every(cell => cell !== 0);
}

function searchInDirection(
  board: Player[][],
  row: number,
  col: number,
  rowDir: number,
  colDir: number,
  player: Player
): number {
  let count = 0;
  let r = row + rowDir;
  let c = col + colDir;

  while (board?.[r]?.[c] === player) {
    count++;
    r += rowDir;
    c += colDir;
  }

  return count;
}

function checkWin(board: Player[][], row: number, col: number, player: Player): boolean {
  const directions: [number, number][] = [
    [0, 1],   
    [1, 0],   
    [1, 1],   
    [1, -1],  
  ];

  for (const [rowDir, colDir] of directions) {
    const count =
      1 +
      searchInDirection(board, row, col, rowDir, colDir, player) +
      searchInDirection(board, row, col, -rowDir, -colDir, player);

    if (count >= WIN_CONDITION) {
      return true;
    }
  }
  return false;
}

export function createNewGame(width = 7, height = 6): GameStatus {
  const board = Array.from({ length: height }, () => Array(width).fill(0));
  return {
    board,
    state: "ongoing",
    currentPlayer: 1,
  };
}

export function applyMove(gameStatus: GameStatus, column: number): GameStatus | null {
  const { board, currentPlayer, state } = gameStatus;
  
  if (state !== "ongoing") return null;
  if (column < 0 || column >= board[0].length) return null;

  let row = -1;
  for (let i = board.length - 1; i >= 0; i--) {
    if (board[i][column] === 0) {
      row = i;
      break;
    }
  }

  if (row === -1) return null;

  const newBoard = board.map(r => [...r]);
  newBoard[row][column] = currentPlayer;

  if (checkWin(newBoard, row, column, currentPlayer)) {
    return {
      board: newBoard,
      state: "won",
      winner: currentPlayer,
      currentPlayer,
    };
  }

  if (isBoardFull(newBoard)) {
    return {
      board: newBoard,
      state: "draw",
      winner: 0,
      currentPlayer,
    };
  }

  return {
    board: newBoard,
    state: "ongoing",
    currentPlayer: currentPlayer === 1 ? 2 : 1,
  };
}
