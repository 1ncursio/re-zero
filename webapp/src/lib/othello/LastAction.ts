import { CELL_COUNT, CELL_SIZE, LAST_ACTION_COLOR } from '../othelloConfig';
import GameObject from './GameObject';
import Reversi from './Reversi';

export default class LastAction extends GameObject {
  private _width: number;
  private _index: number;
  constructor(ctx: CanvasRenderingContext2D) {
    super(ctx);
    this._width = Math.floor(CELL_SIZE * 0.1);
    this._index = -1;
  }

  public draw() {
    const y =
      Math.floor(this._index / CELL_COUNT) * CELL_SIZE +
      Math.floor(CELL_SIZE / 2) -
      this._width / 2;
    const x =
      (this._index % CELL_COUNT) * CELL_SIZE +
      Math.floor(CELL_SIZE / 2) -
      this._width / 2;

    this.ctx.beginPath();
    this.ctx.fillStyle = LAST_ACTION_COLOR;
    this.ctx.fillRect(x, y, this._width, this._width);
    this.ctx.closePath();
  }

  public setIndex(index: number) {
    this._index = index;
  }

  public update(reversi: Reversi) {
    this._index = reversi.lastAction;
  }
}
