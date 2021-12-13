import { CELL_COUNT, CELL_SIZE } from '../othelloConfig';

export default class Coordinate {
  public draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'white';
    // draw horizontal text
    ctx.font = '14px Arial';
    for (let i = 0; i < CELL_COUNT; i++) {
      ctx.fillText(
        String.fromCharCode(i + 65),
        i * CELL_SIZE + Math.floor(CELL_SIZE / 2) + 9,
        16,
      );
    }

    // draw vertical text
    for (let i = 0; i < CELL_COUNT; i++) {
      ctx.fillText(
        (i + 1).toString(),
        4,
        i * CELL_SIZE + Math.floor(CELL_SIZE / 2) + 22,
      );
    }
  }
}
