<script setup lang="ts">
import type { Player } from "@stores/players";

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
</script>

<template>
  <!-- Color the ENTIRE ROW by position -->
  <tr
    class="select-none cursor-default"
    :class="props.player.position.toLowerCase()"
  >
    <!-- Rank -->
    <td
      class="border border-slate-300 px-2 py-2 text-xs text-center align-middle bg-transparent"
    >
      {{ props.player.rank }}
    </td>

    <!-- Δ -->
    <td
      class="border border-slate-300 px-2 py-2 text-xs text-center align-middle bg-transparent"
      :title="
        props.player.isNew
          ? 'New to rankings (no original rank)'
          : 'Change vs original baseline'
      "
    >
      <!-- Not originally ranked -->
      <span v-if="props.player.isNew" class="delta-nr">NR</span>

      <!-- No change -->
      <span
        v-else-if="
          props.player.rankChange == null || props.player.rankChange === 0
        "
        class="delta-zero"
        >–</span
      >

      <!-- Has change -->
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
    </td>

    <!-- Player + buttons -->
    <td
      class="border border-slate-300 px-2 py-2 text-sm align-middle bg-transparent"
    >
      <div class="flex items-center gap-2 px-2 py-1 text-slate-900">
        <span class="truncate">{{ props.player.name }}</span>
        <div class="ml-auto flex gap-2">
          <button
            type="button"
            @click="onMyTeam"
            class="px-3.5 py-1.5 border rounded-md text-sm font-semibold transition bg-blue-600 text-white border-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            title="Add to My Team"
          >
            My Team
          </button>

          <button
            type="button"
            @click="onDraftedByOthers"
            class="px-3.5 py-1.5 border rounded-md text-sm font-medium transition bg-white text-slate-700 border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
            title="Mark Drafted by Others"
          >
            Drafted
          </button>
        </div>
      </div>
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

    <!-- Team -->
    <td
      class="border border-slate-300 px-2 py-2 text-xs text-center align-middle bg-transparent uppercase"
    >
      {{ props.player.team ?? "—" }}
    </td>

    <!-- actions spacer for alignment (kept empty; buttons live in Player cell) -->
    <td
      class="border border-slate-300 px-2 py-2 text-xs text-center align-middle bg-transparent"
    ></td>
  </tr>
</template>

<style>
.rb {
  background-color: #c9dcf3;
} /* Light Blue  */
.wr {
  background-color: #a3f5b1;
} /* Mint Green  */
.te {
  background-color: #fdf1b2;
} /* Pastel Yellow */
.qb {
  background-color: #fca7a3;
} /* Salmon Red   */
.def {
  background-color: #d5ba6f;
} /* Muted Gold   */
.pk,
.k {
  background-color: #f5baf4;
} /* Pink/Purple */
.delta-pos {
  color: #dc2626;
  font-weight: 600;
} /* red for slipping */
.delta-neg {
  color: #16a34a;
  font-weight: 600;
} /* green for improving */
.delta-zero {
  color: #94a3b8;
} /* gray dash */
.delta-nr {
  color: #475569;
  font-weight: 600;
} /* neutral slate */
</style>
