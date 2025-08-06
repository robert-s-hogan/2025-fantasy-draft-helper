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
  <!-- Row itself is inert; only buttons are clickable -->
  <tr class="select-none cursor-default pointer-events-none">
    <!-- Pick -->
    <td class="border-b border-gray-200 px-4 py-2 text-sm align-middle">
      {{ props.player.rank }}
    </td>

    <!-- Player + buttons -->
    <td class="border-b border-gray-200 px-4 py-2 text-sm align-middle">
      <!-- APPLY POSITION BACKGROUND HERE -->
      <div
        class="flex items-center gap-2 rounded px-2 py-1 pointer-events-auto"
        :class="[props.player.position.toLowerCase(), 'text-slate-900']"
      >
        <span class="truncate">{{ props.player.name }}</span>

        <div class="ml-auto flex gap-2">
          <button
            type="button"
            @click="onMyTeam"
            class="px-2 py-1 border rounded text-xs font-medium transition bg-blue-600 text-white border-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Add to My Team"
            title="Add to My Team"
          >
            My Team
          </button>

          <button
            type="button"
            @click="onDraftedByOthers"
            class="px-2 py-1 border rounded text-xs font-medium transition bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
            aria-label="Mark Drafted by Others"
            title="Mark Drafted by Others"
          >
            Drafted
          </button>
        </div>
      </div>
    </td>

    <!-- Pos chip (keeps your existing colors) -->
    <td class="border-b border-gray-200 px-4 py-2 text-sm align-middle">
      <span
        :class="[
          'px-2 py-0.5 rounded text-[10px] font-semibold',
          props.player.position.toLowerCase(), // uses .rb/.wr/.qb/.te
          'text-slate-900',
        ]"
      >
        {{ props.player.position }}
      </span>
    </td>
  </tr>
</template>
