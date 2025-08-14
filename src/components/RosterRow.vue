<!-- @components/RosterRow.vue -->
<script setup lang="ts">
import type { Player } from "@stores/players";
import { computed } from "vue";

const props = defineProps<{ player: Player }>();

const emit = defineEmits<{
  (e: "my-team", p: Player): void;
  (e: "others", p: Player): void;
}>();

function onMyTeam() {
  emit("my-team", props.player);
}
function onDraftedByOthers() {
  emit("others", props.player);
}

const fmtDelta = (n: number | null) =>
  n == null || Number.isNaN(Number(n))
    ? "—"
    : n > 0
    ? `+${Math.trunc(n)}`
    : `${Math.trunc(n)}`;

const displayPos = computed(() =>
  props.player.posRank
    ? `${props.player.position}${props.player.posRank}`
    : props.player.position
);
</script>

<template>
  <tr
    class="select-none cursor-default"
    :class="props.player.position.toLowerCase()"
  >
    <!-- Pick -->
    <td
      class="border border-slate-300 px-4 py-2 text-sm text-center align-middle bg-transparent"
    >
      {{ Math.trunc(props.player.rank) }}
    </td>

    <!-- Δ -->
    <td
      class="border border-slate-300 px-4 py-2 text-sm text-center align-middle bg-transparent"
    >
      <span
        :class="[
          'inline-block min-w-[2.5rem] text-center rounded px-1 py-0.5 font-semibold',
          player.rankChange == null
            ? '!text-slate-500 bg-slate-100'
            : player.rankChange > 0
            ? '!text-green-700 bg-green-100'
            : player.rankChange < 0
            ? '!text-red-700 bg-red-100'
            : '!text-slate-600 bg-slate-100',
        ]"
        :title="`Change from previous: ${fmtDelta(player.rankChange)}`"
      >
        <span aria-hidden="true">
          {{
            player.rankChange == null
              ? ""
              : player.rankChange > 0
              ? "▲"
              : player.rankChange < 0
              ? "▼"
              : ""
          }}
        </span>
        {{ fmtDelta(player.rankChange) }}
      </span>
    </td>

    <!-- Player (name + team badge) -->
    <td
      class="border border-slate-300 px-4 py-2 text-sm align-middle bg-transparent"
    >
      <div class="flex items-center gap-2 px-2 py-1 text-slate-900">
        <span class="truncate">{{ props.player.name }}</span>

        <!-- Tiny TEAM badge -->
        <!-- <span
          v-if="props.player.team"
          class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-black/10 uppercase tracking-wide"
          :title="`Team: ${props.player.team}`"
        >
          {{ props.player.team }}
        </span> -->

        <div class="ml-auto flex gap-3">
          <button
            type="button"
            @click="onMyTeam"
            class="px-3.5 py-1.5 border rounded-md text-sm font-semibold transition bg-blue-600 text-white border-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            title="Add to My Team"
          >
            DRAFT
          </button>

          <button
            type="button"
            @click="onDraftedByOthers"
            class="px-3.5 py-1.5 border rounded-md text-sm font-medium transition bg-white text-slate-700 border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
            title="Mark Drafted by Others"
          >
            Taken
          </button>
        </div>
      </div>
    </td>

    <!-- Team column (explicit) -->
    <td
      class="border border-slate-300 px-4 py-2 text-sm text-center bg-transparent"
    >
      <span class="uppercase text-[10px]">{{ props.player.team || "—" }}</span>
    </td>

    <!-- Pos chip -> QB1/WR3/etc. -->
    <td
      class="border border-slate-300 px-4 py-2 text-sm text-center bg-transparent"
    >
      <span
        :class="[
          'px-2 py-0.5 rounded text-[10px] font-semibold text-slate-900',
          props.player.position.toLowerCase(),
        ]"
      >
        {{ displayPos }}
      </span>
    </td>
  </tr>
</template>

<style>
/* keep your position colors */
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
.def {
  background-color: #d5ba6f;
}
.pk,
.k {
  background-color: #f5baf4;
}
</style>
