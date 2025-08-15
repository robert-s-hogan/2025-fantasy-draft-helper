<script setup lang="ts">
const props = withDefaults(defineProps<{ tone?: "neutral"|"up"|"down"|"muted" }>(), { tone: "neutral" });
const tone = {
  neutral: "bg-slate-100 text-slate-700",
  up: "bg-green-100 text-green-700",
  down: "bg-red-100 text-red-700",
  muted: "bg-black/10 text-slate-900",
} as const;
</script>

<template>
  <span :class="['inline-block rounded px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap', tone[tone]]">
    <slot />
  </span>
</template>
