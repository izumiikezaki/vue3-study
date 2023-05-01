<script setup>
import { computed } from "vue";

const props = defineProps({
  score: Number,
});
</script>

<template>
  <!-- <span class="countdown font-mono text-6xl">
    <span :style="style"></span>
  </span> -->
  <span>score</span>
  <div>
    <span class="font-mono text-6xl">
      {{ score }}
    </span>
  </div>
</template>
