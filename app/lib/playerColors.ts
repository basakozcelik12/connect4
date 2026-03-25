import { Player } from "./gameLogic";

export const PLAYER_COLORS = {
  0: "transparent",
  1: "rgb(239, 68, 68)",
  2: "rgb(250, 204, 21)",
} as const;

export function getPlayerColor(player: Player): string {
  return PLAYER_COLORS[player];
}
