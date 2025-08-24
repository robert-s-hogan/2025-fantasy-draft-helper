<script setup lang="ts">
import type { Player } from "@stores/players";
import type { SlotId } from "@/composables/useRoster";

// ✅ one call only
const { roster } = defineProps<{ roster: Record<SlotId, Player | null> }>();

const posBg = { WR: "wr", RB: "rb", TE: "te", QB: "qb", DST: "dst" } as const;

const wrSlots: SlotId[] = ["WR1", "WR2", "WR3"];
const rbSlots: SlotId[] = ["RB1", "RB2"];

const getSlot = (id: SlotId) => roster?.[id] ?? null;
</script>

<template>
  <div class="space-y-2">
    <!-- QB -->
    <div
      :class="[
        'rounded px-3 py-2 md:px-4 md:py-3 flex items-center justify-between text-slate-900',
        roster.QB ? posBg[roster.QB.position] : 'bg-slate-600',
      ]"
    >
      <span class="text-xs tracking-wide text-white">QB</span>
      <template v-if="roster.QB">
        <span class="text-sm truncate max-w-[12rem] text-white">{{
          roster.QB.name
        }}</span>
        <span
          v-if="roster.QB.team"
          class="ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white/10 uppercase"
        >
          {{ roster.QB.team }}
        </span>
      </template>
      <span v-else class="text-xs text-slate-500">—</span>
    </div>

    <!-- WRs -->
    <div
      v-for="id in wrSlots"
      :key="id"
      :class="[
        'rounded px-3 py-2 md:px-4 md:py-3 flex items-center justify-between text-slate-900',
        getSlot(id) ? posBg[getSlot(id)!.position] : 'bg-slate-600',
      ]"
    >
      <span class="text-xs tracking-wide text-white">WR</span>
      <template v-if="getSlot(id)">
        <span class="text-sm truncate max-w-[12rem] text-white">{{
          getSlot(id)!.name
        }}</span>
      </template>
      <span v-else class="text-xs text-slate-500">—</span>
    </div>

    <!-- RBs -->
    <div
      v-for="id in rbSlots"
      :key="id"
      :class="[
        'rounded px-3 py-2 md:px-4 md:py-3 flex items-center justify-between text-slate-900',
        getSlot(id) ? posBg[getSlot(id)!.position] : 'bg-slate-600',
      ]"
    >
      <span class="text-xs tracking-wide text-white">RB</span>
      <template v-if="getSlot(id)">
        <span class="text-sm truncate max-w-[12rem] text-white">{{
          getSlot(id)!.name
        }}</span>
      </template>
      <span v-else class="text-xs text-slate-500">—</span>
    </div>

    <!-- TE -->
    <div
      :class="[
        'rounded px-3 py-2 md:px-4 md:py-3 flex items-center justify-between text-slate-900',
        roster.TE ? posBg[roster.TE.position] : 'bg-slate-600',
      ]"
    >
      <span class="text-xs tracking-wide text-white">TE</span>
      <template v-if="roster.TE">
        <span class="text-sm truncate max-w-[12rem] text-white">{{
          roster.TE.name
        }}</span>
      </template>
      <span v-else class="text-xs text-slate-500">—</span>
    </div>

    <!-- DST -->
    <div
      :class="[
        'rounded px-3 py-2 md:px-4 md:py-3 flex items-center justify-between text-slate-900',
        roster.DST ? posBg[roster.DST.position] : 'bg-slate-600',
      ]"
    >
      <span class="text-xs tracking-wide text-white">DST</span>
      <template v-if="roster.DST">
        <span class="text-sm truncate max-w-[12rem] text-white">{{
          roster.DST.name
        }}</span>
      </template>
      <span v-else class="text-xs text-slate-500">—</span>
    </div>
  </div>
</template>
