import { CELL_COUNT, TOTAL_CELL_COUNT } from '../othelloConfig';

export default class Reversi {
  private _dxy: number[][];

  private _passEnd: boolean;

  private _lastAction: number;

  public depth: number;

  public pieces: number[];

  public enemyPieces: number[];

  public histories: string[];

  constructor(
    pieces?: number[],
    enemyPieces?: number[],
    depth = 0,
    histories: string[] = [],
    lastAction = -1,
  ) {
    // 방향 정수
    this._dxy = [
      [1, 0],
      [1, 1],
      [0, 1],
      [-1, 1],
      [-1, 0],
      [-1, -1],
      [0, -1],
      [1, -1],
    ];

    // 연속 패스에 따른 종료
    this._passEnd = false;
    this.depth = depth;
    this.histories = histories;
    this._lastAction = lastAction;

    // 돌의 초기 배치
    if (pieces && enemyPieces) {
      this.pieces = pieces;
      this.enemyPieces = enemyPieces;
    } else {
      this.pieces = new Array(TOTAL_CELL_COUNT).fill(0);
      this.enemyPieces = new Array(TOTAL_CELL_COUNT).fill(0);
      this._initPieces();
    }
  }

  // 초기 돌 설정
  private _initPieces() {
    this.pieces[CELL_COUNT * 0.5 - 1 + (CELL_COUNT * 0.5 - 1) * CELL_COUNT] = 1;
    this.pieces[CELL_COUNT * 0.5 + CELL_COUNT * 0.5 * CELL_COUNT] = 1;
    this.enemyPieces[CELL_COUNT * 0.5 - 1 + (CELL_COUNT * 0.5 - 1) * CELL_COUNT + 1] = 1;
    this.enemyPieces[CELL_COUNT * 0.5 + CELL_COUNT * 0.5 * CELL_COUNT - 1] = 1;
  }

  // 돌의 수 얻기
  public piecesCount(pieces: number[]) {
    return pieces.filter((v) => v === 1).length;
  }

  // 패배 여부 판정
  public isLoss() {
    return this.isDone() && this.piecesCount(this.pieces) < this.piecesCount(this.enemyPieces);
  }

  // 무승부 여부 판정
  public isDraw() {
    return this.isDone() && this.piecesCount(this.pieces) === this.piecesCount(this.enemyPieces);
  }

  // 게임 종료 여부 판정
  public isDone() {
    return (
      this.piecesCount(this.pieces) + this.piecesCount(this.enemyPieces) === TOTAL_CELL_COUNT || this._passEnd
    );
  }

  // 다음 상태 얻기
  public next(action: number) {
    const coord = this.actionToCoord(action);
    this.histories.push(coord);
    const reversi = new Reversi(this.pieces, this.enemyPieces, this.depth + 1, this.histories, action);
    if (action !== TOTAL_CELL_COUNT) {
      reversi._isLegalActionXy(action % CELL_COUNT, Math.floor(action / CELL_COUNT), true);
    } else {
      console.log('스킵');
    }

    [reversi.pieces, reversi.enemyPieces] = [reversi.enemyPieces, reversi.pieces];

    // 2회 연속 패스 판정
    if (action === TOTAL_CELL_COUNT && reversi.legalActions()[0] === TOTAL_CELL_COUNT) {
      reversi._passEnd = true;
    }

    return reversi;
  }

  get lastAction() {
    return this._lastAction;
  }

  // 합법적인 수 리스트 얻기
  public legalActions() {
    const actions = [];

    for (let j = 0; j < CELL_COUNT; j += 1) {
      for (let i = 0; i < CELL_COUNT; i += 1) {
        if (this._isLegalActionXy(i, j)) {
          actions.push(i + j * CELL_COUNT);
        }
      }
    }

    if (actions.length === 0) {
      actions.push(TOTAL_CELL_COUNT); // 패스
    }

    return actions;
  }

  // 임의의 매스가 합법적인 수인지 판정
  private _isLegalActionXy(x: number, y: number, flip = false) {
    // 임의의 매스에서 임의의 방향이 합법적인 수인지 판정
    const _isLegalActionXyDxy = (x: number, y: number, dx: number, dy: number) => {
      // １번째 상대의 돌
      x += dx;
      y += dy;
      if (
        y < 0 ||
        CELL_COUNT - 1 < y ||
        x < 0 ||
        CELL_COUNT - 1 < x ||
        this.enemyPieces[x + y * CELL_COUNT] !== 1
      ) {
        return false;
      }

      // 2번째 이후
      for (let j = 0; j < CELL_COUNT; j += 1) {
        // 빈 칸
        if (
          y < 0 ||
          CELL_COUNT - 1 < y ||
          x < 0 ||
          CELL_COUNT - 1 < x ||
          (this.enemyPieces[x + y * CELL_COUNT] === 0 && this.pieces[x + y * CELL_COUNT] === 0)
        ) {
          return false;
        }

        // 자신의 돌
        if (this.pieces[x + y * CELL_COUNT] === 1) {
          //
          if (flip) {
            for (let i = 0; i < CELL_COUNT; i += 1) {
              x -= dx;
              y -= dy;
              if (this.pieces[x + y * CELL_COUNT] === 1) {
                return true;
              }
              this.pieces[x + y * CELL_COUNT] = 1;
              this.enemyPieces[x + y * CELL_COUNT] = 0;
            }
          }
          return true;
        }
        // 상대의 돌
        x += dx;
        y += dy;
      }
      return false;
    };

    // 빈칸 없음
    if (this.enemyPieces[x + y * CELL_COUNT] === 1 || this.pieces[x + y * CELL_COUNT] === 1) {
      return false;
    }

    // 돌을 놓음
    if (flip) {
      this.pieces[x + y * CELL_COUNT] = 1;
    }

    // 임의의 위치의 합법적인 수 여부 확인
    let flag = false;
    for (const [dx, dy] of this._dxy) {
      if (_isLegalActionXyDxy(x, y, dx, dy)) {
        flag = true;
      }
    }
    return flag;
  }

  // 선 수 여부 확인
  public isFirstPlayer() {
    return this.depth % 2 === 0;
  }

  // getRandomIntInclusive(min: number, max: number) {
  //   min = Math.ceil(min);
  //   max = Math.floor(max);
  //   return Math.floor(Math.random() * (max - min + 1)) + min; //최댓값도 포함, 최솟값도 포함
  // }

  // 랜덤으로 행동 선택
  // randomAction(state: State) {
  //   const legalActions = state.legalActions();
  //   return legalActions[this.getRandomIntInclusive(0, legalActions.length - 1)];
  // }

  // randomAIAction(state: State) {
  //   const selectedAction = this.randomAction(state);
  //   console.log({ selectedAction });
  //   if (selectedAction !== TOTAL_CELL_COUNT) {
  //     console.log('AI 수 선택 완료');
  //   }

  //   return state.next(selectedAction);
  //   // if (state.isDone()) {
  //   //   console.log('게임 끝!');
  //   // }
  // }

  public setPassEnd(passEnd: boolean) {
    this._passEnd = passEnd;
  }

  public actionToCoord(action: number) {
    if (action === TOTAL_CELL_COUNT) return '--';

    const x = String.fromCharCode((action % CELL_COUNT) + 65);
    const y = Math.floor(action / CELL_COUNT) + 1;
    return x + y;
  }

  public historiesToNotation() {
    // history 두 개씩 묶어서 변환
    const histories = this.histories.reduce((acc: string[][], cur: string, i: number) => {
      if (i % 2 === 0) {
        acc.push([cur, this.histories[i + 1] ?? '']);
      }
      return acc;
    }, []);

    // 변환
    const notation = histories.map((history, i) => {
      const [actionCoord, nextCoord] = history;
      return `${i + 1}. ${actionCoord} ${nextCoord}`;
    });

    // split by line every 6
    const notationWithLine = notation.reduce((acc: string[], cur: string, i: number) => {
      if (i % CELL_COUNT === 0 && i !== 0) {
        acc[acc.length - 1] += `\n${cur}`;
      } else {
        acc.push(cur);
      }
      return acc;
    }, []);

    return notationWithLine.join(' ');
  }
}
