import Reversi from './Reversi';

export default abstract class CanvasObject {
  constructor(protected ctx: CanvasRenderingContext2D, public visible: boolean) {}

  public abstract draw(): void;

  public abstract update(state: Reversi, mouseX: number, mouseY: number): void;
}
