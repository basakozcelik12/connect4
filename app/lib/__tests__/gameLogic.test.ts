import { createNewGame, applyMove, GameStatus } from "../gameLogic";

describe("gameLogic", () => {
  describe("applyMove", () => {
    it("should fill a 1x1 grid when making a move in column 0", () => {
      const gameStatus = createNewGame(1, 1);
      const status = applyMove(gameStatus, 0);

      expect(status).not.toBeNull();
      expect(status?.board[0][0]).toBe(1);
    });
  });

  describe("column validation", () => {
    it("should return null when column is negative", () => {
      const gameStatus = createNewGame(7, 6);
      const status = applyMove(gameStatus, -1);

      expect(status).toBeNull();
    });

    it("should return null when column is too large", () => {
      const gameStatus = createNewGame(7, 6);
      const status = applyMove(gameStatus, 7);

      expect(status).toBeNull();
    });
  });

  describe("column full validation", () => {
    it("should return null when column is full", () => {
      let gameStatus = createNewGame(7, 6);

      for (let row = 0; row < 6; row++) {
        const result = applyMove(gameStatus, 0);
        if (result) gameStatus = result;
      }

      const status = applyMove(gameStatus, 0);

      expect(status).toBeNull();
    });

    it("should handle a completely full board", () => {
      let gameStatus = createNewGame(2, 2);

      gameStatus = applyMove(gameStatus, 0)!;
      gameStatus = applyMove(gameStatus, 1)!;
      gameStatus = applyMove(gameStatus, 0)!;
      gameStatus = applyMove(gameStatus, 1)!;

      const status1 = applyMove(gameStatus, 0);
      const status2 = applyMove(gameStatus, 1);

      expect(status1).toBeNull();
      expect(status2).toBeNull();
    });
  });

  describe("token placement", () => {
    it("should place token in the bottom row of empty column", () => {
      const gameStatus = createNewGame(7, 6);
      const status = applyMove(gameStatus, 3);

      expect(status).not.toBeNull();
      expect(status?.board[5][3]).toBe(1);
      expect(status?.board[4][3]).toBe(0);
    });

    it("should place tokens in different columns correctly", () => {
      let gameStatus = createNewGame(7, 6);

      gameStatus = applyMove(gameStatus, 0)!;
      gameStatus = applyMove(gameStatus, 6)!;

      expect(gameStatus.board[5][0]).toBe(1);
      expect(gameStatus.board[5][6]).toBe(2);
    });
  });

  describe("player switching", () => {
    it("should switch from player 1 to player 2 after a move", () => {
      const gameStatus = createNewGame(7, 6);
      expect(gameStatus.currentPlayer).toBe(1);

      const status = applyMove(gameStatus, 0);

      expect(status?.currentPlayer).toBe(2);
    });

    it("should not switch player when move is invalid", () => {
      const gameStatus = createNewGame(7, 6);
      expect(gameStatus.currentPlayer).toBe(1);

      const status1 = applyMove(gameStatus, -1);
      expect(status1).toBeNull();
      expect(gameStatus.currentPlayer).toBe(1);
    });
  });

  describe("win detection", () => {
    describe("horizontal win", () => {
      it("should detect 4 in a row horizontally", () => {
        let gameStatus = createNewGame(7, 6);

        gameStatus = applyMove(gameStatus, 0)!;
        gameStatus = applyMove(gameStatus, 4)!;
        gameStatus = applyMove(gameStatus, 1)!;
        gameStatus = applyMove(gameStatus, 4)!;
        gameStatus = applyMove(gameStatus, 2)!;
        gameStatus = applyMove(gameStatus, 4)!;
        const status = applyMove(gameStatus, 3);

        expect(status?.state).toBe("won");
        expect(status?.winner).toBe(1);
      });
    });

    describe("vertical win", () => {
      it("should detect 4 in a row vertically", () => {
        let gameStatus = createNewGame(7, 6);

        gameStatus = applyMove(gameStatus, 0)!;
        gameStatus = applyMove(gameStatus, 1)!;
        gameStatus = applyMove(gameStatus, 0)!;
        gameStatus = applyMove(gameStatus, 1)!;
        gameStatus = applyMove(gameStatus, 0)!;
        gameStatus = applyMove(gameStatus, 1)!;
        const status = applyMove(gameStatus, 0);

        expect(status?.state).toBe("won");
        expect(status?.winner).toBe(1);
      });
    });

    describe("diagonal win", () => {
      it("should detect 4 in a row diagonally up-right", () => {
        let gameStatus = createNewGame(7, 6);

        gameStatus = applyMove(gameStatus, 0)!;
        gameStatus = applyMove(gameStatus, 1)!;
        gameStatus = applyMove(gameStatus, 1)!;
        gameStatus = applyMove(gameStatus, 2)!;
        gameStatus = applyMove(gameStatus, 2)!;
        gameStatus = applyMove(gameStatus, 3)!;
        gameStatus = applyMove(gameStatus, 3)!;
        gameStatus = applyMove(gameStatus, 5)!;
        gameStatus = applyMove(gameStatus, 2)!;
        gameStatus = applyMove(gameStatus, 3)!;
        const status = applyMove(gameStatus, 3);

        expect(status?.state).toBe("won");
        expect(status?.winner).toBe(1);
      });

      it("should detect 4 in a row diagonally up-left", () => {
        let gameStatus = createNewGame(7, 6);

        gameStatus = applyMove(gameStatus, 3)!;
        gameStatus = applyMove(gameStatus, 2)!;
        gameStatus = applyMove(gameStatus, 2)!;
        gameStatus = applyMove(gameStatus, 1)!;
        gameStatus = applyMove(gameStatus, 1)!;
        gameStatus = applyMove(gameStatus, 0)!;
        gameStatus = applyMove(gameStatus, 1)!;
        gameStatus = applyMove(gameStatus, 0)!;
        gameStatus = applyMove(gameStatus, 0)!;
        gameStatus = applyMove(gameStatus, 6)!;
        const status = applyMove(gameStatus, 0);

        expect(status?.state).toBe("won");
        expect(status?.winner).toBe(1);
      });
    });
  });

  describe("draw detection", () => {
    it("should detect draw when board is full with no winner", () => {
      let gameStatus = createNewGame(2, 2);

      gameStatus = applyMove(gameStatus, 0)!;
      gameStatus = applyMove(gameStatus, 1)!;
      gameStatus = applyMove(gameStatus, 0)!;
      gameStatus = applyMove(gameStatus, 1)!;

      expect(gameStatus.state).toBe("draw");
      expect(gameStatus.winner).toBe(0);
    });
  });
});
