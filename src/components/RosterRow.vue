<script setup lang="ts">
import type { Player } from "@stores/players";

const props = defineProps<{ player: Player }>();

const emit = defineEmits<{
  (e: "my-team", player: Player): void;
  (e: "others", player: Player): void;
}>();
</script>

<template>
  <!-- Row click = drafted by others; background uses position color class -->
  <tr
    @click="emit('others', props.player)"
    :class="[
      'cursor-pointer select-none transition active:opacity-75',
      props.player.position.toLowerCase(),
    ]"
  >
    <td class="border border-gray-300 px-4 py-2 text-sm">
      {{ props.player.rank }}
    </td>

    <!-- Player cell with 'My Team' button; stop propagation -->
    <td class="px-4 py-2 text-base font-medium">
      <div class="flex items-center justify-between gap-2">
        <span class="truncate">{{ props.player.name }}</span>
        <button
          @click.stop="emit('my-team', props.player)"
          class="shrink-0 text-xs px-2 py-1 rounded-md border border-blue-600 text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
          title="Add to My Team"
        >
          My Team
        </button>
      </div>
    </td>

    <td class="border border-gray-300 px-4 py-2 text-sm">
      {{ props.player.position }}
    </td>
  </tr>
</template>
