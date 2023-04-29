<script setup>
import { computed } from "vue";
import MatrixCell from "./MatrixCell.vue";

const props = defineProps({
  matrixState: Array,
});

const cellList = computed(() => {
  let list = [];

  props.matrixState.forEach((arr, y) => {
    arr.forEach((num, x) => {
      if (num) {
        list.push({
          num: num,
          yPercent: (y / 4) * 100,
          xPercent: (x / 4) * 100,
        });
      }
    });
  });

  return list;
});
</script>

<template>
  <div class="w-full bg-gray-400 p-2 rounded">
    <div class="aspect-square relative">
      <template v-for="cell in cellList" :key="cell">
        <matrix-cell
          :num="cell.num"
          :y-percent="cell.yPercent"
          :x-percent="cell.xPercent"
        />
      </template>
    </div>
  </div>
</template>