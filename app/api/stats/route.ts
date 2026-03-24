import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { unstable_cache } from "next/cache";

const getStatsCached = unstable_cache(
  async () => {
    const groupedByWinner = await prisma.game.groupBy({
      by: ["winner"],
      _count: { id: true },
    });

    return {
      player1Wins: groupedByWinner.find((g) => g.winner === 1)?._count.id || 0,
      player2Wins: groupedByWinner.find((g) => g.winner === 2)?._count.id || 0,
      draws: groupedByWinner.find((g) => g.winner === 0)?._count.id || 0,
      totalGames: groupedByWinner.reduce((sum, g) => sum + g._count.id, 0),
    };
  },
  ["stats"],
  { tags: ["stats"], revalidate: 30 },
);

export async function GET() {
  try {
    const stats = await getStatsCached();
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get player scores" },
      { status: 500 },
    );
  }
}
