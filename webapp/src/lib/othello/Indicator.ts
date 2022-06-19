import useStore from '../../store/useStore';
import { CELL_COUNT, CELL_SIZE } from '../othelloConfig';
import CanvasObject from './CanvasObject';
import Reversi from './Reversi';

export default class Indicator extends CanvasObject {
  private _radius: number;

  private _index: number;

  private _state: 'active' | 'inactive' | 'hover';

  private _x: number;

  private _y: number;

  public indicatorColor: string;

  public indicatorHoverColor: string;

  constructor(ctx: CanvasRenderingContext2D, index: number, visible: boolean = true) {
    super(ctx, visible);
    this._radius = Math.floor(CELL_SIZE * 0.5 * (2 / 5)); // 30
    this._index = index;
    this._state = 'inactive';
    this._x = ((this._index % CELL_COUNT) + 0.5) * CELL_SIZE;
    this._y = (Math.floor(this._index / CELL_COUNT) + 0.5) * CELL_SIZE;

    this.indicatorColor = '';
    this.indicatorHoverColor = '';
    this.setTheme();
  }

  public draw() {
    if (this._state === 'inactive') return;

    this.ctx.strokeStyle = this._state === 'hover' ? this.indicatorHoverColor : this.indicatorColor;
    this.ctx.lineWidth = this._radius * 0.5;
    this.ctx.beginPath();
    this.ctx.arc(this._x, this._y, this._radius, 0, Math.PI * 2, false);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  public setTheme(): void {
    const { indicatorColor, indicatorHoverColor } = useStore.getState().config.theme.colors;
    this.indicatorColor = indicatorColor;
    this.indicatorHoverColor = indicatorHoverColor;
  }

  public update(reversi: Reversi, mouseX: number, mouseY: number): void {
    const isBlackTurn = reversi.isBlackTurn();

    if (reversi.legalActions().includes(this._index) && isBlackTurn) {
      this._state = 'active';
      this.visible = true;
    } else {
      this._state = 'inactive';
      this.visible = false;
    }

    const index = Math.floor(mouseX / CELL_SIZE) + Math.floor(mouseY / CELL_SIZE) * CELL_COUNT;

    if (this._index === index && this._state === 'active') {
      this._state = 'hover';
      this.visible = true;
    }
  }
}
