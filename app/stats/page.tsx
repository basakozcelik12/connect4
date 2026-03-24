"use client";

import { Suspense } from "react";
import StatsTable from "@/app/components/StatsTable";
import PlayerScores from "@/app/components/PlayerScores";
import ReturnGameButton from "@/app/components/ReturnGameButton";
import { useHistoricGames } from "@/app/hooks/useGames";
import { useStats } from "@/app/hooks/useStats";
import { useSearchParams } from "next/navigation";

function StatsPageLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center gap-12 py-32 px-16 bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Stats
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Loading...
          </p>
        </div>
      </main>
    </div>
  );
}

function StatsPageContent() {
  const searchParams = useSearchParams();
  const pageFromQuery = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const currentPage = Number.isNaN(pageFromQuery) || pageFromQuery < 1 ? 1 : pageFromQuery;

  const { stats, loading: isStatsLoading, error: statsErrorMessage } = useStats();
  const {
    historicGames,
    pagination,
    loading: isGamesLoading,
    error: gamesErrorMessage,
  } = useHistoricGames(currentPage);

  if ((isGamesLoading && !pagination) || (isStatsLoading && !stats)) {
    return <StatsPageLoading />;
  }

  if (gamesErrorMessage || statsErrorMessage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center gap-12 py-32 px-16 bg-white dark:bg-black">
          <div className="flex flex-col items-center gap-6 text-center">
            <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
              Stats
            </h1>
            <p className="max-w-md text-lg leading-8 text-red-600 dark:text-red-400">
              Error: {gamesErrorMessage || statsErrorMessage}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center gap-6 py-10 px-16 bg-white dark:bg-black">
        <div className="flex w-full justify-between items-center">
          <h1 className="max-w-xs text-3xl font-semibold text-black dark:text-zinc-50">
            Stats
          </h1>
          <ReturnGameButton />
        </div>

        {stats && <PlayerScores stats={stats} />}

        <div className="w-full">
          <h2 className="text-xl font-semibold mb-4 text-black dark:text-zinc-50">
            Game History
          </h2>
          <StatsTable
            historicGames={historicGames}
            page={pagination?.currentPage || 1}
            totalPages={pagination?.totalPages || 1}
          />
        </div>
      </main>
    </div>
  );
}

export default function StatsPage() {
  return (
    <Suspense fallback={<StatsPageLoading />}>
      <StatsPageContent />
    </Suspense>
  );
}
