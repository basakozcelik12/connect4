import { NextRequest, NextResponse } from "next/server";
import { GameSubmission } from "@/app/lib/database.types";
import { prisma } from "@/app/lib/prisma";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const body: GameSubmission = await request.json();

    if (body.winner === undefined || body.loser === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 },
      );
    }

    const game = await prisma.game.create({
      data: {
        winner: body.winner,
        loser: body.loser,
      },
    });
    revalidateTag("stats", { expire: 0 });
    revalidatePath("/stats");
    return NextResponse.json({ id: game.id, success: true }, { status: 201 });
  } catch (error) {
    console.error("Error saving game:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to save game: ${message}` },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 },
      );
    }

    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10");

    const totalGames = await prisma.game.count();
    const totalPages = Math.ceil(totalGames / limit);

    const games = await prisma.game.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      games,
      pagination: {
        currentPage: page,
        totalPages,
        totalGames,
        limit,
      },
    });
  } catch (error) {
    console.error("Error getting games:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to get games: ${message}` },
      { status: 500 },
    );
  }
}
