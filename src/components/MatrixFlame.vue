<script setup>
import { computed } from "vue";
import MatrixCell from "./MatrixCell.vue";

const props = defineProps({
  cellList: Array,
});
</script>

<template>
  <div class="w-full bg-gray-400 p-2 rounded">
    <div class="aspect-square relative">
      <template v-for="cell in cellList" :key="cell">
        <matrix-cell :cell="cell" />
      </template>
    </div>
  </div>
</template>