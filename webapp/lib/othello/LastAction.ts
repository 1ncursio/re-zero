import useStore from '@store/useStore';
import { CELL_COUNT, CELL_SIZE } from '../othelloConfig';
import CanvasObject from './CanvasObject';
import Reversi from './Reversi';

export default class LastAction extends CanvasObject {
  private _width: number;

  private _index: number;

  private _x: number;

  private _y: number;

  public lastActionColor: string;

  constructor(ctx: CanvasRenderingContext2D, visible = true) {
    super(ctx, visible);
    this._width = Math.floor(CELL_SIZE * 0.1);
    this._index = -1;
    this._x = -10;
    this._y = -10;

    this.lastActionColor = '';
    this.setTheme();
  }

  public draw() {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.lastActionColor;
    this.ctx.fillRect(this._x, this._y, this._width, this._width);
    this.ctx.closePath();
  }

  public setTheme(): void {
    const { lastActionColor } = useStore.getState().config.theme.colors;
    this.lastActionColor = lastActionColor;
  }

  public update(reversi: Reversi) {
    this._index = reversi.lastAction;
    this._x = ((this._index % CELL_COUNT) + 0.5) * CELL_SIZE - this._width * 0.5;
    this._y = (Math.floor(this._index / CELL_COUNT) + 0.5) * CELL_SIZE - this._width * 0.5;
  }
}
