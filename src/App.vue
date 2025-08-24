<script setup lang="ts">
import { ref, computed } from "vue";
import LegendSidebar from "@/components/LegendSidebar.vue";
import PlayersBoard from "@/components/PlayersBoard.vue";

/** Pick your widths once. Keep both components in sync. */
const OPEN_W = "20rem";
const CLOSED_W = "8rem";

const sidebarOpen = ref(true);
const sidebarWidth = computed(() => (sidebarOpen.value ? OPEN_W : CLOSED_W));
</script>

<template>
  <!-- Sidebar lives as a sibling (fixed to viewport) -->
  <LegendSidebar
    v-model:open="sidebarOpen"
    :openWidth="OPEN_W"
    :closedWidth="CLOSED_W"
  />

  <!-- Content is offset by the exact same width -->
  <div
    class="min-h-screen transition-[padding] duration-200 ease-in-out"
    :style="{ paddingLeft: sidebarWidth }"
  >
    <div style="padding: 0rem">
      <header
        class="h-12 flex items-center gap-3 px-3 border-b border-slate-200 bg-white sticky top-0 z-20"
      >
        <div class="text-sm text-slate-700 font-medium">Draft Dashboard</div>
      </header>

      <main class="p-4">
        <PlayersBoard />
      </main>
    </div>
  </div>
</template>
