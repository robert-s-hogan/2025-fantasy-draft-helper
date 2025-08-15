// @stores/players.ts
import { defineStore } from "pinia";
import rawPlayers from "@data/8.14.2025_updated_ranks.json";

export interface Player {
  rank: number;
  name: string;
  position: "RB" | "WR" | "TE" | "QB";
  originalRank: number;
  previousRank: number | null;
  rankChange: number | null;
  bye: number;
  team: string; // <- already in your data
  posRank?: number; // <- NEW: positional rank (QB1, RB2, etc.)
}

export const usePlayersStore = defineStore("players", {
  state: () => {
    const normalized = (rawPlayers as any[]).map((p) => ({
      ...p,
      rank: Math.trunc(Number(p.rank)),
      originalRank: Math.trunc(Number(p.originalRank)),
      previousRank:
        p.previousRank != null && !Number.isNaN(Number(p.previousRank))
          ? Math.trunc(Number(p.previousRank))
          : null,
      rankChange:
        p.rankChange != null && !Number.isNaN(Number(p.rankChange))
          ? Math.trunc(Number(p.rankChange))
          : null,
      bye: Math.trunc(Number(p.bye)),
      team: String(p.team ?? "").toUpperCase(), // normalize team code just in case
    })) as Player[];

    // --- Compute positional rank once (based on overall rank) ---
    const byOverall = [...normalized].sort((a, b) => a.rank - b.rank);
    const counters: Record<Player["position"], number> = {
      QB: 0,
      RB: 0,
      WR: 0,
      TE: 0,
    };

    for (const p of byOverall) {
      counters[p.position] += 1;
      p.posRank = counters[p.position];
    }
    // ------------------------------------------------------------

    return {
      original: byOverall, // keep the computed posRank version
      visible: [...byOverall],
    };
  },
  actions: {
    hide(player: Player) {
      this.visible = this.visible.filter((p) => p !== player);
    },
    reset() {
      this.visible = [...this.original];
    },
    shuffle() {
      this.visible.sort(() => Math.random() - 0.5);
    },
  },
});
