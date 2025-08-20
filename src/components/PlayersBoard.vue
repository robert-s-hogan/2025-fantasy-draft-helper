<script setup lang="ts">
import { ref } from "vue";
import { useRoster } from "@/composables/useRoster";
import TeamsPicker from "@/components/controls/TeamsPicker.vue";
import DraftTable from "@/components/draft/DraftTable.vue";
import RosterGrid from "@/components/roster/RosterGrid.vue";
import BenchList from "@/components/roster/BenchList.vue";
import DraftSlotRandomizer from "@/components/DraftSlotRandomizer.vue";

const teamOptions = [10, 12, 14, 16];
const teams = ref<number>(12);

const { roster, bench, draftedCount, draftById, releaseById, resetAll } =
  useRoster();
</script>

<template>
  <div class="p-4 max-w-5xl mx-auto space-y-6">
    <div
      class="bg-slate-800 text-white text-sm px-3 py-1.5 flex items-center gap-3 rounded-t-md"
    >
      <span class="font-semibold">My Team</span>
      <span class="ml-auto opacity-80">Draft Board</span>
    </div>

    <!-- Ribbon -->
    <div class="bg-white border border-slate-300 rounded-b-md px-3 py-2">
      <div class="flex flex-wrap items-center gap-3">
        <TeamsPicker v-model="teams" :options="teamOptions" />
        <div class="border border-slate-200 rounded-md p-2">
          <div
            class="text-[11px] tracking-wide uppercase text-slate-500 mb-1 text-center"
          >
            Actions
          </div>
          <button
            @click="resetAll()"
            class="px-4 py-1.5 border border-emerald-600 bg-emerald-50 text-emerald-700 rounded-md text-sm font-medium hover:bg-emerald-100 transition"
          >
            Reset
          </button>
        </div>
        <div class="ml-auto text-sm text-slate-600">
          <span class="font-semibold">{{ draftedCount }}</span> of 15 drafted
        </div>
      </div>
    </div>

    <!-- Top roster bar -->
    <section class="bg-slate-900 text-slate-100 rounded-lg p-3 shadow">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-semibold tracking-wide flex items-center gap-2">
          My Team
          <span class="text-xs font-medium bg-slate-800 px-2 py-0.5 rounded"
            >{{ draftedCount }} of 15</span
          >
        </h2>

        <DraftSlotRandomizer
          :min="1"
          :max="teams"
          label="Randomize Draft Slot"
          @selected="(n:number)=>console.log('Selected slot:', n)"
        />
      </div>

      <div class="mt-3 grid grid-cols-2 gap-3">
        <RosterGrid :roster="roster" />
        <BenchList :bench="bench" />
      </div>
    </section>

    <!-- Draft table -->
    <DraftTable :teams="teams" @draft="draftById" @release="releaseById" />
  </div>
</template>
