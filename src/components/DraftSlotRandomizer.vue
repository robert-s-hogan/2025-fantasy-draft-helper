<script setup lang="ts">
import { ref } from "vue";

const props = withDefaults(
  defineProps<{
    min?: number;
    max?: number;
    label?: string; // button label
  }>(),
  {
    min: 1,
    max: 12,
    label: "Randomize Draft Slot",
  }
);

const emit = defineEmits<{ (e: "selected", value: number): void }>();

const value = ref<number | null>(null);

function roll() {
  const span = props.max - props.min + 1;
  let n: number;
  if (span <= 0) n = props.min;
  else if (window.crypto?.getRandomValues) {
    const u32 = new Uint32Array(1);
    window.crypto.getRandomValues(u32);
    n = (u32[0] % span) + props.min;
  } else {
    n = Math.floor(Math.random() * span) + props.min;
  }
  value.value = n;
  emit("selected", n);
}
</script>

<template>
  <div class="flex flex-col border border-slate-200 rounded-md p-2 space-y-1">
    <button
      type="button"
      @click="roll"
      class="px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs"
    >
      {{ label }}
    </button>

    <p class="inline-flex items-center text-sm min-w-[120px]">
      <span
        v-if="value !== null"
        class="inline-flex items-center rounded px-2 bg-blue-600 text-white font-semibold ml-1"
      >
        {{ value }}
      </span>
    </p>
  </div>
</template>
