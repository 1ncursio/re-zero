import { CELL_COUNT, CELL_SIZE } from '../othelloConfig';
import BackgroundObject from './BackgroundObject';

export default class Coordinate extends BackgroundObject {
  constructor(ctx: CanvasRenderingContext2D) {
    super(ctx);
  }

  public draw() {
    this.ctx.fillStyle = 'white';
    // draw horizontal text
    this.ctx.font = '14px Arial';
    for (let i = 0; i < CELL_COUNT; i++) {
      this.ctx.fillText(
        String.fromCharCode(i + 65),
        i * CELL_SIZE + Math.floor(CELL_SIZE / 2) + 9,
        14,
      );
    }

    // draw vertical text
    for (let i = 0; i < CELL_COUNT; i++) {
      this.ctx.fillText(
        (i + 1).toString(),
        5,
        i * CELL_SIZE + Math.floor(CELL_SIZE / 2) + 22,
      );
    }
  }
}
