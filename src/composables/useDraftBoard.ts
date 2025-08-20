// src/composables/useDraftBoard.ts
import { computed, type Ref } from "vue";
import { usePlayersStore, type Player } from "@stores/players";

export type DisplayItem =
  | { type: "header"; round: number }
  | { type: "player"; data: Player };

export function useDraftBoard(teams: Ref<number>) {
  const store = usePlayersStore();
  const displayList = computed<DisplayItem[]>(() => {
    const list: DisplayItem[] = [];
    const size = Math.max(1, teams.value);
    const ordered = [...store.visible].sort((a, b) => a.rank - b.rank);
    let currentRound = 0;
    for (const p of ordered) {
      const neededRound = Math.floor((p.rank - 1) / size) + 1;
      if (neededRound !== currentRound) {
        currentRound = neededRound;
        list.push({ type: "header", round: currentRound });
      }
      list.push({ type: "player", data: p });
    }
    return list;
  });
  return { displayList };
}
