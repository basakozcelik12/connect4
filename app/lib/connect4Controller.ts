export type GameState = "ongoing" | "won" | "draw" | "idle";
export type Player = 0 | 1 | 2; // 0 = empty, 1 = player 1, 2 = player 2

export interface GameStatus {
  state: GameState;
  winner?: Player;
  currentPlayer: Player;
  board: Player[][];
}

export class Connect4Controller {
  public width: number;
  private height: number;
  private board: Player[][];
  private currentPlayer: Player = 1;
  private gameState: GameState = "idle";
  private readonly WIN_CONDITION = 4;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.board = this.initializeBoard();
  }

  private initializeBoard(): Player[][] {
    return Array.from({ length: this.height }, () => Array(this.width).fill(0));
  }

  public newGame(): GameStatus {
    this.board = this.initializeBoard();
    this.currentPlayer = 1;
    this.gameState = "ongoing";
    return this.getStatus();
  }

  public async makeMove(column: number): Promise<GameStatus | null> {
    console.log("Dropping a token into a column:", column);

    if (column < 0 || column >= this.width) return null;

    let row = -1;
    for (let i = this.height - 1; i >= 0; i--) {
      if (this.board[i][column] === 0) {
        row = i;
        break;
      }
    }

    if (row === -1) return null;

    this.board[row][column] = this.currentPlayer;
    if (this.checkWin(row, column)) {
      this.gameState = "won";
      await this.saveGameResult(
        this.currentPlayer,
        this.currentPlayer === 1 ? 2 : 1,
      );
    } else if (this.isBoardFull()) {
      this.gameState = "draw";
      await this.saveGameResult(0, 0);
    } else {
      this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    }

    return this.getStatus();
  }

  public getStatus(): GameStatus {
    return {
      board: this.board,
      state: this.gameState,
      winner: this.gameState === "won" ? this.currentPlayer : undefined,
      currentPlayer: this.currentPlayer,
    };
  }

  private isBoardFull(): boolean {
    for (let col = 0; col < this.width; col++) {
      if (this.board[0][col] === 0) {
        return false;
      }
    }
    return true;
  }

  private checkWin(starRow: number, startCol: number): boolean {
    const directions: [number, number][] = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];

    for (const [rowDirection, colDirection] of directions) {
      const count =
        1 +
        this.searchInDirection(starRow, startCol, rowDirection, colDirection) +
        this.searchInDirection(starRow, startCol, -rowDirection, -colDirection);

      if (count >= this.WIN_CONDITION) {
        return true;
      }
    }
    return false;
  }

  private searchInDirection(
    starRow: number,
    startCol: number,
    rowDirection: number,
    colDirection: number,
  ): number {
    let count = 0;
    let row = starRow + rowDirection;
    let col = startCol + colDirection;

    while (this.board?.[row]?.[col] === this.currentPlayer) {
      count++;
      row += rowDirection;
      col += colDirection;
    }

    return count;
  }

  private async saveGameResult(winner: number, loser: number): Promise<void> {
    await fetch("/api/games", {
      method: "POST",
      body: JSON.stringify({
        winner,
        loser,
      }),
    });
  }
}
