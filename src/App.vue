<script setup>
import { ref, computed } from "vue";
import MyNavbar from "./components/MyNavbar.vue";
import MatrixFlame from "./components/MatrixFlame.vue";

const MATRIX_SIZE = 4;
const MATRIX_INDEX_FIRST = 0;
const MATRIX_INDEX_LAST = MATRIX_SIZE - 1;

const DERECTION_TO_TOP = 8;
const DERECTION_TO_BUTTOM = 2;
const DERECTION_TO_LEFT = 4;
const DERECTION_TO_RIGHT = 6;

const cellList = ref([]);

const cellListWithoutMerged = computed(() => {
  return cellList.value.filter((cell) => {
    return !cell.merged;
  });
});

const matrix = computed(() => {
  const list = [
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ];

  cellListWithoutMerged.value.forEach((cell) => {
    list[cell.y][cell.x] = cell.num;
  });

  return list;
});

const emptyPositionList = computed(() => {
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

//セルを探す(mergedは含めない)
const findCell = (y, x) => {
  return cellListWithoutMerged.value.find(
    (cell) => cell.x === x && cell.y === y
  );
};

const deleteMergedCells = () => {
  cellList.value = cellListWithoutMerged.value.concat();
};

const outOfMatrix = (y, x) => {
  return (
    y < MATRIX_INDEX_FIRST ||
    y > MATRIX_INDEX_LAST ||
    x < MATRIX_INDEX_FIRST ||
    x > MATRIX_INDEX_LAST
  );
};

const checkGameClear = () => {
  return !!cellList.value.find((cell) => cell.num >= 2048);
};

const checkGameFaild = () => {
  if (emptyPositionList.value.length > 0) {
    return false;
  }

  for (let y = 0; y < MATRIX_SIZE; y++) {
    for (let x = 0; x < MATRIX_SIZE - 1; x++) {
      if (matrix.value[y][x] == matrix.value[y][x + 1]) {
        return false;
      }
    }
  }
  for (let y = 0; y < MATRIX_SIZE - 1; y++) {
    for (let x = 0; x < MATRIX_SIZE; x++) {
      if (matrix.value[y][x] == matrix.value[y + 1][x]) {
        return false;
      }
    }
  }

  return true;
};

const moveTo = (current_y, current_x, direction) => {
  const cell = findCell(current_y, current_x);
  if (!cell) {
    return false;
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
      return false;
  }

  if (outOfMatrix(next_y, next_x)) {
    return false;
  }

  const next_cell = findCell(next_y, next_x);
  if (!next_cell) {
    cell.y = next_y;
    cell.x = next_x;
    moveTo(next_y, next_x, direction);
    return true;
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
      created_by_merge: true,
    });

    return true;
  }
  return false;
};

const randomAppear = () => {
  const positionList = emptyPositionList.value;
  if (positionList.length == 0) {
    return;
  }
  const random = Math.floor(Math.random() * positionList.length);
  const position = positionList[random];

  const num = Math.random() > 0.9 ? 4 : 2;

  cellList.value.push({
    y: position.y,
    x: position.x,
    num: num,
    merged: false,
    created_by_merge: false,
  });
  return;
};

const derectionAction = (direction) => {
  deleteMergedCells();

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

  let move_success = false;
  clClone.forEach((cell) => {
    if (!cell.merged) {
      move_success = moveTo(cell.y, cell.x, direction) || move_success;
    }
  });

  if (!move_success) {
    console.warn("その方向へは動かせません");
    return;
  }

  randomAppear();

  if (checkGameClear()) {
    alert("おめでとうございます。クリアです。");
  } else if (checkGameFaild()) {
    alert("これ以上できません。詰みです");
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
  // console.log(e.keyCode);
};

const initGame = () => {
  cellList.value = [];

  randomAppear();
};

/**
 *
 * created
 *
 **/

initGame();

window.addEventListener("keydown", keyAction);
</script>

<template>
  <header>
    <my-navbar />
  </header>

  <main>
    <div class="container flex flex-wrap mx-auto mb-8 justify-center">
      <div class="w-full p-6 md:w-1/2 xl:w-1/3">
        <div class="mb-2 flex flex-row-reverse">
          <button class="btn btn-sm normal-case" @click="initGame">
            New Game
          </button>
        </div>
        <matrix-flame :cell-list="cellList" />
        <div class="w-full p-2">
          <!-- デバッグ用 -->
          <!-- <div v-for="row in matrix" :key="row" class="w-full">
            <span v-for="(num, x) in row" :key="x" class="w-1/4"
              >{{ num ?? "□" }},</span
            >
          </div> -->
        </div>
      </div>
      <div class="w-full p-6 invisible md:visible md:w-1/2 xl:w-1/3"></div>
    </div>
  </main>
</template>

<style scoped>
</style>
