export interface GameSubmission {
  winner: number;
  loser: number;
}

export interface HistoricGame {
  id: number;
  winner: number;
  loser: number;
  createdAt: string;
}