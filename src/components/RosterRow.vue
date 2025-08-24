<!-- src/components/RosterRow.vue -->
<script setup lang="ts">
import type { Player } from "@stores/players";
import { computed } from "vue";
import PlayerAnnotations from "@/components/PlayerAnnotations.vue";
import legend from "@/data/legend.json";
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
} from "lucide-vue-next";

const props = defineProps<{ player: Player }>();
const emit = defineEmits<{
  (e: "draft", id: string): void;
  (e: "release", id: string): void;
}>();

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
};

type LegendItem = {
  key: string;
  label: string;
  description: string;
  icon?: string;
  badgeClass?: string;
};
const legendItems = legend as LegendItem[];

const rowLegendIcons = computed(() =>
  legendItems.filter((li) => /* your existing filter logic */ true)
);

function onMyTeam() {
  emit("draft", props.player.id);
}
function onDraftedByOthers() {
  emit("release", props.player.id);
}

// For tooltip when NEW/NR:
const deltaTooltip = computed(() => {
  if (props.player.originalRank == null && props.player.rankChange != null) {
    // e.g., "New entry vs baseline: treated as 161 → 94 (Δ −67)"
    const effectiveOriginal = props.player.rank - props.player.rankChange; // invert
    const delta = props.player.rankChange;
    return `New entry vs baseline: treated as ${effectiveOriginal} → ${
      props.player.rank
    } (Δ ${delta > 0 ? "+" : ""}${delta})`;
  }
  if (props.player.originalRank == null)
    return "New to rankings (no original rank)";
  return "Change vs original rank";
});
</script>

<template>
  <tr
    class="select-none cursor-default"
    :class="(props.player.position || '').toLowerCase()"
  >
    <!-- Rank -->
    <td
      class="border border-slate-300 px-2 py-2 text-xs text-center align-middle bg-transparent"
    >
      {{ Number.isFinite(props.player.rank) ? props.player.rank : "—" }}
    </td>

    <!-- Δ (with NR handling) -->
    <td
      class="border border-slate-300 px-2 py-2 text-xs text-center align-middle bg-transparent"
      :title="deltaTooltip"
    >
      <!-- NEW / NR badge with delta color underneath -->
      <template v-if="props.player.originalRank == null">
        <span
          v-if="props.player.rankChange != null"
          :class="props.player.rankChange > 0 ? 'delta-pos' : 'delta-neg'"
          class="ml-1"
        >
          {{
            props.player.rankChange > 0
              ? `+${props.player.rankChange}`
              : props.player.rankChange
          }}
        </span>
      </template>

      <template v-else>
        <span
          v-if="
            props.player.rankChange == null || props.player.rankChange === 0
          "
          class="delta-zero"
          >–</span
        >
        <span
          v-else
          :class="props.player.rankChange > 0 ? 'delta-pos' : 'delta-neg'"
        >
          {{
            props.player.rankChange > 0
              ? `+${props.player.rankChange}`
              : props.player.rankChange
          }}
        </span>
      </template>
    </td>

    <!-- Draft buttons -->
    <td
      class="border border-slate-300 px-2 py-2 text-xs text-center align-middle bg-transparent"
    >
      <div class="flex items-center justify-center gap-2">
        <button
          type="button"
          @click="onMyTeam"
          class="px-2.5 py-1 border rounded-md text-xs font-semibold transition bg-blue-600 text-white border-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          title="Add to My Team"
        >
          My&nbsp;Team
        </button>
        <button
          type="button"
          @click="onDraftedByOthers"
          class="px-2.5 py-1 border rounded-md text-xs font-medium transition bg-white text-slate-700 border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
          title="Mark Drafted by Others"
        >
          Drafted
        </button>
      </div>
    </td>

    <!-- Player -->
    <td
      class="border border-slate-300 px-2 py-2 text-left align-middle bg-transparent"
    >
      <div class="flex items-center gap-2 text-slate-900 w-full">
        <span class="truncate">{{ props.player.name }}:</span>
        <!-- icons & flags as before -->
        <!-- <PlayerAnnotations :annotations="props.player.annotations" /> -->
      </div>
    </td>

    <!-- annotations -->
    <td
      class="border border-slate-300 px-2 py-2 text-left align-middle bg-transparent"
    >
      {{
        props.player.annotations && props.player.annotations.length > 0
          ? props.player.annotations
              .map((a) => {
                // Print a readable label: use kind or kind + details
                if (a.kind === "injury") {
                  return `Injury${a.part ? `: ${a.part}` : ""}${
                    a.status ? ` (${a.status})` : ""
                  }`;
                }
                if (a.kind === "suspension") {
                  return `Suspension${a.games ? ` (${a.games} games)` : ""}`;
                }
                if (a.kind === "contract") {
                  return `Contract${a.state ? `: ${a.state}` : ""}`;
                }
                if (a.kind === "depthchart") {
                  return `Depth chart${
                    a.whoLeft ? `: vacated by ${a.whoLeft}` : ""
                  }`;
                }
                // default just the kind
                return a.kind;
              })
              .join(", ")
          : ""
      }}
    </td>

    <!-- Team -->
    <td
      class="border border-slate-300 px-2 py-2 text-xs text-center align-middle bg-transparent uppercase"
    >
      {{ props.player.team ?? "—" }}
    </td>

    <!-- Bye -->
    <td
      class="border border-slate-300 px-2 py-2 text-xs text-center align-middle bg-transparent"
    >
      {{ props.player.bye ?? "—" }}
    </td>

    <!-- Pos -->
    <td
      class="border border-slate-300 px-2 py-2 text-xs text-center align-middle bg-transparent"
    >
      <span
        class="px-2 py-0.5 rounded text-[10px] font-semibold text-slate-900"
      >
        {{ props.player.position }}
      </span>
    </td>

    <!-- Spacer -->
    <td
      class="border border-slate-300 px-2 py-2 text-xs text-center align-middle bg-transparent"
    ></td>
  </tr>
</template>

<style scoped>
.rb {
  background-color: #c9dcf3;
}
.wr {
  background-color: #a3f5b1;
}
.te {
  background-color: #fdf1b2;
}
.qb {
  background-color: #fca7a3;
}
.dst {
  background-color: #d5ba6f;
}
.pk,
.k {
  background-color: #f5baf4;
}

.delta-pos {
  color: #dc2626;
  font-weight: 600;
} /* slipped (worse)   */
.delta-neg {
  color: #16a34a;
  font-weight: 600;
} /* improved (better) */
.delta-zero {
  color: #94a3b8;
}
.delta-nr {
  color: #475569;
  font-weight: 600;
}
.delta-new {
  color: #0ea5e9; /* cyan-500-ish for NEW */
  font-weight: 700;
  letter-spacing: 0.02em;
}
</style>
