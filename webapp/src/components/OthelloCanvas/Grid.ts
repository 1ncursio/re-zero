import { CELL_SIZE, CELL_COUNT, GRID_COLOR } from '../../lib/othelloConfig';

export default class Grid {
  public size: number;
  public count: number;
  public color: string;

  constructor() {
    this.size = CELL_SIZE;
    this.count = CELL_COUNT;
    this.color = GRID_COLOR;
  }

  draw(context: CanvasRenderingContext2D) {
    context.strokeStyle = this.color;
    context.lineWidth = 1;

    const CANVAS_SIZE = this.size * this.count;

    for (let i = 1; i < CANVAS_SIZE; i++) {
      // vertical lines
      context.beginPath();
      context.moveTo(i * this.size, 0);
      context.lineTo(i * this.size, CANVAS_SIZE);

      // horizontal lines
      context.moveTo(0, i * this.size);
      context.lineTo(CANVAS_SIZE, i * this.size);

      context.stroke();
      context.closePath();
    }
  }
}
