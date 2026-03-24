import { useEffect, useState } from "react";
import { HistoricGame } from "../lib/database.types";

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalGames: number;
  limit: number;
}

export function useHistoricGames(page: number) {
  const [historicGames, setHistoricGames] = useState<HistoricGame[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/games?page=${page}`);
        if (!res.ok) throw new Error("Failed to fetch games");
        const data = await res.json();
        setHistoricGames(data.games);
        setPagination(data.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [page]);

  return { historicGames, pagination, loading, error };
}
