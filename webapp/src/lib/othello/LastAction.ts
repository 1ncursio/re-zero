import { CELL_COUNT, CELL_SIZE, LAST_ACTION_COLOR } from '../othelloConfig';

export default class LastAction {
  private _width: number;
  private _index: number;
  constructor() {
    this._width = Math.floor(CELL_SIZE * 0.1);
    this._index = -1;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    const y =
      Math.floor(this._index / CELL_COUNT) * CELL_SIZE +
      Math.floor(CELL_SIZE / 2) -
      this._width / 2;
    const x =
      (this._index % CELL_COUNT) * CELL_SIZE +
      Math.floor(CELL_SIZE / 2) -
      this._width / 2;

    ctx.beginPath();
    ctx.fillStyle = LAST_ACTION_COLOR;
    ctx.fillRect(x, y, this._width, this._width);
    ctx.closePath();
  }

  public setIndex(index: number) {
    this._index = index;
  }
}
