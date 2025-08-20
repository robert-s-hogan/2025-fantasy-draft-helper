<script setup lang="ts">
const props = defineProps<{ modelValue: number; options?: number[] }>();
const emit = defineEmits<{ (e: "update:modelValue", v: number): void }>();
const opts = props.options ?? [10, 12, 14, 16];
</script>

<template>
  <div class="border border-slate-200 rounded-md p-2">
    <div
      class="text-[11px] tracking-wide uppercase text-slate-500 mb-1 text-center"
    >
      Teams
    </div>
    <div class="flex items-center gap-2">
      <button
        v-for="n in opts"
        :key="n"
        @click="emit('update:modelValue', n)"
        :class="[
          'px-3 py-1.5 rounded-md text-sm font-medium border transition',
          n === modelValue
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50',
        ]"
      >
        {{ n }}
      </button>
    </div>
  </div>
</template>
