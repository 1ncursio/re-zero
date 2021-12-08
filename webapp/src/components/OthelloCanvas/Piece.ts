import {
  CELL_SIZE,
  BLACK_DISC_COLOR,
  WHITE_DISC_COLOR,
  CELL_COUNT,
} from '../../lib/othelloConfig';

export default class Piece {
  private radius: number;
  private isBlack: boolean;
  private color: string;
  private index: number;

  constructor(index: number) {
    this.radius = CELL_SIZE * 0.5;
    this.isBlack = true;
    this.color = true ? BLACK_DISC_COLOR : WHITE_DISC_COLOR;
    this.index = index;
  }

  draw(context: CanvasRenderingContext2D) {
    const y =
      Math.floor(this.index / CELL_COUNT) * this.radius * 2 + this.radius;
    const x = (this.index % CELL_COUNT) * this.radius * 2 + this.radius;

    context.beginPath();
    context.arc(x, y, this.radius, 0, Math.PI * 2, false);
    context.strokeStyle = 'grey';
    context.lineWidth = 2;
    context.fillStyle = this.color;
    context.fill();
    context.stroke();
    context.closePath();
  }

  setIsblack(isBlack: boolean) {
    this.isBlack = isBlack;
    this.color = isBlack ? BLACK_DISC_COLOR : WHITE_DISC_COLOR;
    return this;
  }
}
