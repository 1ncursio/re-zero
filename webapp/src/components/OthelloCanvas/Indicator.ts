import { CELL_COUNT, CELL_SIZE } from '../../lib/othelloConfig';

export default class Indicator {
  private color: string;
  private radius: number;
  private size: number;
  private index: number;

  constructor(index: number) {
    this.color = 'red';
    this.radius = 10;
    this.size = CELL_SIZE;
    this.index = index;
  }

  draw(context: CanvasRenderingContext2D) {
    const y =
      Math.floor(this.index / CELL_COUNT) * this.size +
      Math.floor(this.size / 2);
    const x = (this.index % CELL_COUNT) * this.size + Math.floor(this.size / 2);

    context.beginPath();
    context.arc(x, y, this.radius, 0, Math.PI * 2, false);
    context.strokeStyle = 'grey';
    context.lineWidth = 2;
    context.fillStyle = this.color;
    context.fill();
    context.stroke();
    context.closePath();
  }
}
