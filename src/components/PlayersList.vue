<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { usePlayersStore } from "@stores/players";
import type { Player } from "@stores/players";
import RosterRow from "@components/RosterRow.vue";

const store = usePlayersStore();

const teamOptions = [10, 12, 14, 16];
const teams = ref<number>(12);

/** ---------- ROSTER STATE (starters left, bench right) ---------- */
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

// Fill order for each position
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
      store.hide(p); // remove from board
      return;
    }
  }
  bench.value.push(p); // overflow -> bench
  store.hide(p);
}

function draftedByOthers(p: Player) {
  store.hide(p); // just hide
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
interface Header {
  type: "header";
  round: number;
}
interface Row {
  type: "player";
  data: Player;
}
type DisplayItem = Header | Row;

const displayList = computed<DisplayItem[]>(() => {
  const list: DisplayItem[] = [];
  const size = teams.value;
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
  <div class="p-4 max-w-3xl mx-auto space-y-6">
    <!-- TOP ROSTER BAR -->
    <section class="bg-slate-900 text-slate-100 rounded-lg p-3 shadow">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-semibold tracking-wide flex items-center gap-2">
          My Team
          <span class="text-xs font-medium bg-slate-800 px-2 py-0.5 rounded">
            {{ draftedCount }} of 15
          </span>
        </h2>
      </div>

      <!-- Starters (left) | Bench (right) -->
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
                p.position.toLowerCase(), // card uses position color
                'text-slate-900',
              ]"
            >
              <span class="truncate text-sm">{{ p.name }}</span>
              <span
                class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-black/10"
              >
                {{ p.position }}
              </span>
            </div>

            <div
              v-if="bench.length === 0"
              class="text-xs text-slate-500 col-span-2"
            ></div>
          </div>
        </div>
      </div>
    </section>

    <!-- TEAM SIZE CONTROLS -->
    <div class="flex items-center justify-between py-3">
      <div class="flex items-center space-x-3">
        <span class="font-medium text-gray-700">Teams:</span>
        <div class="flex space-x-2">
          <button
            v-for="n in teamOptions"
            :key="n"
            @click="teams = n"
            :class="[
              'px-3 py-1 border rounded-md text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-400',
              teams === n
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
            ]"
          >
            {{ n }}
          </button>
        </div>
      </div>
      <div class="flex space-x-2">
        <button
          @click="resetAll()"
          class="px-4 py-1 border border-green-500 bg-green-50 text-green-700 rounded-md text-sm font-medium hover:bg-green-100 transition focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          Reset
        </button>
        <button
          @click="store.shuffle()"
          class="px-4 py-1 border border-yellow-500 bg-yellow-50 text-yellow-700 rounded-md text-sm font-medium hover:bg-yellow-100 transition focus:outline-none focus:ring-2 focus:ring-yellow-300"
        >
          Shuffle
        </button>
      </div>
    </div>

    <!-- DRAFT BOARD -->
    <div class="overflow-x-auto">
      <table class="min-w-full table-auto border-separate border-spacing-y-1">
        <thead class="bg-gray-100">
          <tr class="select-none">
            <th
              class="border-b border-gray-300 px-4 py-2 text-left text-sm font-medium"
            >
              Pick
            </th>
            <th
              class="border-b border-gray-300 px-4 py-2 text-left text-sm font-medium"
            >
              Player
            </th>
            <th
              class="border-b border-gray-300 px-4 py-2 text-left text-sm font-medium"
            >
              Pos
            </th>
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
                colspan="3"
                class="bg-gray-200 text-center font-semibold text-sm py-1 border-t border-b border-gray-300 select-none"
              >
                Round {{ item.round }}
              </td>
            </tr>

            <!-- Row component -->
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

<!-- Position color chips global so both components can use -->
<style>
.rb {
  background-color: #c9dcf3;
} /* Light Blue */
.wr {
  background-color: #a3f5b1;
} /* Mint Green */
.te {
  background-color: #fdf1b2;
} /* Pastel Yellow */
.qb {
  background-color: #fca7a3;
} /* Salmon Red */
.def {
  background-color: #d5ba6f;
} /* Muted Gold */
.pk,
.k {
  background-color: #f5baf4;
} /* Light Pinkish Purple */
</style>
