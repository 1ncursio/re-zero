import useStore from '../../../store/useStore';
import { CELL_COUNT, CELL_SIZE, FRAME_SIZE } from '../othelloConfig';
import CanvasObject from './CanvasObject';
import Reversi from './Reversi';

export default class Piece extends CanvasObject {
  private _radius: number;

  private _index: number;

  private _x: number;

  private _y: number;

  private _state: 'empty' | 'black' | 'white';

  private _isFlipped: boolean;

  private _currentFrame: number;

  public pieceShadowColor: string;

  public blackPieceImage: HTMLImageElement;

  public whitePieceImage: HTMLImageElement;

  constructor(ctx: CanvasRenderingContext2D, index: number, visible: boolean = true) {
    super(ctx, visible);
    this._radius = 0;
    this._index = index;
    this._state = 'empty';
    this._isFlipped = false;
    this._currentFrame = 0;
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

    const column = this._currentFrame % 4;
    const row = Math.floor(this._currentFrame / 4);

    this.ctx.drawImage(
      this._state === 'black' ? this.blackPieceImage : this.whitePieceImage,
      column * FRAME_SIZE,
      row * FRAME_SIZE,
      FRAME_SIZE,
      FRAME_SIZE,
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

    // this.blackPieceImage.src = blackPieceImageSrc;
    // this.whitePieceImage.src = whitePieceImageSrc;
    fetch('/assets/images/theme/default/black_piece.png')
      .then((res) => res.blob())
      .then((blob) => {
        this.blackPieceImage.src = URL.createObjectURL(blob);
      })
      .catch((err) => console.error(err));
    fetch('/assets/images/theme/default/white_piece.png')
      .then((res) => res.blob())
      .then((blob) => {
        this.whitePieceImage.src = URL.createObjectURL(blob);
      })
      .catch((err) => console.error(err));

    this.pieceShadowColor = pieceShadowColor;
    this._radius = Math.floor(CELL_SIZE * 0.5 * piece);
  }

  public update(reversi: Reversi) {
    const isBlackTurn = reversi.isBlackTurn();

    // 내 돌인 경우
    if (reversi.pieces[this._index]) {
      // 내 돌인데 상대 돌로 넘어가고 있는 경우
      if (this._isFlipped) {
        this._currentFrame = (this._currentFrame + 1) % 16;
      }
      // 내 돌이고 가만히 있는 경우
      else {
        this._state = isBlackTurn ? 'black' : 'white';
        this.visible = true;
      }
    }
    // 상대 돌인 경우
    else if (reversi.enemyPieces[this._index]) {
      // 상대 돌인데 내 돌로 넘어가고 있는 경우
      if (this._isFlipped) {
        this._currentFrame = (this._currentFrame + 1) % 16;
      }
      // 상대 돌이고 가만히 있는 경우
      else {
        this._state = isBlackTurn ? 'white' : 'black';
        this.visible = true;
      }
    } else {
      this._state = 'empty';
      this.visible = false;
    }
  }
}
