// src/stores/players.ts
import { defineStore } from "pinia";
import baselineRaw from "@data/players_8_4_2025_enriched_full_updated.json";
import currentRaw from "@data/players_8_29_2025_enriched_full_updated.json";
import type { Annotation } from "@/types/annotations";

export interface Player {
  id: string;
  rank: number; // current rank
  name: string;
  position: "RB" | "WR" | "TE" | "QB" | "DST";
  originalRank: number | null; // baseline rank (8/4) or null if NR
  rankChange: number | null; // current - original (pos=worse, neg=better)
  bye: number | null;
  team: string | null;
  posRank: string | number | null;
  annotations: Annotation[];
  wasUnranked: boolean; // true if no baseline match
}

type Raw = {
  id?: string | null;
  rank?: number | null;
  name: string;
  position: string;
  // possible variants:
  team?: string | null;
  teamAbbrev?: string | null;
  team_abbrev?: string | null;
  tm?: string | null;
  franchise?: string | null;
  bye?: number | string | null;
  byeWeek?: number | string | null;
  bye_week?: number | string | null;
  byeweek?: number | string | null;

  annotations?: Annotation[];
};

// ---------- helpers ----------
function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toAnnotations(v: unknown): Annotation[] {
  if (!Array.isArray(v)) return [];
  return (v as any[])
    .map((x) => {
      if (typeof x === "string") return { kind: x.trim() };
      if (x && typeof x.kind === "string") return { ...x, kind: x.kind.trim() };
      return null;
    })
    .filter((a): a is Annotation => !!a && !!a.kind);
}

// Normalize names for matching (handles “Jr.”, “II”, apostrophes, etc.)
function canonName(name: string) {
  const suffixes = /\b(jr|sr|ii|iii|iv|v)\b/gi;
  return name
    .toLowerCase()
    .replace(suffixes, "")
    .replace(/[^a-z0-9 ]+/g, " ") // drop punctuation
    .replace(/\s+/g, " ") // collapse spaces
    .trim();
}

function normPos(pos: string | undefined | null): Player["position"] {
  const p = (pos || "").toUpperCase().replace(/\s+/g, "");
  if (p === "RB" || p === "WR" || p === "TE" || p === "QB")
    return p as Player["position"];
  // Normalize all defense variants to DST
  if (p === "DST" || p === "DEF" || p === "D/ST" || p === "D") return "DST";
  // Safe fallback (most lists assume skill positions if unknown)
  return "WR";
}

function safeTeam(t: string | null | undefined) {
  return (t ?? "").toUpperCase();
}

function makeId(p: { name: string; position: string; team: string | null }) {
  return [
    slugify(p.name),
    p.position.toLowerCase(),
    p.team ? p.team.toLowerCase() : "",
  ]
    .filter(Boolean)
    .join("_");
}

function toIntOrNull(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : parseInt(String(v), 10);
  return Number.isFinite(n) ? n : null;
}

function pickTeam(p: Raw): string | null {
  const raw =
    p.team ??
    p.teamAbbrev ??
    (p as any).team_abbrev ??
    p.tm ??
    p.franchise ??
    null;
  if (!raw) return null;
  const t = String(raw).trim().toUpperCase();
  return t.length ? t : null;
}

function normalizeList(list: Raw[]) {
  return list.map((p) => {
    const id =
      (p.id && String(p.id).trim()) ||
      makeId({ name: p.name, position: p.position, team: pickTeam(p) });

    const team = pickTeam(p);
    const bye =
      toIntOrNull(p.bye) ??
      toIntOrNull(p.byeWeek) ??
      toIntOrNull((p as any).bye_week) ??
      toIntOrNull((p as any).byeweek);

    return {
      id: String(id),
      rank: typeof p.rank === "number" ? p.rank : Number.NaN,
      name: p.name,
      nameCanon: canonName(p.name),
      position: normPos(p.position),
      bye,
      team,
      teamNorm: team ?? "", // used only for matching; keep uppercase
      annotations: toAnnotations(p.annotations),
    };
  });
}

// Merge + de-dupe annotations (baseline first, then current)
function mergeAnnotations(
  base: Annotation[] | undefined,
  curr: Annotation[] | undefined
): Annotation[] {
  const b = Array.isArray(base) ? base : [];
  const c = Array.isArray(curr) ? curr : [];
  if (b.length && c.length === 0) return b.slice(); // <-- keep baseline
  if (c.length && b.length === 0) return c.slice();

  const byKind = new Map<string, Annotation>();
  for (const a of b) if (a?.kind?.trim()) byKind.set(a.kind.trim(), a);
  for (const a of c) if (a?.kind?.trim()) byKind.set(a.kind.trim(), a);
  return [...byKind.values()];
}

export const usePlayersStore = defineStore("players", {
  state: () => {
    // 1) normalize both files
    const baseline = normalizeList(baselineRaw as Raw[]);
    const current = normalizeList(currentRaw as Raw[]);

    // 2) index baseline three ways
    const byId = new Map<string, number>(); // id -> baseline rank
    const byNamePos = new Map<string, number>(); // nameCanon|pos -> baseline rank
    const byNameOnly = new Map<string, number[]>(); // nameCanon -> [baseline ranks]
    const baselineByRank = new Map<
      number,
      ReturnType<typeof normalizeList>[number]
    >();

    let baselineMaxRank = 0;
    for (const b of baseline) {
      if (Number.isFinite(b.rank)) {
        const r = b.rank as number;
        baselineMaxRank = Math.max(baselineMaxRank, r);
        byId.set(b.id, r);
        byNamePos.set(`${b.nameCanon}|${b.position}`, r);
        const arr = byNameOnly.get(b.nameCanon) ?? [];
        arr.push(r);
        byNameOnly.set(b.nameCanon, arr);
        baselineByRank.set(r, b);
      }
    }

    const VIRTUAL_NR = baselineMaxRank + 1;

    // 3) match each current player back to baseline, in priority:
    // id → name+pos → name-only (tie-break: lowest baseline rank)
    function findOriginalRank(
      p: ReturnType<typeof normalizeList>[number]
    ): number | null {
      const idHit = byId.get(p.id);
      if (typeof idHit === "number") return idHit;

      // name + normalized position (already robust)
      const np = byNamePos.get(`${p.nameCanon}|${p.position}`);
      if (typeof np === "number") return np;

      // name-only exact(s) → pick lowest baseline rank
      const list = byNameOnly.get(p.nameCanon);
      if (list && list.length) return Math.min(...list);

      return null;
    }

    // 4) enrich current
    const enriched: Player[] = current.map((p) => {
      const rank = Number.isFinite(p.rank) ? (p.rank as number) : null;
      const matchRank = findOriginalRank(p);
      const wasUnranked = matchRank == null;
      const effectiveOriginal = wasUnranked ? VIRTUAL_NR : matchRank;

      // pull baseline row (if matched) to borrow team/bye/annotations
      const baseRow =
        matchRank != null ? baselineByRank.get(matchRank) : undefined;

      // prefer current team/bye when present; fall back to baseline
      const team = p.team ?? baseRow?.team ?? null;
      const bye = p.bye ?? baseRow?.bye ?? null;

      const rankChange =
        rank != null && effectiveOriginal != null
          ? rank - effectiveOriginal
          : null;

      // ✅ merge annotations from baseline + current
      const annotations = mergeAnnotations(baseRow?.annotations, p.annotations);

      return {
        id: p.id,
        rank: rank ?? Number.NaN,
        name: p.name,
        position: p.position,

        team,
        bye,

        originalRank: matchRank,
        rankChange,
        annotations,
        wasUnranked,
      };
    });

    // 5) quick sanity in dev: how many didn’t match?
    if (import.meta.env?.DEV) {
      const nrCount = enriched.filter((p) => p.wasUnranked).length;
      // eslint-disable-next-line no-console
      console.debug(
        `[players] baseline max=${baselineMaxRank}, NR count=${nrCount}/${enriched.length}`
      );
    }

    const map = new Map(enriched.map((p) => [p.id, p]));
    return {
      original: enriched,
      visible: [...enriched],
      byId: map,
    };
  },

  actions: {
    getById(id: string) {
      return this.byId.get(id);
    },
    hide(player: Player) {
      this.visible = this.visible.filter((p) => p.id !== player.id);
    },
    hideById(id: string) {
      this.visible = this.visible.filter((p) => p.id !== id);
    },
    unhideById(id: string) {
      const p = this.byId.get(id);
      if (p && !this.visible.some((v) => v.id === id)) this.visible.push(p);
    },
    reset() {
      this.visible = [...this.original];
    },
    shuffle() {
      this.visible.sort(() => Math.random() - 0.5);
    },
  },
});
