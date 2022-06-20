import useStore from '../../../store/useStore';
import {
  BACKGROUND_CANVAS_SIZE,
  CELL_COUNT,
  CELL_SIZE,
  COORDINATE_SIZE,
  GAME_CANVAS_SIZE,
} from '../othelloConfig';
import CanvasObject from './CanvasObject';
import Reversi from './Reversi';

export default class Background extends CanvasObject {
  public backgroundAColor: string;

  public backgroundBColor: string;

  public borderColor: string;

  public gridColor: string;

  public coordinateTextColor: string;

  constructor(ctx: CanvasRenderingContext2D, visible = true) {
    super(ctx, visible);

    this.backgroundAColor = '';
    this.backgroundBColor = '';
    this.borderColor = '';
    this.gridColor = '';
    this.coordinateTextColor = '';

    this.setTheme();
  }

  public draw() {
    this.drawBackground();
    this.drawCoordinate();
    this.drawGridLines();
    this.drawDots();
  }

  public roundRect(x: number, y: number, width: number, height: number, radius: number): void {
    if (width < 2 * radius) radius = width / 2;
    if (height < 2 * radius) radius = height / 2;

    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.arcTo(x + width, y, x + width, y + height, radius);
    this.ctx.arcTo(x + width, y + height, x, y + height, radius);
    this.ctx.arcTo(x, y + height, x, y, radius);
    this.ctx.arcTo(x, y, x + width, y, radius);
    this.ctx.closePath();
  }

  public drawBackground(): void {
    // border
    this.ctx.fillStyle = this.borderColor;
    this.roundRect(0, 0, BACKGROUND_CANVAS_SIZE, BACKGROUND_CANVAS_SIZE, 0);
    this.ctx.fill();

    // background A tile
    this.ctx.fillStyle = this.backgroundAColor;
    this.roundRect(COORDINATE_SIZE, COORDINATE_SIZE, GAME_CANVAS_SIZE, GAME_CANVAS_SIZE, 0);
    this.ctx.fill();

    // background B tile
    this.ctx.fillStyle = this.backgroundBColor;
    for (let i = 0; i < CELL_COUNT; i += 1) {
      for (let j = 0; j < CELL_COUNT; j += 1) {
        if ((i + j) % 2 === 0) {
          this.ctx.fillRect(
            COORDINATE_SIZE + i * CELL_SIZE,
            COORDINATE_SIZE + j * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE,
          );
        }
      }
    }
  }

  public drawCoordinate(): void {
    this.ctx.fillStyle = this.coordinateTextColor;
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

  public drawGridLines(): void {
    this.ctx.strokeStyle = this.gridColor;
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
  }

  public drawDots(): void {
    for (let i = 2; i < CELL_COUNT; i += CELL_COUNT - 4) {
      for (let j = 2; j < CELL_COUNT; j += CELL_COUNT - 4) {
        this.ctx.beginPath();
        this.ctx.arc(
          CELL_SIZE * i + COORDINATE_SIZE,
          CELL_SIZE * j + COORDINATE_SIZE,
          CELL_SIZE * (1 / 24),
          0,
          Math.PI * 2,
          false,
        );
        this.ctx.fillStyle = this.gridColor;
        this.ctx.fill();
        this.ctx.closePath();
      }
    }
  }

  public setTheme(): void {
    const { borderColor, backgroundAColor, backgroundBColor, gridColor, coordinateTextColor } =
      useStore.getState().config.theme.colors;

    this.backgroundAColor = backgroundAColor;
    this.backgroundBColor = backgroundBColor;
    this.borderColor = borderColor;
    this.gridColor = gridColor;
    this.coordinateTextColor = coordinateTextColor;
  }

  public update(state: Reversi): void {}
}
