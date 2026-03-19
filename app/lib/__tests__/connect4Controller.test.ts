import { Connect4Controller } from "../connect4Controller";

describe("Connect4Controller", () => {
  describe("makeMove", () => {
    it("should fill a 1x1 grid when making a move in column 0", () => {
      const controller = new Connect4Controller(1, 1);
      controller.newGame();

      const status = controller.makeMove(0);

      expect(status).not.toBeNull();
      expect(status?.board[0][0]).toBe(1);
    });
  });

  describe("column validation", () => {
    it("should return null when column is negative", () => {
      const controller = new Connect4Controller(7, 6);
      controller.newGame();

      const status = controller.makeMove(-1);

      expect(status).toBeNull();
    });

    it("should return null when column is too large", () => {
      const controller = new Connect4Controller(7, 6);
      controller.newGame();

      const status = controller.makeMove(7);

      expect(status).toBeNull();
    });
  });

  describe("column full validation", () => {
    it("should return null when column is full", () => {
      const controller = new Connect4Controller(7, 6);
      controller.newGame();

      for (let row = 0; row < 6; row++) {
        controller.makeMove(0);
      }

      const status = controller.makeMove(0);

      expect(status).toBeNull();
    });

    it("should handle a completely full board", () => {
      const controller = new Connect4Controller(2, 2);
      controller.newGame();

      controller.makeMove(0);
      controller.makeMove(1);
      controller.makeMove(0);
      controller.makeMove(1);

      const status1 = controller.makeMove(0);
      const status2 = controller.makeMove(1);

      expect(status1).toBeNull();
      expect(status2).toBeNull();
    });
  });

  describe("token placement", () => {
    it("should place token in the bottom row of empty column", () => {
      const controller = new Connect4Controller(7, 6);
      controller.newGame();

      const status = controller.makeMove(3);

      expect(status).not.toBeNull();
      expect(status?.board[5][3]).toBe(1);
      expect(status?.board[4][3]).toBe(0);
    });

    it("should place tokens in different columns correctly", () => {
      const controller = new Connect4Controller(7, 6);
      controller.newGame();

      controller.makeMove(0);
      controller.makeMove(6);

      const status = controller.getStatus();
      expect(status?.board[5][0]).toBe(1);
      expect(status?.board[5][6]).toBe(2);
    });
  });

  describe("player switching", () => {
    it("should switch from player 1 to player 2 after a move", () => {
      const controller = new Connect4Controller(7, 6);
      controller.newGame();

      const initialStatus = controller.getStatus();
      expect(initialStatus.currentPlayer).toBe(1);

      const status = controller.makeMove(0);

      expect(status?.currentPlayer).toBe(2);
    });

    it("should not switch player when move is invalid", () => {
      const controller = new Connect4Controller(7, 6);
      controller.newGame();

      const initialStatus = controller.getStatus();
      expect(initialStatus.currentPlayer).toBe(1);

      const status1 = controller.makeMove(-1);
      expect(status1).toBeNull();
      expect(controller.getStatus().currentPlayer).toBe(1);
    });
  });
});
