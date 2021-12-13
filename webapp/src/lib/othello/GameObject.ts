import Reversi from './Reversi';

export default abstract class GameObject {
  constructor(protected ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public abstract draw(): void;

  public abstract update(state: Reversi): void;
}
