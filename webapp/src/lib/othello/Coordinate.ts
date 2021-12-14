import { CELL_COUNT, CELL_SIZE, COORDINATE_SIZE } from '../othelloConfig';
import BackgroundObject from './BackgroundObject';

export default class Coordinate extends BackgroundObject {
  constructor(ctx: CanvasRenderingContext2D) {
    super(ctx);
  }

  public draw() {
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.font = '12px sans-serif';

    for (let i = 0; i < CELL_COUNT; i += 1) {
      // horizontal text e.g. 'A B C D E F ...'
      this.ctx.fillText(
        String.fromCharCode(i + 65),
        COORDINATE_SIZE + (i + 0.5) * CELL_SIZE,
        COORDINATE_SIZE * 0.5,
      );

      // vertical text e.g. '1 2 3 4 5 6 ...'
      this.ctx.fillText((i + 1).toString(), COORDINATE_SIZE * 0.5, COORDINATE_SIZE + (i + 0.5) * CELL_SIZE);
    }
  }
}
