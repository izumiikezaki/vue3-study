/**
 * https://qiita.com/snst-lab/items/82bb9d878f76254fd5b2
 */

export const setupSwipe = () => {
  /**
   * @function HTMLElement.prototype.swipe　HTML要素のスワイプを検知する
   */
  if (!HTMLElement.prototype.swipe) {
    Object.defineProperty(HTMLElement.prototype, "swipe", prop);
  }
};

const prop = {
  configurable: true,
  enumerable: false,
  writable: true,
  /**
   * @string direction  スワイプの方向(left, right, up, down)
   * @function callback  スワイプイベント時に実行するコールバック関数
   * @int sensitivity  スワイプの感度。値が大きいほど小さい動きで発火する。デフォルトは5 (画面サイズ/5のスワイプで発火)
   */
  value: function (direction, callback, sensitivity) {
    const self = this;
    const sens =
      Object.prototype.toString.call(sensitivity) !== "[object Number]" ||
      sensitivity <= 0
        ? 5
        : sensitivity;
    switch (direction) {
      case "left":
        self.addEventListener(
          "touchstart",
          function (event) {
            self.removeEventListener("touchstart", null, false); //2回目以降触れただけで発火しないよう、イベントリスナを解除
            var startX = event.changedTouches[0].pageX;
            var startY = event.changedTouches[0].pageY;
            self.addEventListener("touchend", function (event) {
              const endX = event.changedTouches[0].pageX;
              const endY = event.changedTouches[0].pageY;
              const direction = getDirection(
                endX,
                endY,
                startX,
                startY,
                screen.height,
                screen.width,
                sens
              );
              if (direction === "left") {
                callback(self);
              }
              startX = 0;
            });
          },
          false
        );
        break;
      case "right":
        self.addEventListener(
          "touchstart",
          function (event) {
            self.removeEventListener("touchstart", null, false);
            var startX = event.changedTouches[0].pageX;
            var startY = event.changedTouches[0].pageY;
            self.addEventListener("touchend", function (event) {
              self.removeEventListener("touchend", null, false);
              const endX = event.changedTouches[0].pageX;
              const endY = event.changedTouches[0].pageY;
              const direction = getDirection(
                endX,
                endY,
                startX,
                startY,
                screen.height,
                screen.width,
                sens
              );
              if (direction === "right") {
                callback(self);
              }
              startX = screen.width;
            });
          },
          false
        );
        break;
      case "up":
        self.addEventListener(
          "touchstart",
          function (event) {
            self.removeEventListener("touchstart", null, false);
            var startX = event.changedTouches[0].pageX;
            var startY = event.changedTouches[0].pageY;
            self.addEventListener("touchend", function (event) {
              self.removeEventListener("touchend", null, false);
              const endX = event.changedTouches[0].pageX;
              const endY = event.changedTouches[0].pageY;
              const direction = getDirection(
                endX,
                endY,
                startX,
                startY,
                screen.height,
                screen.width,
                sens
              );
              if (direction === "up") {
                callback(self);
              }
              startY = 0;
            });
          },
          false
        );
        break;
      case "down":
        self.addEventListener(
          "touchstart",
          function (event) {
            self.removeEventListener("touchstart", null, false);
            var startX = event.changedTouches[0].pageX;
            var startY = event.changedTouches[0].pageY;
            self.addEventListener("touchend", function (event) {
              self.removeEventListener("touchend", null, false);
              const endX = event.changedTouches[0].pageX;
              const endY = event.changedTouches[0].pageY;
              const direction = getDirection(
                endX,
                endY,
                startX,
                startY,
                screen.height,
                screen.width,
                sens
              );
              if (direction === "down") {
                callback(self);
              }
              startY = screen.height;
            });
          },
          false
        );
        break;
    }
  },
};

const getDirection = (endX, endY, startX, startY, height, width, sens) => {
  const values = [
    { name: "left", value: startX - width / sens - endX },
    { name: "right", value: endX - (startX + width / sens) },
    { name: "up", value: startY - height / sens - endY },
    { name: "down", value: endY - (startY + height / sens) },
  ];
  const max = values.reduce((a, b) => (a.value > b.value ? a : b));
  console.log(max.name);
  if (max.value < 0) {
    //必ずどこかは正の数なのでここはならないはず
    return "";
  }

  return max.name;
};
