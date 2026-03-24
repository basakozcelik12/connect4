import PlayerCard from "./PlayerCard";

export interface PlayerStats {
  player1Wins: number;
  player2Wins: number;
  draws: number;
  totalGames: number;
}

export default function PlayerScores({ stats }: { stats: PlayerStats }) {
  const player1Losses = stats.player2Wins;
  const player2Losses = stats.player1Wins;

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-6 text-black dark:text-zinc-50">
        Player Statistics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PlayerCard
          playerNumber={1}
          wins={stats.player1Wins}
          losses={player1Losses}
          color={"bg-red-500"}
        />
        <PlayerCard
          playerNumber={2}
          wins={stats.player2Wins}
          losses={player2Losses}
          color="bg-yellow-500"
        />
      </div>
    </div>
  );
}
