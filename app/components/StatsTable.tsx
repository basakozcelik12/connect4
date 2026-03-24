import { useRouter } from "next/navigation";
import { HistoricGame } from "../lib/database.types";

interface StatsTableProps {
  historicGames: HistoricGame[];
  page: number;
  totalPages: number;
}

export default function StatsTable({
  historicGames,
  page,
  totalPages,
}: StatsTableProps) {
  const router = useRouter();
  const formatResult = (winner: number, loser: number) => {
    if (winner === 0 && loser === 0) {
      return "Draw";
    }
    return `Player ${winner} won`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (historicGames.length === 0) {
    return (
      <p className="text-zinc-600 dark:text-zinc-400 text-center py-8">
        No games played yet
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-700">
            <th className="text-left py-3 px-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Game #
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Result
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Date & Time
            </th>
          </tr>
        </thead>
        <tbody>
          {historicGames.map((game, index) => (
            <tr
              key={game.id}
              className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              <td className="py-3 px-4 text-sm text-zinc-900 dark:text-zinc-100">
                #{index + 1}
              </td>
              <td className="py-3 px-4 text-sm text-zinc-900 dark:text-zinc-100">
                {formatResult(game.winner, game.loser)}
              </td>
              <td className="py-3 px-4 text-sm text-zinc-900 dark:text-zinc-100">
                {formatDate(game.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-center gap-4 py-4">
        <button
          disabled={page === 1}
          onClick={() => router.push(`?page=${page - 1}`, { scroll: false })}
          className="px-4 py-2 text-sm font-medium rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        <span className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => router.push(`?page=${page + 1}`, { scroll: false })}
          className="px-4 py-2 text-sm font-medium rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
