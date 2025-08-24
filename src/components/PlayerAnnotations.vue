<script setup lang="ts">
import { computed } from "vue";
import type { Annotation } from "@/types/annotations";
import legend from "@/data/legend.json";

// lucide-vue-next icons (same set you used in the sidebar)
import {
  ArrowUpRight,
  AlertTriangle,
  Flag,
  Activity,
  RotateCcw,
  ThumbsDown,
  CircleSlash,
  ThumbsUp,
  ActivitySquare,
  Shield,
  // Optional extras for non-legend kinds:
  // FirstAidKit,
  Gavel,
  FileSignature,
  UserMinus,
} from "lucide-vue-next";

const props = defineProps<{ annotations: Annotation[] }>();

/**
 * Single source of truth: map legend.icon strings -> components
 * Keep this in sync with your sidebar’s ICONS object.
 */
const ICONS: Record<string, any> = {
  ArrowUpRight,
  AlertTriangle,
  Flag,
  Activity,
  RotateCcw,
  ThumbsDown,
  CircleSlash,
  ThumbsUp,
  ActivitySquare,
  Shield,
  // Extras:
  // FirstAidKit,
  Gavel,
  FileSignature,
  UserMinus,
};

/**
 * Build a quick lookup from legend.json
 * legend item: { key, label, description, icon? }
 */
type LegendItem = {
  key: string;
  label: string;
  description: string;
  icon?: string;
};
const LEGEND = (legend as LegendItem[]).reduce<Record<string, LegendItem>>(
  (acc, it) => {
    acc[it.key] = it;
    return acc;
  },
  {}
);

/**
 * Normalize your Annotation -> legend key
 * - Keeps your existing kinds but maps them into your legend keys.
 * - Extend as needed if you add more annotation kinds later.
 */
function toLegendKey(a: Annotation): string {
  const k = (a as any).kind;

  if (k === "oline") {
    return (a as any).quality === "improved"
      ? "oline_improved"
      : "oline_concern";
  }
  if (k === "flag") return "flag";
  if (k === "frag") return "frag";
  if (k === "post_hype") return "post_hype";
  if (k === "film_zero") return "film_zero";
  if (k === "acid_reflux") return "acid_reflux";
  if (k === "film_hero") return "film_hero";
  if (k === "swing") return "swing";
  if (k === "safe") return "safe";

  // Non-legend kinds (optional beautified fallbacks)
  if (k === "injury") return "injury"; // will use neutral fallback styles
  if (k === "suspension") return "suspension"; // "
  if (k === "contract") return "contract"; // "
  if (k === "depthchart") return "depthchart"; // "

  return "unknown";
}

/**
 * Meta for each annotation:
 * - icon component (from legend if present, else a reasonable fallback)
 * - title/label for tooltip & aria
 * - css class to borrow your legend color tokens
 */
function metaFor(a: Annotation) {
  const key = toLegendKey(a);
  const fromLegend = LEGEND[key];

  // Choose icon: legend’s icon string -> component, else sensible fallback
  const iconName =
    fromLegend?.icon ??
    (key === "injury"
      ? "FirstAidKit"
      : key === "suspension"
      ? "Gavel"
      : key === "contract"
      ? "FileSignature"
      : key === "depthchart"
      ? "UserMinus"
      : "Flag");

  const icon = ICONS[iconName] ?? Flag;

  // Title priority: legend label -> specific, else generic
  let title = fromLegend?.label ?? "Note";
  if ((a as any).kind === "injury") {
    const part = (a as any).part as string | undefined;
    const status = (a as any).status as string | undefined;
    title = `Injury${part ? `: ${part}` : ""}${status ? ` (${status})` : ""}`;
  }
  if ((a as any).kind === "suspension") {
    const games = (a as any).games as number | undefined;
    title = `Suspension${games ? ` (${games} games)` : ""}`;
  }
  if ((a as any).kind === "contract") {
    const state = (a as any).state as string | undefined;
    title = state ? `Contract: ${state.replace("-", " ")}` : "Contract";
  }
  if ((a as any).kind === "depthchart") {
    const whoLeft = (a as any).whoLeft as string | undefined;
    title = whoLeft
      ? `Depth chart: vacated by ${whoLeft}`
      : "Depth chart change";
  }

  // Color class: reuse legend’s color tokens
  const colorClass = `legend-icon legend-icon--${key}`;

  return { key, icon, title, colorClass };
}

const items = computed(() => (props.annotations ?? []).map(metaFor));
</script>

<template>
  <span
    v-if="items.length"
    class="inline-flex items-center gap-1.5"
    role="list"
    aria-label="Player annotations"
  >
    <span
      v-for="(m, i) in items"
      :key="`${m.key}-${i}`"
      role="listitem"
      class="ann-pill"
      :class="m.colorClass"
      :title="m.title"
      :aria-label="m.title"
    >
      <component :is="m.icon" class="ann-icon" />
    </span>
  </span>
</template>

<style scoped>
/* Compact, readable “pills” that reuse legend colors */
.ann-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 1.25rem;
  min-width: 1.25rem;
  padding: 0 0.25rem;
  border-radius: 0.375rem; /* md */
  box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.05); /* subtle ring */
}

/* Icon sizing */
.ann-icon {
  width: 0.95rem;
  height: 0.95rem;
}

/* Inherit your legend color tokens:
   .legend-icon + .legend-icon--{key} already exist in your sidebar CSS.
   We piggyback those so colors stay perfectly consistent. */

/* Optional: dark mode polish (keeps contrast high) */
@media (prefers-color-scheme: dark) {
  .ann-pill {
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.07);
  }
}
</style>
