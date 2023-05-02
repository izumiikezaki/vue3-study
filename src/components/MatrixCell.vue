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
      return "bg-slate-900 shadow-lg shadow-slate-900/50";
    case 1024:
      return "bg-slate-900 shadow-lg shadow-slate-900/50";
    case 2048:
      return "bg-slate-900 shadow-lg shadow-slate-900/50";
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

const classOfAnimation = computed(() => {
  if (props.cell.created_by_merge) {
    return ["move-animation", "merge-animation"];
  }
  return ["move-animation", "appear-animation"];
});
</script>

<template>
  <div
    class="absolute aspect-square w-1/4 p-1"
    :style="styleForPosition"
    :class="classOfAnimation"
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
.move-animation {
  transition: all 0.2s ease-in-out;
}

.appear-animation {
  animation: appear 0.3s ease 0.2s;
  animation-fill-mode: backwards;
}

.merge-animation {
  animation: merge 0.3s ease 0.1s;
  animation-fill-mode: backwards;
}

@keyframes appear {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes merge {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
    transform: scale(1.3);
  }
}
</style>