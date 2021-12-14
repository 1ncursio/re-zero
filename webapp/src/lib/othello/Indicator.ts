import { CELL_COUNT, CELL_SIZE, INDICATOR_COLOR } from '../othelloConfig';
import GameObject from './GameObject';
import Reversi from './Reversi';

export default class Indicator extends GameObject {
  private _radius: number;

  private _index: number;

  private _state: 'active' | 'inactive';

  private _x: number;

  private _y: number;

  constructor(ctx: CanvasRenderingContext2D, index: number) {
    super(ctx);
    this._radius = Math.floor(CELL_SIZE * 0.5 * (1 / 2)); // 30
    this._index = index;
    this._state = 'inactive';
    this._x = ((this._index % CELL_COUNT) + 0.5) * CELL_SIZE;
    this._y = (Math.floor(this._index / CELL_COUNT) + 0.5) * CELL_SIZE;
  }

  public draw() {
    if (this._state === 'inactive') return;

    this.ctx.beginPath();
    this.ctx.arc(this._x, this._y, this._radius, 0, Math.PI * 2, false);
    this.ctx.lineWidth = 2;
    this.ctx.fillStyle = INDICATOR_COLOR;
    this.ctx.fill();
    this.ctx.closePath();
  }

  public update(reversi: Reversi) {
    const isFirstPlayer = reversi.isFirstPlayer();
    if (reversi.legalActions().includes(this._index) && isFirstPlayer) {
      this._state = 'active';
    } else {
      this._state = 'inactive';
    }
  }
}
