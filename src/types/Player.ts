import type { Pos } from "@/ui/posStyles";

export interface Player {
  id: string | number;
  rank: number;      // # column
  delta: number;     // Δ column
  name: string;      // Player column
  team: string;      // e.g., PHI
  position: Pos;     // RB | WR | TE | QB
  posRank?: number;  // e.g., 1 for RB1
  taken: boolean;    // drafted or not
}
