import useStore from '../../store/useStore';
import { CELL_COUNT, CELL_SIZE } from '../othelloConfig';
import CanvasObject from './CanvasObject';
import Reversi from './Reversi';

export default class Piece extends CanvasObject {
  private _radius: number;

  private _index: number;

  private _x: number;

  private _y: number;

  private _state: 'empty' | 'black' | 'white';

  public blackPieceInnerColor: string;

  public blackPieceOuterColor: string;

  public whitePieceInnerColor: string;

  public whitePieceOuterColor: string;

  public pieceShadowColor: string;

  constructor(ctx: CanvasRenderingContext2D, index: number, visible: boolean = true) {
    super(ctx, visible);
    this._index = index;
    this._radius = Math.floor(CELL_SIZE * 0.5 * (3 / 4)); // 30
    this._state = 'empty';
    this._x = ((this._index % CELL_COUNT) + 0.5) * CELL_SIZE;
    this._y = (Math.floor(this._index / CELL_COUNT) + 0.5) * CELL_SIZE;

    this.blackPieceInnerColor = '';
    this.blackPieceOuterColor = '';
    this.whitePieceInnerColor = '';
    this.whitePieceOuterColor = '';
    this.pieceShadowColor = '';
    this.setTheme();
  }

  public draw() {
    if (this._state === 'empty') return;

    this.ctx.shadowBlur = 4;
    this.ctx.shadowColor = this.pieceShadowColor;
    this.ctx.shadowOffsetY = 4;

    // draw piece
    this.ctx.beginPath();
    this.ctx.arc(this._x, this._y, this._radius, 0, Math.PI * 2, false);
    this.ctx.fillStyle = this._state === 'black' ? this.blackPieceOuterColor : this.whitePieceOuterColor;
    this.ctx.fill();
    this.ctx.closePath();

    this.ctx.shadowBlur = 0;
    this.ctx.shadowColor = 'transparent';
    this.ctx.shadowOffsetY = 0;

    // draw a inner stroke
    // this.ctx.strokeStyle = INNER_STROKE_COLOR;
    this.ctx.fillStyle = this._state === 'black' ? this.blackPieceInnerColor : this.whitePieceInnerColor;
    this.ctx.beginPath();
    this.ctx.arc(this._x, this._y, Math.floor(this._radius * (5 / 6)), 0, Math.PI * 2, false);
    this.ctx.fill();
    this.ctx.closePath();
  }

  public setTheme(): void {
    const {
      blackPieceInnerColor,
      blackPieceOuterColor,
      whitePieceInnerColor,
      whitePieceOuterColor,
      pieceShadowColor,
    } = useStore.getState().config.theme.colors;
    this.blackPieceInnerColor = blackPieceInnerColor;
    this.blackPieceOuterColor = blackPieceOuterColor;
    this.whitePieceInnerColor = whitePieceInnerColor;
    this.whitePieceOuterColor = whitePieceOuterColor;
    this.pieceShadowColor = pieceShadowColor;
  }

  public update(reversi: Reversi) {
    const isFirstPlayer = reversi.isFirstPlayer();

    if (reversi.pieces[this._index] === 1) {
      this._state = isFirstPlayer ? 'black' : 'white';
      this.visible = true;
    } else if (reversi.enemyPieces[this._index] === 1) {
      this._state = isFirstPlayer ? 'white' : 'black';
      this.visible = true;
    } else {
      this._state = 'empty';
      this.visible = false;
    }
  }
}
