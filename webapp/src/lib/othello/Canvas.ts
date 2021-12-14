import GameObject from './GameObject';

export default class Canvas {
  private canvas;

  public context;

  public gameObjects: GameObject[];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.gameObjects = [];

    const rect = canvas.getBoundingClientRect();

    const ratio = window.devicePixelRatio || 1;

    const width = Math.round(ratio * rect.right) - Math.round(ratio * rect.left);
    const height = Math.round(ratio * rect.bottom) - Math.round(ratio * rect.top);

    this.canvas.width = width;
    this.canvas.height = height;
    this.context.scale(ratio, ratio);
  }

  clear(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  draw(): void {}
}
