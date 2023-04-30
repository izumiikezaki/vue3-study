<script setup>
import { ref, computed } from "vue";
import MatrixCell from "./components/MatrixCell.vue";
import MatrixFlame from "./components/MatrixFlame.vue";

const MATRIX_SIZE = 4;
const MATRIX_INDEX_FIRST = 0;
const MATRIX_INDEX_LAST = MATRIX_SIZE - 1;

const DERECTION_TO_TOP = 8;
const DERECTION_TO_BUTTOM = 2;
const DERECTION_TO_LEFT = 4;
const DERECTION_TO_RIGHT = 6;

const cellList = ref([]);

const matrix = computed(() => {
  const list = [
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ];

  cellList.value.forEach((cell) => {
    if (!cell.merged) {
      list[cell.y][cell.x] = cell.num;
    }
  });

  return list;
});

const emptyPositionList = computed(() => {
  let list = [];
  // for (let x = 0; x < MATRIX_SIZE; x++) {
  //   for (let y = 0; y < MATRIX_SIZE; y++) {
  //     if (!!findCell(y, x)) {
  //       list.push({ x: x, y: y });
  //     }
  //   }
  // }
  matrix.value.forEach((raw, y) => {
    raw.forEach((item, x) => {
      if (!item) {
        list.push({ x: x, y: y });
      }
    });
  });
  return list;
});

//セルを探すmergedは含めない
const findCell = (y, x) => {
  return cellList.value.find(
    (cell) => cell.x === x && cell.y === y && cell.merged === false
  );
};

const deleteMergedCells = () => {
  return cellList.value.filter((cell) => {
    return !cell.merged;
  });
};

const outOfMatrix = (y, x) => {
  return (
    y < MATRIX_INDEX_FIRST ||
    y > MATRIX_INDEX_LAST ||
    x < MATRIX_INDEX_FIRST ||
    x > MATRIX_INDEX_LAST
  );
};

const moveTo = (current_y, current_x, direction) => {
  const cell = findCell(current_y, current_x);
  if (!cell) {
    return { move: 0, is_merged: false };
  }
  let next_y = null;
  let next_x = null;
  switch (direction) {
    case DERECTION_TO_TOP:
      next_y = current_y - 1;
      next_x = current_x;
      break;
    case DERECTION_TO_BUTTOM:
      next_y = current_y + 1;
      next_x = current_x;
      break;
    case DERECTION_TO_LEFT:
      next_y = current_y;
      next_x = current_x - 1;
      break;
    case DERECTION_TO_RIGHT:
      next_y = current_y;
      next_x = current_x + 1;
      break;
    default:
      return { move: 0, is_merged: false };
  }

  if (outOfMatrix(next_y, next_x)) {
    return { move: 0, is_merged: false };
  }

  const next_cell = findCell(next_y, next_x);
  if (!next_cell) {
    cell.y = next_y;
    cell.x = next_x;
    const result = moveTo(next_y, next_x, direction);
    result.move += 1;
    return result;
  } else if (next_cell.num === cell.num) {
    next_cell.merged = true;
    cell.y = next_y;
    cell.x = next_x;
    cell.merged = true;

    cellList.value.push({
      y: next_y,
      x: next_x,
      num: cell.num + next_cell.num,
      merged: false,
    });

    return { move: 1, is_merged: true };
  }
  return { move: 0, is_merged: false };
};

const randomAppear = () => {
  const positionList = emptyPositionList.value;
  if (positionList.length == 0) {
    return false;
  }
  const random = Math.floor(Math.random() * positionList.length);
  const position = positionList[random];

  cellList.value.push({
    y: position.y,
    x: position.x,
    num: 2,
    merged: false,
  });
  return true;
};

const derectionAction = (direction) => {
  let move_success = false;
  const clClone = cellList.value.concat();
  switch (direction) {
    case DERECTION_TO_TOP:
      // yが小さい順（必ず上から走査するため）
      clClone.sort((a, b) => {
        return a.y - b.y;
      });
      break;
    case DERECTION_TO_BUTTOM:
      // yが大きい順（必ず下から走査するため）
      clClone.sort((a, b) => {
        return b.y - a.y;
      });
      break;
    case DERECTION_TO_LEFT:
      // xが小さい順（必ず上から走査するため）
      clClone.sort((a, b) => {
        return a.x - b.x;
      });
      break;
    case DERECTION_TO_RIGHT:
      // xが大きい順（必ず右から走査するため）
      clClone.sort((a, b) => {
        return b.x - a.x;
      });
      break;
    default:
      console.log("知らない入力だ…");
  }

  clClone.forEach((cell) => {
    if (!cell.merged) {
      const result = moveTo(cell.y, cell.x, direction) || move_success;
      move_success = result.move > 0 || move_success;
    }
  });

  if (!move_success) {
    //一つでも動かせるものがなかった場合
    console.warn("その方向へは動かせません");
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
    <h1>
      2048ゲーム<a
        href="https://github.com/izumiikezaki/vue3-study"
        target="_blank"
      >
        <i class="fa-brands fa-github-alt" />
      </a>
    </h1>
  </header>

  <main>
    <div class="container flex flex-wrap mx-auto mb-8">
      <div class="w-full p-6 md:w-1/2">
        <matrix-flame :matrix-state="matrix" />
        <div class="w-full p-2">
          <!-- デバッグ用 -->
          <div v-for="row in matrix" :key="row" class="w-full">
            <span v-for="(num, x) in row" :key="x" class="w-1/4"
              >{{ num ?? "□" }},</span
            >
          </div>
        </div>
      </div>
      <div class="w-full p-6 md:w-1/2"></div>
    </div>
  </main>
</template>

<style scoped>
</style>
