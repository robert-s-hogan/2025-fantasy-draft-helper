<script setup lang="ts">
import { ref } from "vue";
import { useRoster } from "@/composables/useRoster";
import TeamsPicker from "@/components/controls/TeamsPicker.vue";
import DraftTable from "@/components/draft/DraftTable.vue";
import RosterGrid from "@/components/roster/RosterGrid.vue";
import BenchList from "@/components/roster/BenchList.vue";
import DraftSlotRandomizer from "@/components/DraftSlotRandomizer.vue";
import { usePlayersStore } from "@/stores/players";

const teamOptions = [10, 12, 14, 16];
const teams = ref<number>(12);

const { roster, bench, draftedCount, draftById, resetAll } = useRoster();

// When someone else drafts a player, hide them from the board
const store = usePlayersStore();
function draftedByOthers(id: string) {
  store.hideById(id);
}
</script>

<template>
  <!-- Right pane content: top ribbon + roster snapshot + draft table -->
  <div class="p-1 space-y-3">
    <!-- Roster snapshot -->
    <section class="bg-slate-900 text-slate-100 rounded-lg p-3 shadow">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <h2
            class="pb-2 text-sm font-semibold tracking-wide flex items-center gap-2"
          >
            My Team
            <span class="text-xs font-medium bg-slate-800 px-2 py-0.5 rounded"
              >{{ draftedCount }} of 15</span
            >
          </h2>
          <RosterGrid :roster="roster" />
        </div>
        <div>
          <div class="">
            <!-- Ribbon -->
            <div
              class="bg-white border border-slate-300 rounded-md px-3 py-2 space-y-2"
            >
              <div class="flex flex-wrap items-center gap-3">
                <TeamsPicker v-model="teams" :options="teamOptions" />
                <div class="border border-slate-200 rounded-md p-2">
                  <div
                    class="text-[11px] tracking-wide uppercase text-slate-500 mb-1 text-center"
                  >
                    Actions
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      @click="resetAll()"
                      class="px-3.5 py-1.5 border border-emerald-600 bg-emerald-50 text-emerald-700 rounded-md text-sm font-medium hover:bg-emerald-100 transition"
                    >
                      Reset
                    </button>
                  </div>
                </div>
                <DraftSlotRandomizer
                  :min="1"
                  :max="teams"
                  label="Randomize Draft Slot"
                  @selected="(n:number)=>{}"
                />
              </div>
            </div>
          </div>
          <BenchList :bench="bench" />
        </div>
      </div>
    </section>

    <!-- Draft table -->
    <div class="bg-white border border-slate-300 rounded-md">
      <DraftTable
        :teams="teams"
        @draft="draftById"
        @release="draftedByOthers"
      />
    </div>
  </div>
</template>
