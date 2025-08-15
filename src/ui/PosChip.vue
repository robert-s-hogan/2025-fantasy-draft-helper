<script setup lang="ts">
import { POS_PILL, type Pos } from "./posStyles";
const props = defineProps<{ pos: Pos; text?: string }>();
</script>

<template>
  <span :class="['rounded px-2 py-0.5 text-[10px] font-semibold uppercase', POS_PILL[props.pos]]">
    {{ text ?? props.pos }}
  </span>
</template>
