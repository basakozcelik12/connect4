interface PlayerCardProps {
  playerNumber: 1 | 2;
  wins: number;
  losses: number;
  color: string;
}

export default function PlayerCard({
  playerNumber,
  wins,
  losses,
  color,
}: PlayerCardProps) {
  const winRate =
    wins + losses > 0 ? Math.round((wins / (wins + losses)) * 100) : 0;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-black dark:text-zinc-50">
          Player {playerNumber}
        </h3>
        <div className={`w-4 h-4 ${color} rounded-full`}></div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">Wins</span>
          <span className="text-lg font-semibold">{wins}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            Losses
          </span>
          <span className="text-lg font-semibold">{losses}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            Win Rate
          </span>
          <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {winRate}%
          </span>
        </div>
      </div>
    </div>
  );
}
