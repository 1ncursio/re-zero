import { BACKGROUND_CANVAS_SIZE, CELL_SIZE, COORDINATE_SIZE, GRID_COLOR } from '../othelloConfig';
import BackgroundObject from './BackgroundObject';

export default class Grid extends BackgroundObject {
  constructor(ctx: CanvasRenderingContext2D) {
    super(ctx);
  }

  public draw() {
    this.ctx.strokeStyle = GRID_COLOR;
    this.ctx.lineWidth = 1;

    for (let i = 0; i < BACKGROUND_CANVAS_SIZE; i += 1) {
      // vertical lines
      this.ctx.beginPath();
      this.ctx.moveTo(i * CELL_SIZE + COORDINATE_SIZE + 0.5, COORDINATE_SIZE);
      this.ctx.lineTo(i * CELL_SIZE + COORDINATE_SIZE + 0.5, BACKGROUND_CANVAS_SIZE + COORDINATE_SIZE);

      // horizontal lines
      this.ctx.moveTo(COORDINATE_SIZE, i * CELL_SIZE + COORDINATE_SIZE + 0.5);
      this.ctx.lineTo(BACKGROUND_CANVAS_SIZE + COORDINATE_SIZE, i * CELL_SIZE + COORDINATE_SIZE + 0.5);

      this.ctx.stroke();
      this.ctx.closePath();
    }
  }
}
