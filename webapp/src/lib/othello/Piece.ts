import {
  BLACK_PIECE_COLOR,
  CELL_COUNT,
  CELL_SIZE,
  INNER_STROKE_COLOR,
  SHADOW_COLOR,
  STROKE_COLOR,
  WHITE_PIECE_COLOR,
} from '../othelloConfig';

export default class Piece {
  private radius: number;
  private color: string;
  private index: number;

  constructor(index: number) {
    this.radius = Math.floor(CELL_SIZE * 0.5);
    this.color = BLACK_PIECE_COLOR;
    this.index = index;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    const y =
      Math.floor(this.index / CELL_COUNT) * this.radius * 2 + this.radius;
    const x = (this.index % CELL_COUNT) * this.radius * 2 + this.radius;

    ctx.shadowBlur = 4;
    ctx.shadowColor = SHADOW_COLOR;
    ctx.shadowOffsetY = 4;

    ctx.beginPath();
    ctx.arc(x, y, this.radius - 10, 0, Math.PI * 2, false);
    ctx.strokeStyle = STROKE_COLOR;
    ctx.lineWidth = 1;
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(x, y, this.radius - 20, 0, Math.PI * 2, false);
    ctx.strokeStyle = INNER_STROKE_COLOR;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();

    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
    ctx.shadowOffsetY = 0;
  }

  public setIsblack(isBlack: boolean) {
    this.color = isBlack ? BLACK_PIECE_COLOR : WHITE_PIECE_COLOR;
    return this;
  }
}
