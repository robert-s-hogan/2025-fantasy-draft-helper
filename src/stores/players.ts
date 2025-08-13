import { defineStore } from "pinia";
import rawPlayers from "@data/players_8_12_2025_enriched_full.json";

export interface Player {
  rank: number;
  name: string;
  position: "RB" | "WR" | "TE" | "QB";
  originalRank: number;
  previousRank: number | null;
  rankChange: number | null;
  bye: number;
  team: string;
}

export const usePlayersStore = defineStore("players", {
  state: () => {
    const normalized = (rawPlayers as Player[]).map((p) => ({
      ...p,
      rank: Math.trunc(p.rank), // ensure integer
      originalRank: Math.trunc(p.originalRank),
      previousRank: p.previousRank != null ? Math.trunc(p.previousRank) : null,
      bye: Math.trunc(p.bye),
    }));

    return {
      original: normalized,
      visible: [...normalized],
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
