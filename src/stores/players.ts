import { defineStore } from "pinia";
import rawPlayers from "@data/players_8_19_2025_enriched_full.json";

export interface Player {
  rank: number;
  name: string;
  position: "RB" | "WR" | "TE" | "QB";
  originalRank: number;
  previousRank: number | null;
  rankChange: number | null;
  bye: number | null;
  team: string | null;
}

export const usePlayersStore = defineStore("players", {
  state: () => {
    const normalized = (rawPlayers as Player[]).map((p) => ({
      ...p,
      rank: Math.trunc(p.rank), // ensure integer
      originalRank: Math.trunc(p.originalRank),
      previousRank: p.previousRank != null ? Math.trunc(p.previousRank) : null,
      bye: p.bye != null ? Math.trunc(p.bye) : null,
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
