<script setup lang="ts">
import { computed } from "vue";
import legend from "@/data/legend.json";
import {
  ArrowUpRight,
  AlertTriangle,
  Flag,
  Activity,
  RotateCcw,
  ThumbsDown,
  CircleSlash,
  ThumbsUp,
  ActivitySquare,
  Shield,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-vue-next";

const props = defineProps<{
  open: boolean;
  openWidth?: string; // e.g. "10rem"
  closedWidth?: string; // e.g. "4rem"
}>();
const emit = defineEmits<{ (e: "update:open", v: boolean): void }>();

const isOpen = computed({
  get: () => props.open,
  set: (v) => emit("update:open", v),
});

// Single source of truth for the actual rendered width
const width = computed(() =>
  isOpen.value ? props.openWidth ?? "10rem" : props.closedWidth ?? "4rem"
);

const ICONS: Record<string, any> = {
  ArrowUpRight,
  AlertTriangle,
  Flag,
  Activity,
  RotateCcw,
  ThumbsDown,
  CircleSlash,
  ThumbsUp,
  ActivitySquare,
  Shield,
};

function toggle() {
  isOpen.value = !isOpen.value;
}

type LegendItem = {
  key: string;
  label: string;
  description: string;
  icon?: string;
};
const items = legend as LegendItem[];
</script>

<template>
  <aside
    class="fixed top-0 left-0 h-screen bg-white border-r border-slate-200 shadow-sm overflow-y-auto z-30 transition-[width] duration-200"
    :style="{ width }"
    aria-label="Draft board legend"
  >
    <div
      class="flex items-center justify-between h-12 border-b border-slate-200 px-2"
    >
      <h2
        class="py-3 text-sm font-semibold tracking-wide text-slate-700 select-none"
        :class="isOpen ? 'block' : 'sr-only'"
      >
        Draft legend
      </h2>
      <button
        class="ml-auto p-2 hover:bg-slate-100 transition"
        :aria-expanded="isOpen"
        @click="toggle"
      >
        <component
          :is="isOpen ? ChevronsLeft : ChevronsRight"
          class="w-4 h-4"
        />
      </button>
    </div>

    <ul class="list-none m-0 p-0">
      <li
        v-for="it in items"
        :key="it.key"
        class="flex gap-3 py-3 px-2 items-start"
      >
        <component
          :is="ICONS[it.icon ?? 'Flag']"
          class="legend-icon"
          :class="`legend-icon--${it.key}`"
        />
        <div class="min-w-0">
          <span
            class="legend-badge"
            :class="`legend-badge--${it.key} capitalize`"
          >
            {{ it.label.toLowerCase() }}
          </span>
          <p class="legend-desc">{{ it.description }}</p>
        </div>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
/* Badge base */
.legend-badge {
  display: inline-block;
  padding: 3px 8px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.2;
  border-radius: 4px;
  white-space: nowrap;
}
/* Icon base */
.legend-icon {
  width: 2.5rem;
  height: 2.5rem;
}
/* Description text */
.legend-desc {
  font-size: 0.8rem;
  margin-top: 0.25rem;
  color: #475569;
}

/* Badge + icon colors per key */
.legend-badge--oline_improved,
.legend-icon--oline_improved {
  background: #d1fae5;
  color: #065f46;
}
.legend-badge--oline_concern,
.legend-icon--oline_concern {
  background: #ffe4e6;
  color: #9f1239;
}
.legend-badge--flag,
.legend-icon--flag {
  background: #e0e7ff;
  color: #3730a3;
}
.legend-badge--frag,
.legend-icon--frag {
  background: #fef3c7;
  color: #92400e;
}
.legend-badge--post_hype,
.legend-icon--post_hype {
  background: #e0f2fe;
  color: #075985;
}
.legend-badge--film_zero,
.legend-icon--film_zero {
  background: #e2e8f0;
  color: #1f2937;
}
.legend-badge--acid_reflux,
.legend-icon--acid_reflux {
  background: #ffedd5;
  color: #9a3412;
}
.legend-badge--film_hero,
.legend-icon--film_hero {
  background: #ecfccb;
  color: #3f6212;
}
.legend-badge--swing,
.legend-icon--swing {
  background: #fae8ff;
  color: #701a75;
}
.legend-badge--safe,
.legend-icon--safe {
  background: #ccfbf1;
  color: #115e59;
}

/* fallbacks */
.legend-badge[class*="legend-badge--"]:not(
    .legend-badge--oline_improved,
    .legend-badge--oline_concern,
    .legend-badge--flag,
    .legend-badge--frag,
    .legend-badge--post_hype,
    .legend-badge--film_zero,
    .legend-badge--acid_reflux,
    .legend-badge--film_hero,
    .legend-badge--swing,
    .legend-badge--safe
  ),
.legend-icon[class*="legend-icon--"]:not(
    .legend-icon--oline_improved,
    .legend-icon--oline_concern,
    .legend-icon--flag,
    .legend-icon--frag,
    .legend-icon--post_hype,
    .legend-icon--film_zero,
    .legend-icon--acid_reflux,
    .legend-icon--film_hero,
    .legend-icon--swing,
    .legend-icon--safe
  ) {
  background: #f1f5f9;
  color: #334155;
}
</style>
