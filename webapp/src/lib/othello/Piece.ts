import {
  BLACK_PIECE_COLOR,
  CELL_COUNT,
  CELL_SIZE,
  INNER_BLACK_COLOR,
  INNER_WHITE_COLOR,
  SHADOW_COLOR,
  WHITE_PIECE_COLOR,
} from '../othelloConfig';
import CanvasObject from './CanvasObject';
import Reversi from './Reversi';

export default class Piece extends CanvasObject {
  private _radius: number;

  private _index: number;

  private _x: number;

  private _y: number;

  private _state: 'empty' | 'black' | 'white';

  constructor(ctx: CanvasRenderingContext2D, index: number, visible: boolean = true) {
    super(ctx, visible);
    this._index = index;
    this._radius = Math.floor(CELL_SIZE * 0.5 * (3 / 4)); // 30
    this._state = 'empty';
    this._x = ((this._index % CELL_COUNT) + 0.5) * CELL_SIZE;
    this._y = (Math.floor(this._index / CELL_COUNT) + 0.5) * CELL_SIZE;
  }

  public draw() {
    if (this._state === 'empty') return;

    this.ctx.shadowBlur = 4;
    this.ctx.shadowColor = SHADOW_COLOR;
    this.ctx.shadowOffsetY = 4;

    // draw piece
    this.ctx.beginPath();
    this.ctx.arc(this._x, this._y, this._radius, 0, Math.PI * 2, false);
    this.ctx.fillStyle = this._state === 'black' ? BLACK_PIECE_COLOR : WHITE_PIECE_COLOR;
    this.ctx.fill();
    this.ctx.closePath();

    this.ctx.shadowBlur = 0;
    this.ctx.shadowColor = 'transparent';
    this.ctx.shadowOffsetY = 0;

    // draw a inner stroke
    // this.ctx.strokeStyle = INNER_STROKE_COLOR;
    this.ctx.fillStyle = this._state === 'black' ? INNER_BLACK_COLOR : INNER_WHITE_COLOR;
    this.ctx.beginPath();
    this.ctx.arc(this._x, this._y, Math.floor(this._radius * (5 / 6)), 0, Math.PI * 2, false);
    this.ctx.fill();
    this.ctx.closePath();
  }

  public update(reversi: Reversi) {
    const isFirstPlayer = reversi.isFirstPlayer();

    if (reversi.pieces[this._index] === 1) {
      this._state = isFirstPlayer ? 'black' : 'white';
      this.visible = true;
    } else if (reversi.enemyPieces[this._index] === 1) {
      this._state = isFirstPlayer ? 'white' : 'black';
      this.visible = true;
    } else {
      this._state = 'empty';
      this.visible = false;
    }
  }
}
