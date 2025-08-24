<script setup lang="ts">
import { Icon } from "@iconify/vue";
import type { Annotation } from "@/types/annotations";

const props = defineProps<{ annotations: Annotation[] }>();

function iconAndTitle(a: Annotation): { icon: string; title: string } {
  if ((a as any).kind === "injury") {
    const part = (a as any).part as string | undefined;
    const status = (a as any).status as string | undefined;

    if (part === "concussion")
      return { icon: "tabler:brain", title: "Concussion" };
    if (["ankle", "foot", "toe"].includes(part ?? ""))
      return { icon: "tabler:shoe", title: `Injury: ${part}` };
    if (["hand", "wrist"].includes(part ?? ""))
      return { icon: "tabler:hand-stop", title: `Injury: ${part}` };
    if (
      ["knee", "shoulder", "hamstring", "quad", "groin", "back"].includes(
        part ?? ""
      )
    ) {
      return {
        icon: "tabler:bandage",
        title: `Injury: ${part}${status ? ` (${status})` : ""}`,
      };
    }
    return {
      icon: "tabler:stethoscope",
      title: `Injury${status ? ` (${status})` : ""}`,
    };
  }

  if ((a as any).kind === "oline") {
    return (a as any).quality === "improved"
      ? { icon: "tabler:shield-up", title: "Improved offensive line" }
      : { icon: "tabler:shield-off", title: "Weak offensive line" };
  }

  if ((a as any).kind === "contract") {
    const state = (a as any).state;
    if (state === "holding-out")
      return { icon: "tabler:hand-stop", title: "Contract holdout" };
    if (state === "extension" || state === "signed") {
      return {
        icon: "tabler:file-certificate",
        title: "Contract signed/extended",
      };
    }
    return { icon: "tabler:signature", title: "Contract situation" };
  }

  if ((a as any).kind === "suspension") {
    const games = (a as any).games as number | undefined;
    return {
      icon: "tabler:gavel",
      title: `Suspension${games ? ` (${games} games)` : ""}`,
    };
  }

  if ((a as any).kind === "depthchart") {
    const whoLeft = (a as any).whoLeft as string | undefined;
    return {
      icon: "tabler:user-minus",
      title: whoLeft ? `Vacated by ${whoLeft}` : "Depth chart cleared",
    };
  }

  return { icon: "tabler:icons", title: "Note" };
}
</script>

<template>
  <span v-if="props.annotations?.length" class="flex items-center gap-1.5">
    <Icon
      v-for="(a, i) in props.annotations"
      :key="i"
      :icon="iconAndTitle(a).icon"
      width="14"
      :aria-label="iconAndTitle(a).title"
      :title="iconAndTitle(a).title"
    />
  </span>
</template>

<style scoped>
:deep(svg) {
  vertical-align: middle;
}
</style>
