export default abstract class BackgroundObject {
  constructor(protected ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  abstract draw(): void;
}
