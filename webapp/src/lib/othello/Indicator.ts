import { CELL_COUNT, CELL_SIZE, INDICATOR_COLOR } from '../othelloConfig';
import GameObject from './GameObject';
import Reversi from './Reversi';

export default class Indicator extends GameObject {
  private radius: number;
  private index: number;
  private state: 'active' | 'inactive' = 'inactive';

  constructor(ctx: CanvasRenderingContext2D, index: number) {
    super(ctx);
    this.radius = Math.floor(CELL_SIZE * 0.5) - 20;
    this.index = index;
  }

  public draw() {
    if (this.state === 'inactive') return;

    const y =
      Math.floor(this.index / CELL_COUNT) * CELL_SIZE +
      Math.floor(CELL_SIZE / 2);
    const x = (this.index % CELL_COUNT) * CELL_SIZE + Math.floor(CELL_SIZE / 2);

    this.ctx.beginPath();
    this.ctx.arc(x, y, this.radius, 0, Math.PI * 2, false);
    this.ctx.lineWidth = 2;
    this.ctx.fillStyle = INDICATOR_COLOR;
    this.ctx.fill();
    this.ctx.closePath();
  }

  public update(reversi: Reversi) {
    const isFirstPlayer = reversi.isFirstPlayer();
    if (reversi.legalActions().includes(this.index) && isFirstPlayer) {
      this.state = 'active';
    } else {
      this.state = 'inactive';
    }
  }
}
