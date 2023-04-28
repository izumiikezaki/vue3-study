<script setup>
import { ref, computed } from "vue";
import HelloWorld from "./components/HelloWorld.vue";
import TheWelcome from "./components/TheWelcome.vue";

const MATRIX_SIZE = 4;
const MATRIX_INDEX_FIRST = 0;
const MATRIX_INDEX_LAST = MATRIX_SIZE - 1;

const DERECTION_TO_TOP = 8;
const DERECTION_TO_BUTTOM = 2;
const DERECTION_TO_LEFT = 4;
const DERECTION_TO_RIGHT = 6;

const matrix = ref([
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null],
]);

// const matrixStatus = computed(() => {
//   let temp = [];
//   for (let y = 0; y < MATRIX_SIZE; y++) {
//     temp[y] = [];
//     for (let x = 0; x < MATRIX_SIZE; x++) {
//       temp[y][x] = null;
//     }
//   }
// });

const moveTo = (current_y, current_x, direction) => {
  const instance = matrix.value[current_y][current_x];
  if (!instance) {
    return;
  }
  let next_y = null;
  let next_x = null;
  switch (direction) {
    case DERECTION_TO_TOP:
      if (current_y === MATRIX_INDEX_FIRST) {
        return;
      }
      next_y = current_y - 1;
      next_x = current_x;
      break;
    case DERECTION_TO_BUTTOM:
      if (current_y === MATRIX_INDEX_LAST) {
        return;
      }
      next_y = current_y + 1;
      next_x = current_x;
      break;
    case DERECTION_TO_LEFT:
      if (current_x === MATRIX_INDEX_FIRST) {
        return;
      }
      next_y = current_y;
      next_x = current_x - 1;
      break;
    case DERECTION_TO_RIGHT:
      console.log("koko");
      if (current_x === MATRIX_INDEX_LAST) {
        return;
      }
      next_y = current_y;
      next_x = current_x + 1;
      break;
    default:
      return;
  }
  if (!matrix.value[next_y][next_x]) {
    matrix.value[next_y][next_x] = instance;
    matrix.value[current_y][current_x] = null;
    moveTo(next_y, next_x, direction);
  }
};

const appearNum = (x, y, num) => {
  const instance = {
    num: num,
  };
  matrix.value[y][x] = instance;
};

const inputDerection = (direction) => {
  switch (direction) {
    case DERECTION_TO_TOP:
      for (let x = 0; x < MATRIX_SIZE; x++) {
        //必ず上から走査
        for (let y = 0; y < MATRIX_SIZE; y++) {
          if (!!matrix.value[y][x]) {
            moveTo(y, x, direction);
          }
        }
      }
      break;
    case DERECTION_TO_BUTTOM:
      for (let x = 0; x < MATRIX_SIZE; x++) {
        //必ず下から走査
        for (let y = 0; y < MATRIX_SIZE; y++) {
          const reverse_y = MATRIX_INDEX_LAST - y;
          console.log(reverse_y);
          if (!!matrix.value[reverse_y][x]) {
            console.log(matrix.value[reverse_y][x]);
            moveTo(reverse_y, x, direction);
          }
        }
      }
      break;
    case DERECTION_TO_LEFT:
      for (let y = 0; y < MATRIX_SIZE; y++) {
        for (let x = 0; x < MATRIX_SIZE; x++) {
          //必ず左から走査
          if (!!matrix.value[y][x]) {
            moveTo(y, x, direction);
          }
        }
      }
      break;
    case DERECTION_TO_RIGHT:
      for (let y = 0; y < MATRIX_SIZE; y++) {
        for (let x = 0; x < MATRIX_SIZE; x++) {
          //必ず右から走査
          const reverse_x = MATRIX_INDEX_LAST - x;
          if (!!matrix.value[y][reverse_x]) {
            moveTo(y, reverse_x, direction);
          }
        }
      }
      break;
    default:
      console.log("知らない入力だ…");
  }
  // console.log(matrix.value);
};

const keyAction = (e) => {
  if (e.keyCode == 38) {
    inputDerection(DERECTION_TO_TOP);
  } else if (e.keyCode == 40) {
    inputDerection(DERECTION_TO_BUTTOM);
  } else if (e.keyCode == 37) {
    inputDerection(DERECTION_TO_LEFT);
  } else if (e.keyCode == 39) {
    inputDerection(DERECTION_TO_RIGHT);
  }
  //キーコードの表示
  console.log(e.keyCode);
};

/**
 *
 * created
 *
 **/
// const initMatrix = (() => {
//   let temp = [];
//   for (let i = 0; i < MATRIX_SIZE; i++) {
//     temp[i] = [];
//     for (let j = 0; j < MATRIX_SIZE; j++) {
//       temp[i][j] = null;
//     }
//   }

//   matrix.value = temp;
// })();

const randomAppear = (() => {
  const x = Math.floor(Math.random() * MATRIX_SIZE);
  const y = Math.floor(Math.random() * MATRIX_SIZE);

  appearNum(x, y, 2);
})();

window.addEventListener("keydown", keyAction);
</script>

<template>
  <header>
    <h1>2048ゲーム</h1>
  </header>

  <main>
    <div v-for="row in matrix" :key="row">
      <span v-for="item in row" :key="item">{{ item?.num ?? "□" }}</span>
    </div>
  </main>
</template>

<style scoped>
</style>
