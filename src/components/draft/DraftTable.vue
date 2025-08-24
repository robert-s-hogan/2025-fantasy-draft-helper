<script setup lang="ts">
import { useDraftBoard } from "@/composables/useDraftBoard";
import { ref, watch } from "vue";
import RosterRow from "@/components/RosterRow.vue";

const props = defineProps<{ teams: number }>();
const emit = defineEmits<{
  (e: "draft", id: string): void;
  (e: "release", id: string): void;
}>();

const teamsRef = ref(props.teams);
watch(
  () => props.teams,
  (v) => (teamsRef.value = v)
);

const { displayList } = useDraftBoard(teamsRef);
</script>

<template>
  <div class="overflow-x-auto">
    <table
      class="min-w-full table-fixed border-collapse border border-slate-300"
    >
      <thead class="bg-slate-100 sticky top-0 z-10 text-xs">
        <tr class="select-none">
          <th
            class="w-10 border-b border-slate-300 px-2 py-2 text-center font-semibold"
          >
            #
          </th>
          <th
            class="w-12 border-b border-slate-300 px-2 py-2 text-center font-semibold"
          >
            Δ
          </th>
          <th
            class="w-36 border-b border-slate-300 px-2 py-2 text-center font-semibold"
          >
            Draft
          </th>
          <th
            class="border-b border-slate-300 px-4 py-2 text-left font-semibold"
          >
            Player
          </th>
          <th
            class="border-b border-slate-300 px-4 py-2 text-left font-semibold"
          >
            Annotations
          </th>
          <th
            class="w-14 border-b border-slate-300 px-2 py-2 text-center font-semibold"
          >
            Team
          </th>
          <th
            class="w-12 border-b border-slate-300 px-2 py-2 text-center font-semibold"
          >
            Bye
          </th>
          <th
            class="w-12 border-b border-slate-300 px-2 py-2 text-center font-semibold"
          >
            POS
          </th>
          <th
            class="w-10 border-b border-slate-300 px-2 py-2 text-center font-semibold"
          ></th>
        </tr>
      </thead>

      <tbody>
        <template
          v-for="item in displayList"
          :key="item.type === 'header' ? `h${item.round}` : item.data.id"
        >
          <tr v-if="item.type === 'header'">
            <td
              colspan="9"
              class="bg-slate-200 text-center font-semibold text-sm py-1 border-y border-slate-300 select-none"
            >
              Round {{ item.round }}
            </td>
          </tr>

          <RosterRow
            v-else
            :player="item.data"
            @draft="(id: string) => emit('draft', id)"
            @release="(id: string) => emit('release', id)"
          />
        </template>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
tbody tr:hover {
  outline: 2px solid rgba(0, 0, 0, 0.15);
  outline-offset: -2px;
}
</style>
