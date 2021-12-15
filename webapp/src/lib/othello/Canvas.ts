import CanvasObject from './CanvasObject';
import Reversi from './Reversi';

export default class Canvas {
  public canvas;

  public context;

  public canvasObjects: CanvasObject[];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.canvasObjects = [];

    const rect = canvas.getBoundingClientRect();

    const ratio = window.devicePixelRatio || 1;

    this.canvas.width = Math.round(ratio * rect.right) - Math.round(ratio * rect.left);
    this.canvas.height = Math.round(ratio * rect.bottom) - Math.round(ratio * rect.top);
    this.context.scale(ratio, ratio);
  }

  clear(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  draw(): void {
    this.clear();
    this.canvasObjects.forEach((obj) => obj.draw());
  }

  update(reversi: Reversi): void {
    this.canvasObjects.forEach((obj) => obj.update(reversi));
  }

  addCanvasObjects(objs: CanvasObject[]): void {
    this.canvasObjects.push(...objs);
  }
}
