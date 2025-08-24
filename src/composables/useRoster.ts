// src/composables/useRoster.ts
import { reactive, ref, computed } from "vue";
import { usePlayersStore, type Player } from "@stores/players";

export type SlotId =
  | "QB"
  | "WR1"
  | "WR2"
  | "WR3"
  | "RB1"
  | "RB2"
  | "TE"
  | "DST";

const targetsByPos: Record<Player["position"], SlotId[]> = {
  WR: ["WR1", "WR2", "WR3"],
  RB: ["RB1", "RB2"],
  TE: ["TE"],
  QB: ["QB"],
  DST: ["DST"],
};

export function useRoster() {
  const store = usePlayersStore();

  const roster = reactive<Record<SlotId, Player | null>>({
    QB: null,
    WR1: null,
    WR2: null,
    WR3: null,
    RB1: null,
    RB2: null,
    TE: null,
    DST: null,
  });
  const bench = ref<Player[]>([]);

  function draftById(id: string) {
    const p = store.getById(id);
    if (!p) return;
    if (!p) return;
    const positions = targetsByPos[p.position as keyof typeof targetsByPos];
    for (const slot of positions) {
      if (!roster[slot]) {
        roster[slot] = p;
        store.hideById(p.id);
        return;
      }
    }
    bench.value.push(p);
    store.hideById(p.id);
  }

  function releaseById(id: string) {
    // remove from bench if there
    const idx = bench.value.findIndex((p) => p.id === id);
    if (idx >= 0) bench.value.splice(idx, 1);

    // remove from roster if there
    (Object.keys(roster) as SlotId[]).forEach((k) => {
      if (roster[k]?.id === id) roster[k] = null;
    });

    store.unhideById(id);
  }

  function resetAll() {
    (Object.keys(roster) as SlotId[]).forEach((k) => (roster[k] = null));
    bench.value = [];
    store.reset();
  }

  const draftedCount = computed(
    () => Object.values(roster).filter(Boolean).length + bench.value.length
  );

  return { roster, bench, draftedCount, draftById, releaseById, resetAll };
}
