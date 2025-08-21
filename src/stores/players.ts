import { defineStore } from "pinia";
import rawPlayers from "@data/players_8_21_2025_enriched_corrected.json";

export interface Player {
  rank: number;
  name: string;
  position: "RB" | "WR" | "TE" | "QB";
  originalRank: number | null; // <-- can be null for NR
  rankChange: number | null; // computed: rank - originalRank (null if NR)
  bye: number | null;
  team: string | null;
  isNew: boolean; // <-- derived: originalRank == null
}

export const usePlayersStore = defineStore("players", {
  state: () => {
    const normalized: Player[] = (rawPlayers as any[]).map((p) => {
      const rank = Math.trunc(p.rank);
      const originalRank =
        p.originalRank == null ? null : Math.trunc(p.originalRank);
      const bye = p.bye != null ? Math.trunc(p.bye) : null;

      const isNew = originalRank == null;
      const rankChange = isNew ? null : rank - (originalRank as number);

      return {
        ...p,
        rank,
        originalRank,
        bye,
        isNew,
        rankChange,
      } as Player;
    });

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
