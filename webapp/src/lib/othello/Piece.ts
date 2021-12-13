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

enum State {
  BLACK = 'black',
  WHITE = 'white',
  EMPTY = 'empty',
  FLIPED = 'fliped',
}

export default class Piece extends GameObject {
  private _radius: number;
  private _color: string;
  private _index: number;
  private _x: number;
  private _y: number;
  private _vx: number;
  private _state: State;

  constructor(ctx: CanvasRenderingContext2D, index: number) {
    super(ctx);
    this._radius = Math.floor(CELL_SIZE * 0.5);
    this._state = State.EMPTY;
    this._color = BLACK_PIECE_COLOR;
    this._index = index;
    this._x = (this._index % CELL_COUNT) * this._radius * 2 + this._radius;
    this._y =
      Math.floor(this._index / CELL_COUNT) * this._radius * 2 + this._radius;
    this._vx = 0;
  }

  public draw() {
    if (this._state === State.EMPTY) return;

    this.ctx.shadowBlur = 4;
    this.ctx.shadowColor = SHADOW_COLOR;
    this.ctx.shadowOffsetY = 4;

    this.ctx.beginPath();
    this.ctx.ellipse(
      this._x,
      this._y,
      Math.max(this._radius - 10 - this._vx, 0),
      this._radius - 10,
      0,
      0,
      Math.PI * 2,
      false,
    );
    // this.ctx.arc(
    //   this._x,
    //   this._y,
    //   this._radius - 10 - this._vx,
    //   0,
    //   Math.PI * 2,
    //   false,
    // );
    this.ctx.strokeStyle = STROKE_COLOR;
    this.ctx.lineWidth = 1;
    this.ctx.fillStyle = this._color;
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.closePath();

    this.ctx.beginPath();
    // this.ctx.arc(this._x, this._y, this._radius - 20, 0, Math.PI * 2, false);
    // draw a circle
    this.ctx.ellipse(
      this._x,
      this._y,
      Math.max(this._radius - 20 - this._vx, 0),
      this._radius - 20,
      0,
      0,
      Math.PI * 2,
      false,
    );

    this.ctx.strokeStyle = INNER_STROKE_COLOR;
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
    this.ctx.closePath();

    this.ctx.shadowBlur = 0;
    this.ctx.shadowColor = 'transparent';
    this.ctx.shadowOffsetY = 0;
  }

  public update(reversi: Reversi) {
    if (this._state === State.FLIPED) {
      if (this._vx >= this._radius) {
        this._vx = 0;
      }
      this._vx += 2;
    } else {
      this._vx = 0;
    }

    const isFirstPlayer = reversi.isFirstPlayer();

    if (reversi.pieces[this._index] === 1) {
      this._state = isFirstPlayer ? State.BLACK : State.WHITE;
      this._color = isFirstPlayer ? BLACK_PIECE_COLOR : WHITE_PIECE_COLOR;
    } else if (reversi.enemyPieces[this._index] === 1) {
      this._state = isFirstPlayer ? State.WHITE : State.BLACK;
      this._color = isFirstPlayer ? WHITE_PIECE_COLOR : BLACK_PIECE_COLOR;
    } else {
      this._state = State.EMPTY;
    }

    const state = this._state;
    const color = this._color;

    if (reversi.flipedPieces.includes(this._index)) {
      this._state = State.FLIPED;
      this._color = isFirstPlayer ? BLACK_PIECE_COLOR : WHITE_PIECE_COLOR;

      setTimeout(() => {
        this._state = state;
        // this._color = color;
        reversi.flipedPieces = reversi.flipedPieces.filter(
          (piece) => piece !== this._index,
        );
      }, 300);
    }
  }
}
