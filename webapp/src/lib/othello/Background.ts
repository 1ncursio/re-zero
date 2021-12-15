import {
  BACKGROUND_CANVAS_SIZE,
  BACKGROUND_COLOR,
  CELL_COUNT,
  CELL_SIZE,
  COORDINATE_COLOR,
  COORDINATE_SIZE,
  GAME_CANVAS_SIZE,
  GRID_COLOR,
} from '../othelloConfig';
import CanvasObject from './CanvasObject';
import Reversi from './Reversi';

export default class Background extends CanvasObject {
  constructor(ctx: CanvasRenderingContext2D) {
    super(ctx);
  }

  public draw() {
    // background
    this.ctx.fillStyle = COORDINATE_COLOR;
    this.ctx.fillRect(0, 0, BACKGROUND_CANVAS_SIZE, BACKGROUND_CANVAS_SIZE);
    this.ctx.fillStyle = BACKGROUND_COLOR;
    this.ctx.fillRect(COORDINATE_SIZE, COORDINATE_SIZE, GAME_CANVAS_SIZE, GAME_CANVAS_SIZE);

    this.ctx.strokeStyle = GRID_COLOR;
    this.ctx.lineWidth = 1;

    for (let i = 0; i < BACKGROUND_CANVAS_SIZE; i += 1) {
      // vertical lines
      this.ctx.beginPath();
      this.ctx.moveTo(i * CELL_SIZE + COORDINATE_SIZE + 0.5, COORDINATE_SIZE);
      this.ctx.lineTo(i * CELL_SIZE + COORDINATE_SIZE + 0.5, BACKGROUND_CANVAS_SIZE - COORDINATE_SIZE);

      // horizontal lines
      this.ctx.moveTo(COORDINATE_SIZE, i * CELL_SIZE + COORDINATE_SIZE + 0.5);
      this.ctx.lineTo(BACKGROUND_CANVAS_SIZE - COORDINATE_SIZE, i * CELL_SIZE + COORDINATE_SIZE + 0.5);

      this.ctx.stroke();
      this.ctx.closePath();
    }

    // coordinate
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

  public update(state: Reversi): void {}
}
