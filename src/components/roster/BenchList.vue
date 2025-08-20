<script setup lang="ts">
import type { Player } from "@stores/players";
defineProps<{ bench: Player[] }>();

const posBg: Record<Player["position"], string> = {
  WR: "bg-pos-wr",
  RB: "bg-pos-rb",
  TE: "bg-pos-te",
  QB: "bg-pos-qb",
};
</script>

<template>
  <div>
    <div class="text-xs uppercase text-slate-400 mb-1">Bench</div>
    <div class="grid grid-cols-2 gap-2">
      <div
        v-for="p in bench"
        :key="p.id"
        :class="[
          'rounded px-3 py-2 md:px-4 md:py-3 flex items-center justify-between gap-2 text-slate-900',
          posBg[p.position] || 'bg-slate-100',
        ]"
      >
        <span class="truncate text-sm">{{ p.name }}</span>
        <span
          v-if="p.team"
          class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-black/10 uppercase"
          >{{ p.team }}</span
        >
        <span
          class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-black/10"
        >
          {{ p.posRank ? `${p.position}${p.posRank}` : p.position }}
        </span>
      </div>

      <div
        v-if="bench.length === 0"
        class="text-xs text-slate-500 col-span-2"
      ></div>
    </div>
  </div>
</template>
