import { defineStore } from "pinia";
import rawPlayers from "@data/players.json";

export interface Player {
  rank: number;
  name: string;
  position: "RB" | "WR" | "TE" | "QB";
}

export const usePlayersStore = defineStore("players", {
  state: () => ({
    original: rawPlayers as Player[],
    visible: [...(rawPlayers as Player[])],
  }),
  actions: {
    hide(player: Player) {
      this.visible = this.visible.filter((p) => p !== player);
    },
    reset() {
      this.visible = [...this.original];
    },
    shuffle() {
      // handy for mock‑draft chaos
      this.visible.sort(() => Math.random() - 0.5);
    },
  },
});
