<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { usePlayersStore } from "@stores/players";
import type { Player } from "@stores/players";
import RosterRow from "@components/RosterRow.vue";
import DraftSlotRandomizer from "@/components/DraftSlotRandomizer.vue";

const store = usePlayersStore();

const teamOptions = [10, 12, 14, 16];
const teams = ref<number>(12);

/** ---------- ROSTER STATE ---------- */
type SlotId = "QB" | "WR1" | "WR2" | "WR3" | "RB1" | "RB2" | "TE";
const roster = reactive<Record<SlotId, Player | null>>({
  QB: null,
  WR1: null,
  WR2: null,
  WR3: null,
  RB1: null,
  RB2: null,
  TE: null,
});
const bench = ref<Player[]>([]);

const targetsByPos: Record<Player["position"], SlotId[]> = {
  WR: ["WR1", "WR2", "WR3"],
  RB: ["RB1", "RB2"],
  TE: ["TE"],
  QB: ["QB"],
};

function draftToMyTeam(p: Player) {
  for (const slot of targetsByPos[p.position]) {
    if (!roster[slot]) {
      roster[slot] = p;
      store.hide(p);
      return;
    }
  }
  bench.value.push(p);
  store.hide(p);
}
function draftedByOthers(p: Player) {
  store.hide(p);
}
function resetAll() {
  (Object.keys(roster) as SlotId[]).forEach((k) => (roster[k] = null));
  bench.value = [];
  store.reset();
}

const draftedCount = computed(
  () => Object.values(roster).filter(Boolean).length + bench.value.length
);

/** ---------- DRAFT BOARD list (round headers) ---------- */
type Header = { type: "header"; round: number };
type Row = { type: "player"; data: Player };
type DisplayItem = Header | Row;

const displayList = computed<DisplayItem[]>(() => {
  const list: DisplayItem[] = [];
  const size = Math.max(1, teams.value);
  const ordered = [...store.visible].sort((a, b) => a.rank - b.rank);
  let currentRound = 0;
  for (const p of ordered) {
    const neededRound = Math.floor((p.rank - 1) / size) + 1;
    if (neededRound !== currentRound) {
      currentRound = neededRound;
      list.push({ type: "header", round: currentRound });
    }
    list.push({ type: "player", data: p });
  }
  return list;
});
</script>

<template>
  <div class="p-4 max-w-5xl mx-auto space-y-6">
    <!-- TOP ROSTER BAR -->
    <section class="bg-slate-900 text-slate-100 rounded-lg p-3 shadow">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-semibold tracking-wide flex items-center gap-2">
          My Team
          <span class="text-xs font-medium bg-slate-800 px-2 py-0.5 rounded">
            {{ draftedCount }} of 15
          </span>
        </h2>

        <DraftSlotRandomizer
          :min="1"
          :max="teams"
          label="Randomize Draft Slot"
          @selected="(n: number) => console.log('Selected slot:', n)"
        />
      </div>

      <div class="mt-3 grid grid-cols-2 gap-3">
        <!-- Starters -->
        <div class="space-y-2">
          <!-- QB -->
          <div
            :class="[
              'rounded px-3 py-2 md:px-4 md:py-3 flex items-center justify-between',
              roster.QB ? roster.QB.position.toLowerCase() : 'bg-slate-100',
              'text-slate-900',
            ]"
          >
            <span class="text-xs tracking-wide">QB</span>
            <template v-if="roster.QB">
              <span class="text-sm truncate max-w-[12rem]">{{
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

          <!-- WR1..WR3 -->
          <div
            v-for="id in ['WR1', 'WR2', 'WR3']"
            :key="id"
            :class="[
              'rounded px-3 py-2 md:px-4 md:py-3 flex items-center justify-between',
              (roster as any)[id] ? (roster as any)[id].position.toLowerCase() : 'bg-slate-100',
              'text-slate-900'
            ]"
          >
            <span class="text-xs tracking-wide">WR</span>
            <template v-if="(roster as any)[id]">
              <span class="text-sm truncate max-w-[12rem]">{{
                (roster as any)[id].name
              }}</span>
              <span
                v-if="(roster as any)[id].team"
                class="ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white/10 uppercase"
              >
                {{ (roster as any)[id].team }}
              </span>
            </template>
            <span v-else class="text-xs text-slate-500">—</span>
          </div>

          <!-- RB1..RB2 -->
          <div
            v-for="id in ['RB1', 'RB2']"
            :key="id"
            :class="[
              'rounded px-3 py-2 md:px-4 md:py-3 flex items-center justify-between',
              (roster as any)[id] ? (roster as any)[id].position.toLowerCase() : 'bg-slate-100',
              'text-slate-900'
            ]"
          >
            <span class="text-xs tracking-wide">RB</span>
            <template v-if="(roster as any)[id]">
              <span class="text-sm truncate max-w-[12rem]">{{
                (roster as any)[id].name
              }}</span>
              <span
                v-if="(roster as any)[id].team"
                class="ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white/10 uppercase"
              >
                {{ (roster as any)[id].team }}
              </span>
            </template>
            <span v-else class="text-xs text-slate-500">—</span>
          </div>

          <!-- TE -->
          <div
            :class="[
              'rounded px-3 py-2 md:px-4 md:py-3 flex items-center justify-between',
              roster.TE ? roster.TE.position.toLowerCase() : 'bg-slate-100',
              'text-slate-900',
            ]"
          >
            <span class="text-xs tracking-wide">TE</span>
            <template v-if="roster.TE">
              <span class="text-sm truncate max-w-[12rem]">{{
                roster.TE.name
              }}</span>
              <span
                v-if="roster.TE.team"
                class="ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white/10 uppercase"
              >
                {{ roster.TE.team }}
              </span>
            </template>
            <span v-else class="text-xs text-slate-500">—</span>
          </div>
        </div>

        <!-- Bench -->
        <div>
          <div class="text-xs uppercase text-slate-400 mb-1">Bench</div>
          <div class="grid grid-cols-2 gap-2">
            <div
              v-for="p in bench"
              :key="p.rank"
              :class="[
                'rounded px-3 py-2 md:px-4 md:py-3 flex items-center justify-between gap-2',
                p.position.toLowerCase(),
                'text-slate-900',
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
                >{{ p.position }}</span
              >
            </div>

            <div
              v-if="bench.length === 0"
              class="text-xs text-slate-500 col-span-2"
            ></div>
          </div>
        </div>
      </div>
    </section>

    <!-- DRAFT BOARD -->
    <div class="overflow-x-auto">
      <table
        class="min-w-full table-fixed border-collapse border border-slate-300"
      >
        <thead class="bg-slate-100 sticky top-0 z-10">
          <tr class="select-none text-xs">
            <th
              class="border-b border-slate-300 px-4 py-2 text-center font-semibold"
            >
              #
            </th>
            <th
              class="border-b border-slate-300 px-4 py-2 text-center font-semibold"
            >
              Δ
            </th>
            <th
              class="border-b border-slate-300 px-4 py-2 text-left font-semibold"
            >
              Player
            </th>
            <th
              class="border-b border-slate-300 px-4 py-2 text-center font-semibold"
            >
              Pos
            </th>
            <th
              class="border-b border-slate-300 px-4 py-2 text-center font-semibold"
            >
              Team
            </th>
            <th class="border-b border-slate-300 px-4 py-2"></th>
          </tr>
        </thead>

        <tbody>
          <template
            v-for="item in displayList"
            :key="item.type === 'header' ? `h${item.round}` : item.data.rank"
          >
            <!-- Round header -->
            <tr v-if="item.type === 'header'">
              <td
                colspan="6"
                class="bg-slate-200 text-center font-semibold text-sm py-1 border-y border-slate-300 select-none"
              >
                Round {{ item.round }}
              </td>
            </tr>

            <!-- Player row -->
            <RosterRow
              v-else
              :player="item.data"
              @my-team="draftToMyTeam"
              @others="draftedByOthers"
            />
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style>
tbody tr:hover {
  outline: 2px solid rgba(0, 0, 0, 0.15);
  outline-offset: -2px;
}
.rb {
  background-color: #c9dcf3;
}
.wr {
  background-color: #a3f5b1;
}
.te {
  background-color: #fdf1b2;
}
.qb {
  background-color: #fca7a3;
}
.def {
  background-color: #d5ba6f;
}
.pk,
.k {
  background-color: #f5baf4;
}
</style>
