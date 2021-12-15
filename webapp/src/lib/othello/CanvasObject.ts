import Reversi from './Reversi';

export default abstract class CanvasObject {
  constructor(protected ctx: CanvasRenderingContext2D) {}

  public abstract draw(): void;

  public abstract update(state: Reversi): void;
}
