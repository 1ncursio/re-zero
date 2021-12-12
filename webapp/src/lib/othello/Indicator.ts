import {
  CELL_COUNT,
  CELL_SIZE,
  COORDINATE_SIZE,
  INDICATOR_COLOR,
} from '../othelloConfig';

export default class Indicator {
  private radius: number;
  private size: number;
  private index: number;

  constructor(index: number) {
    this.radius = Math.floor(CELL_SIZE * 0.5) - 20;
    this.size = CELL_SIZE;
    this.index = index;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    const y =
      Math.floor(this.index / CELL_COUNT) * this.size +
      Math.floor(this.size / 2);
    const x = (this.index % CELL_COUNT) * this.size + Math.floor(this.size / 2);

    ctx.beginPath();
    ctx.arc(
      x + COORDINATE_SIZE,
      y + COORDINATE_SIZE,
      this.radius,
      0,
      Math.PI * 2,
      false,
    );
    ctx.lineWidth = 2;
    ctx.fillStyle = INDICATOR_COLOR;
    ctx.fill();
    ctx.closePath();
  }
}
