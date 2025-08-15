<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  as?: "button" | "a";
  href?: string;
  disabled?: boolean;
}>(), {
  variant: "primary",
  size: "sm",
  as: "button",
  disabled: false,
});

const base = "inline-flex items-center justify-center gap-1 rounded-md border font-medium transition focus:outline-none focus:ring-2 disabled:opacity-50 disabled:pointer-events-none";
const byVariant = {
  primary: "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 focus:ring-blue-400",
  outline: "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 focus:ring-slate-300",
  ghost: "bg-transparent border-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-300",
} as const;
const bySize = {
  sm: "px-2.5 py-1.5 text-xs",
  md: "px-3.5 py-2 text-sm",
  lg: "px-4.5 py-2.5 text-base",
} as const;
</script>

<template>
  <component
    :is="as"
    :href="as==='a' ? href : undefined"
    :disabled="disabled && as==='button'"
    :class="[base, byVariant[variant], bySize[size]]"
  >
    <slot />
  </component>
</template>
