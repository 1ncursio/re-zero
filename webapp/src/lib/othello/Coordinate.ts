import { CELL_COUNT, CELL_SIZE, GRID_COLOR } from '../othelloConfig';

export default class Coordinate {
  private color: string;
  //   private y;
  constructor() {
    this.color = GRID_COLOR;
  }
  //   getX(): number;
  //   getY(): number;
  //   toString(): string;

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'white';
    // draw text a to f
    ctx.font = '16px Arial';
    for (let i = 0; i < CELL_COUNT; i++) {
      ctx.fillText(
        String.fromCharCode(i + 65),
        i * CELL_SIZE + Math.floor(CELL_SIZE / 2) + 9,
        16,
      );
    }

    for (let i = 0; i < CELL_COUNT; i++) {
      ctx.fillText(
        (i + 1).toString(),
        4,
        i * CELL_SIZE + Math.floor(CELL_SIZE / 2) + 22,
      );
    }

    // draw text 1 to 8
    // ctx.font = "20px Arial";
    // ctx.fillText(this.toString(), this.getX() * 40 + 20, this.getY() * 40 + 20);
  }
}
