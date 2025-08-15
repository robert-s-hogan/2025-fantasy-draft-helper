<script setup lang="ts">
import Td from "@/ui/table/Td.vue";
import Button from "@/ui/Button.vue";
import Badge from "@/ui/Badge.vue";
import PosChip from "@/ui/PosChip.vue";
import type { Player } from "@/types/Player";
import { computed } from "vue";

const props = defineProps<{ player: Player }>();
const emit = defineEmits<{
  (e: "draft", id: Player["id"]): void;
  (e: "release", id: Player["id"]): void;
}>();

const onDraft = () => emit("draft", props.player.id);
const onRelease = () => emit("release", props.player.id);

const deltaTone = computed(() =>
  props.player.delta > 0 ? "up" : props.player.delta < 0 ? "down" : "neutral"
);
const posText = computed(() =>
  props.player.posRank
    ? `${props.player.position}${props.player.posRank}`
    : props.player.position
);
</script>

<template>
  <tr class="odd:bg-white even:bg-slate-50">
    <Td>
      <span class="text-xs text-slate-600">{{ props.player.rank }}</span>
    </Td>

    <Td>
      <Badge :tone="deltaTone as any">{{ props.player.delta }}</Badge>
    </Td>

    <Td>
      <div class="flex items-center gap-2">
        <span class="font-medium text-slate-900">{{ props.player.name }}</span>
      </div>
    </Td>

    <Td>
      <div class="flex items-center justify-center">
        <PosChip :pos="props.player.position" :text="posText" />
      </div>
    </Td>

    <Td>
      <span class="text-xs font-semibold uppercase text-slate-700">{{
        props.player.team
      }}</span>
    </Td>

    <Td>
      <div class="flex items-center justify-center gap-2">
        <Button
          size="sm"
          variant="primary"
          v-if="!props.player.taken"
          @click="onDraft"
          >DRAFT</Button
        >
        <Button size="sm" variant="outline" v-else @click="onRelease"
          >Taken</Button
        >
      </div>
    </Td>
  </tr>
</template>
