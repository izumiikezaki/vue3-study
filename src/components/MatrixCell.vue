<script setup>
import { computed } from "vue";

const props = defineProps({
  cell: Object,
});

const colorClass = computed(() => {
  switch (props.cell.num) {
    case 2:
      return "bg-slate-50";
    case 4:
      return "bg-slate-200";
    case 8:
      return "bg-slate-300";
    case 16:
      return "bg-slate-400";
    case 32:
      return "bg-slate-500";
    case 64:
      return "bg-slate-600";
    case 128:
      return "bg-slate-700";
    case 256:
      return "bg-slate-800";
    case 512:
      return "bg-slate-900";
    case 1024:
      return "bg-slate-900";
    case 2048:
      return "bg-slate-900";
    default:
      return "bg-lime-700";
  }
});

const textColorClass = computed(() => {
  if (props.cell.num > 8) {
    return "text-slate-100";
  }
  return "text-slate-900";
});

const styleForPosition = computed(() => {
  return {
    top: `${(props.cell.y / 4) * 100}%`,
    left: `${(props.cell.x / 4) * 100}%`,
  };
});
</script>

<template>
  <div
    class="absolute aspect-square w-1/4 p-1 cell-animation"
    :style="styleForPosition"
  >
    <div
      class="w-full rounded aspect-square grid place-items-center"
      :class="colorClass"
    >
      <span :class="textColorClass">
        {{ cell.num }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.cell-animation {
  transition: all 0.3s ease;
}
</style>