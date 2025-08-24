import { computed } from "vue";
import { usePlayersStore } from "@stores/players";
import type { Annotation } from "@/types/annotations";
// import as many update files as you want:
import updatesA from "@data/players_8_4_2025_enriched_full_ready.json";
import updatesB from "@data/players_8_21_2025_enriched_corrected.json";

type UpdateRow = {
  name: string;
  position: string;
  team?: string | null;
  annotations?: Annotation[]; // optional: many inputs won't have this yet
};

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const keyFrom = (n: string, pos: string, team?: string | null) =>
  [normalize(n), pos.toLowerCase(), team ? team.toLowerCase() : ""].join("|");

export function useAnnotations() {
  const store = usePlayersStore();

  // Build a quick lookup by flexible keys
  const baseByKey = computed(() => {
    const map = new Map<string, string>(); // key -> playerId
    for (const p of store.original) {
      // prefer team when present
      map.set(keyFrom(p.name, p.position, p.team), p.id);
      // fallback key without team (many rows have null team in 8/21/25 file)
      map.set(keyFrom(p.name, p.position, null), p.id);
    }
    return map;
  });

  // Flatten all update sources
  const allUpdates: UpdateRow[] = [
    ...(updatesA as any[]),
    ...(updatesB as any[]),
  ];

  // annotationsById: Map<playerId, Annotation[]>
  const annotationsById = computed(() => {
    const out = new Map<string, Annotation[]>();
    for (const row of allUpdates) {
      const k = keyFrom(row.name, row.position, row.team ?? null);
      const id = baseByKey.value.get(k);
      if (!id) {
        // Option A: quietly skip or log; Option B: insert as new "NR" row:
        // (uncomment to insert)
        // const newId = `${normalize(row.name)}_${row.position.toLowerCase()}_${row.team ?? ""}`.replace(/_$/, "");
        // store.original.push({ id: newId, rank: 9999, name: row.name, position: row.position as any, originalRank: null, rankChange: null, bye: null, team: row.team ?? null });
        // out.set(newId, row.annotations);
        continue;
      }
      const anns = Array.isArray(row.annotations) ? row.annotations : [];
      if (anns.length === 0) continue; // nothing to render yet
      out.set(id, [...(out.get(id) ?? []), ...anns]);
    }
    return out;
  });

  function getAnnotations(playerId: string): Annotation[] {
    const p = store.byId.get(playerId);
    const fromPlayer = Array.isArray(p?.annotations) ? p!.annotations : [];
    const external = annotationsById.value.get(playerId) ?? [];
    // Filter out placeholder/invalid items
    return [...fromPlayer, ...external].filter(
      (a) => a && typeof a.kind === "string" && a.kind.trim()
    );
  }

  return { getAnnotations, annotationsById };
}
