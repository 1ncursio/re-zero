import {
  BLACK_PIECE_COLOR,
  CELL_COUNT,
  CELL_SIZE,
  INNER_STROKE_COLOR,
  SHADOW_COLOR,
  STROKE_COLOR,
  WHITE_PIECE_COLOR,
} from '../othelloConfig';
import GameObject from './GameObject';
import Reversi from './Reversi';

export default class Piece extends GameObject {
  private _radius: number;
  private _color: string;
  private _index: number;
  private _x: number;
  private _y: number;
  private _state: 'empty' | 'black' | 'white';

  constructor(ctx: CanvasRenderingContext2D, index: number) {
    super(ctx);
    this._index = index;
    this._radius = Math.floor(CELL_SIZE * 0.5 * (3 / 4)); // 30
    this._state = 'empty';
    this._color = BLACK_PIECE_COLOR;
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
    this.ctx.strokeStyle = STROKE_COLOR;
    this.ctx.lineWidth = 1;
    this.ctx.fillStyle = this._color;
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.closePath();

    // draw a inner stroke
    this.ctx.strokeStyle = INNER_STROKE_COLOR;
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.arc(
      this._x,
      this._y,
      this._radius * (3 / 4),
      0,
      Math.PI * 2,
      false,
    );

    this.ctx.stroke();
    this.ctx.closePath();

    this.ctx.shadowBlur = 0;
    this.ctx.shadowColor = 'transparent';
    this.ctx.shadowOffsetY = 0;
  }

  public update(reversi: Reversi) {
    const isFirstPlayer = reversi.isFirstPlayer();

    if (reversi.pieces[this._index] === 1) {
      this._state = isFirstPlayer ? 'black' : 'white';
      this._color = isFirstPlayer ? BLACK_PIECE_COLOR : WHITE_PIECE_COLOR;
    } else if (reversi.enemyPieces[this._index] === 1) {
      this._state = isFirstPlayer ? 'white' : 'black';
      this._color = isFirstPlayer ? WHITE_PIECE_COLOR : BLACK_PIECE_COLOR;
    } else {
      this._state = 'empty';
    }
  }
}
