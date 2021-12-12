import {
  CELL_SIZE,
  CELL_COUNT,
  GRID_COLOR,
  COORDINATE_SIZE,
} from '../othelloConfig';

export default class Grid {
  public draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = 1;

    const CANVAS_SIZE = CELL_SIZE * CELL_COUNT;

    for (let i = 0; i < CANVAS_SIZE; i++) {
      // vertical lines
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE + COORDINATE_SIZE, 0 + COORDINATE_SIZE);
      ctx.lineTo(
        i * CELL_SIZE + COORDINATE_SIZE,
        CANVAS_SIZE + COORDINATE_SIZE,
      );

      // horizontal lines
      ctx.moveTo(0 + COORDINATE_SIZE, i * CELL_SIZE + COORDINATE_SIZE);
      ctx.lineTo(
        CANVAS_SIZE + COORDINATE_SIZE,
        i * CELL_SIZE + COORDINATE_SIZE,
      );

      ctx.stroke();
      ctx.closePath();
    }
  }
}
