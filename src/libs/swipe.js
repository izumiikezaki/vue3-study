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
            var position = event.changedTouches[0].pageX;
            self.addEventListener("touchend", function (event) {
              self.removeEventListener("touchend", null, false);
              if (
                event.changedTouches[0].pageX <
                position - screen.width / sens
              ) {
                callback(self);
              }
              position = 0;
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
            var position = event.changedTouches[0].pageX;
            self.addEventListener("touchend", function (event) {
              self.removeEventListener("touchend", null, false);
              if (
                event.changedTouches[0].pageX >
                position + screen.width / sens
              ) {
                callback(self);
              }
              position = screen.width;
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
            var position = event.changedTouches[0].pageY;
            self.addEventListener("touchend", function (event) {
              self.removeEventListener("touchend", null, false);
              if (
                event.changedTouches[0].pageY <
                position - screen.height / sens
              ) {
                callback(self);
              }
              position = 0;
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
            var position = event.changedTouches[0].pageY;
            self.addEventListener("touchend", function (event) {
              self.removeEventListener("touchend", null, false);
              if (
                event.changedTouches[0].pageY >
                position + screen.height / sens
              ) {
                callback(self);
              }
              position = screen.height;
            });
          },
          false
        );
        break;
    }
  },
};
