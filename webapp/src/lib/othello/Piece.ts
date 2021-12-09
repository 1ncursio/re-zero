import {
  BLACK_PIECE_COLOR,
  CELL_COUNT,
  CELL_SIZE,
  STROKE_COLOR,
  WHITE_PIECE_COLOR,
} from '../othelloConfig';

export default class Piece {
  private radius: number;
  private isBlack: boolean;
  private color: string;
  private index: number;

  constructor(index: number) {
    this.radius = Math.floor(CELL_SIZE * 0.5);
    this.isBlack = true;
    this.color = true ? BLACK_PIECE_COLOR : WHITE_PIECE_COLOR;
    this.index = index;
  }

  draw(context: CanvasRenderingContext2D) {
    const y =
      Math.floor(this.index / CELL_COUNT) * this.radius * 2 + this.radius;
    const x = (this.index % CELL_COUNT) * this.radius * 2 + this.radius;

    context.beginPath();
    context.arc(x, y, this.radius - 10, 0, Math.PI * 2, false);
    context.strokeStyle = STROKE_COLOR;
    context.lineWidth = 1;
    context.fillStyle = this.color;
    context.fill();
    context.stroke();
    context.closePath();
  }

  setIsblack(isBlack: boolean) {
    this.isBlack = isBlack;
    this.color = isBlack ? BLACK_PIECE_COLOR : WHITE_PIECE_COLOR;
    return this;
  }
}
