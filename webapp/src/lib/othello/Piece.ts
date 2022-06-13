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

  public pieceShadowColor: string;

  public blackPieceImage: HTMLImageElement;

  public whitePieceImage: HTMLImageElement;

  constructor(ctx: CanvasRenderingContext2D, index: number, visible: boolean = true) {
    super(ctx, visible);
    this._radius = 0;
    this._index = index;
    this._state = 'empty';
    this._x = ((this._index % CELL_COUNT) + 0.5) * CELL_SIZE;
    this._y = (Math.floor(this._index / CELL_COUNT) + 0.5) * CELL_SIZE;

    this.pieceShadowColor = '';
    this.blackPieceImage = new Image();
    this.whitePieceImage = new Image();

    this.setTheme();
  }

  public draw() {
    if (this._state === 'empty') return;

    this.drawPiece();
  }

  public drawPiece(): void {
    this.ctx.shadowBlur = 4;
    this.ctx.shadowColor = this.pieceShadowColor;
    this.ctx.shadowOffsetY = 4;

    this.ctx.drawImage(
      this._state === 'black' ? this.blackPieceImage : this.whitePieceImage,
      this._x - this._radius,
      this._y - this._radius,
      this._radius * 2,
      this._radius * 2,
    );

    this.ctx.shadowBlur = 0;
    this.ctx.shadowColor = 'transparent';
    this.ctx.shadowOffsetY = 0;
  }

  public setTheme(): void {
    const { blackPieceImageSrc, whitePieceImageSrc, pieceShadowColor } =
      useStore.getState().config.theme.colors;
    const { piece } = useStore.getState().config.theme.size;

    this.blackPieceImage.src = blackPieceImageSrc;
    this.whitePieceImage.src = whitePieceImageSrc;

    this.pieceShadowColor = pieceShadowColor;
    this._radius = Math.floor(CELL_SIZE * 0.5 * piece);
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
