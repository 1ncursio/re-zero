import {
  BACKGROUND_CANVAS_SIZE,
  CELL_SIZE,
  COORDINATE_SIZE,
  GRID_COLOR,
} from '../othelloConfig';

export default class Grid {
  public draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = 1;

    for (let i = 0; i < BACKGROUND_CANVAS_SIZE; i++) {
      // vertical lines
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE + COORDINATE_SIZE + 0.5, COORDINATE_SIZE);
      ctx.lineTo(
        i * CELL_SIZE + COORDINATE_SIZE + 0.5,
        BACKGROUND_CANVAS_SIZE + COORDINATE_SIZE,
      );

      // horizontal lines
      ctx.moveTo(COORDINATE_SIZE, i * CELL_SIZE + COORDINATE_SIZE + 0.5);
      ctx.lineTo(
        BACKGROUND_CANVAS_SIZE + COORDINATE_SIZE,
        i * CELL_SIZE + COORDINATE_SIZE + 0.5,
      );

      ctx.stroke();
      ctx.closePath();
    }
  }
}
