<script setup lang="ts">
import { ref, computed } from "vue";
import { usePlayersStore } from "@stores/players";

const store = usePlayersStore();

const teamOptions = [10, 12, 14, 16];
const teams = ref<number>(12);

interface Header {
  type: "header";
  round: number;
}
interface Row {
  type: "player";
  data: (typeof store.visible)[number];
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
    <!-- TEAM SIZE CONTROLS -->
    <div class="flex items-center justify-between">
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
          @click="store.reset()"
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

    <!-- SPREADSHEET TABLE -->
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

            <!-- Player row -->
            <tr
              v-else
              @click="store.hide(item.data)"
              :class="[
                'cursor-pointer select-none transition active:opacity-75',
                item.data.position.toLowerCase(),
              ]"
            >
              <td class="border border-gray-300 px-4 py-2 text-sm">
                {{ item.data.rank }}
              </td>
              <td
                class="border border-gray-300 px-4 py-2 text-base font-medium"
              >
                {{ item.data.name }}
              </td>
              <td class="border border-gray-300 px-4 py-2 text-sm">
                {{ item.data.position }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* Light backgrounds per position – tweak to taste */
.rb {
  background-color: #e0f2ff;
}
.wr {
  background-color: #ffe8e8;
}
.te {
  background-color: #fff8e0;
}
.qb {
  background-color: #f0f0f0;
}
</style>
