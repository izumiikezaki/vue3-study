<script setup>
import { ref, computed } from "vue";

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

const emptyCellList = computed(() => {
  let list = [];
  matrix.value.forEach((raw, y) => {
    raw.forEach((item, x) => {
      if (!item) {
        list.push({ x: x, y: y });
      }
    });
  });
  return list;
});

const moveTo = (current_y, current_x, direction) => {
  const instance = matrix.value[current_y][current_x];
  if (!instance) {
    return false;
  }
  let next_y = null;
  let next_x = null;
  switch (direction) {
    case DERECTION_TO_TOP:
      if (current_y === MATRIX_INDEX_FIRST) {
        return false;
      }
      next_y = current_y - 1;
      next_x = current_x;
      break;
    case DERECTION_TO_BUTTOM:
      if (current_y === MATRIX_INDEX_LAST) {
        return false;
      }
      next_y = current_y + 1;
      next_x = current_x;
      break;
    case DERECTION_TO_LEFT:
      if (current_x === MATRIX_INDEX_FIRST) {
        return false;
      }
      next_y = current_y;
      next_x = current_x - 1;
      break;
    case DERECTION_TO_RIGHT:
      if (current_x === MATRIX_INDEX_LAST) {
        return false;
      }
      next_y = current_y;
      next_x = current_x + 1;
      break;
    default:
      return false;
  }
  if (!matrix.value[next_y][next_x]) {
    matrix.value[next_y][next_x] = instance;
    matrix.value[current_y][current_x] = null;
    moveTo(next_y, next_x, direction);
    return true;
  } else if (matrix.value[next_y][next_x].num == instance.num) {
    matrix.value[next_y][next_x].num += instance.num;
    matrix.value[current_y][current_x] = null;
    return true;
  }
  return false;
};

const randomAppear = () => {
  const list = emptyCellList.value;
  if (list.length == 0) {
    return false;
  }
  const random = Math.floor(Math.random() * list.length);
  const cell = list[random];

  const instance = {
    num: 2,
  };
  matrix.value[cell.y][cell.x] = instance;
  return true;
};

const derectionAction = (direction) => {
  let move_success = false;
  switch (direction) {
    case DERECTION_TO_TOP:
      for (let x = 0; x < MATRIX_SIZE; x++) {
        //必ず上から走査
        for (let y = 0; y < MATRIX_SIZE; y++) {
          if (!!matrix.value[y][x]) {
            move_success = moveTo(y, x, direction) || move_success;
          }
        }
      }
      break;
    case DERECTION_TO_BUTTOM:
      for (let x = 0; x < MATRIX_SIZE; x++) {
        //必ず下から走査
        for (let y = 0; y < MATRIX_SIZE; y++) {
          const reverse_y = MATRIX_INDEX_LAST - y;
          if (!!matrix.value[reverse_y][x]) {
            move_success = moveTo(reverse_y, x, direction) || move_success;
          }
        }
      }
      break;
    case DERECTION_TO_LEFT:
      for (let y = 0; y < MATRIX_SIZE; y++) {
        for (let x = 0; x < MATRIX_SIZE; x++) {
          //必ず左から走査
          if (!!matrix.value[y][x]) {
            move_success = moveTo(y, x, direction) || move_success;
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
            move_success = moveTo(y, reverse_x, direction) || move_success;
          }
        }
      }
      break;
    default:
      console.log("知らない入力だ…");
  }

  if (!move_success) {
    //一つでも動かせるものがなかった場合
    alert("その方向へは動かせません");
    return;
  }

  const appear_success = randomAppear();
  if (!appear_success) {
    alert("これ以上生成できませんでした。");
  }
};

const keyAction = (e) => {
  if (e.keyCode == 38) {
    derectionAction(DERECTION_TO_TOP);
  } else if (e.keyCode == 40) {
    derectionAction(DERECTION_TO_BUTTOM);
  } else if (e.keyCode == 37) {
    derectionAction(DERECTION_TO_LEFT);
  } else if (e.keyCode == 39) {
    derectionAction(DERECTION_TO_RIGHT);
  }
  //キーコードの表示
  console.log(e.keyCode);
};

/**
 *
 * created
 *
 **/

randomAppear();

window.addEventListener("keydown", keyAction);
</script>

<template>
  <header>
    <h1>2048ゲーム</h1>
  </header>

  <main>
    <div v-for="row in matrix" :key="row">
      <span v-for="item in row" :key="item">{{ item?.num ?? "□" }},</span>
    </div>
  </main>
</template>

<style scoped>
</style>
