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
    <!-- Pick -->
    <td
      class="border border-slate-300 px-4 py-2 text-sm align-middle bg-transparent"
    >
      {{ props.player.rank }}
    </td>

    <!-- Player + buttons -->
    <td
      class="border border-slate-300 px-4 py-2 text-sm align-middle bg-transparent"
    >
      <div class="flex items-center gap-2 px-2 py-1 text-slate-900">
        <span class="truncate">{{ props.player.name }}</span>

        <div class="ml-auto flex gap-3">
          <button
            type="button"
            @click="onMyTeam"
            class="px-3.5 py-1.5 border rounded-md text-sm font-semibold transition bg-blue-600 text-white border-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Add to My Team"
            title="Add to My Team"
          >
            My Team
          </button>

          <button
            type="button"
            @click="onDraftedByOthers"
            class="px-3.5 py-1.5 border rounded-md text-sm font-medium transition bg-white text-slate-700 border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
            aria-label="Mark Drafted by Others"
            title="Mark Drafted by Others"
          >
            Drafted
          </button>
        </div>
      </div>
    </td>

    <!-- Pos chip -->
    <td
      class="border border-slate-300 px-4 py-2 text-sm align-middle bg-transparent"
    >
      <span
        :class="[
          'px-2 py-0.5 rounded text-[10px] font-semibold text-slate-900',
          props.player.position.toLowerCase(),
        ]"
      >
        {{ props.player.position }}
      </span>
    </td>
  </tr>
</template>

<style>
/* Shared position colors (used on <tr> and on the little chip).
   Keep UNSCOPED if you color rows from another component. */
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
</style>
