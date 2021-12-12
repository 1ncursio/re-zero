import { CELL_COUNT } from '../othelloConfig';

export default class State {
  private dxy: number[][];
  private passEnd: boolean;
  public depth: number;
  public pieces: number[];
  public enemyPieces: number[];

  constructor(pieces?: number[], enemyPieces?: number[], depth = 0) {
    // 방향 정수
    this.dxy = [
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
    this.passEnd = false;
    this.depth = depth;

    // 돌의 초기 배치
    if (pieces && enemyPieces) {
      // 돌의 배치
      this.pieces = pieces;
      this.enemyPieces = enemyPieces;
    } else {
      this.pieces = Array.from({ length: CELL_COUNT ** 2 }, () => 0);
      this.pieces[14] = this.pieces[21] = 1;
      // this.pieces[27] = this.pieces[36] = 1;
      this.enemyPieces = Array.from({ length: CELL_COUNT ** 2 }, () => 0);
      // this.enemyPieces[28] = this.enemyPieces[35] = 1;
      this.enemyPieces[15] = this.enemyPieces[20] = 1;
    }
  }

  // 돌의 수 얻기
  public piecesCount(pieces: number[]) {
    return pieces.filter((v) => v === 1).length;
  }

  // 패배 여부 판정
  public isLoss() {
    return (
      this.isDone() &&
      this.piecesCount(this.pieces) < this.piecesCount(this.enemyPieces)
    );
  }

  // 무승부 여부 판정
  public isDraw() {
    return (
      this.isDone() &&
      this.piecesCount(this.pieces) === this.piecesCount(this.enemyPieces)
    );
  }

  // 게임 종료 여부 판정
  public isDone() {
    return (
      this.piecesCount(this.pieces) + this.piecesCount(this.enemyPieces) ===
        CELL_COUNT ** 2 || this.passEnd
    );
  }

  // 다음 상태 얻기
  public next(action: number) {
    const state = new State(this.pieces, this.enemyPieces, this.depth + 1);
    if (action != CELL_COUNT ** 2) {
      state.isLegalActionXy(
        action % CELL_COUNT,
        Math.floor(action / CELL_COUNT),
        true,
      );
    } else {
      console.log('스킵');
    }

    [state.pieces, state.enemyPieces] = [state.enemyPieces, state.pieces];

    // 2회 연속 패스 판정
    if (
      action === CELL_COUNT ** 2 &&
      state.legalActions()[0] === CELL_COUNT ** 2
    ) {
      state.passEnd = true;
    }
    return state;
  }

  // 합법적인 수 리스트 얻기
  public legalActions() {
    const actions = [];

    for (let j = 0; j < CELL_COUNT; j++) {
      for (let i = 0; i < CELL_COUNT; i++) {
        if (this.isLegalActionXy(i, j)) {
          actions.push(i + j * CELL_COUNT);
        }
      }
    }

    if (actions.length === 0) {
      actions.push(CELL_COUNT ** 2); // 패스
    }

    return actions;
  }

  // 임의의 매스가 합법적인 수인지 판정
  public isLegalActionXy(x: number, y: number, flip = false) {
    const that = this;
    // 임의의 매스에서 임의의 방향이 합법적인 수인지 판정
    function isLegalActionXyDxy(x: number, y: number, dx: number, dy: number) {
      // １번째 상대의 돌
      x = x + dx;
      y = y + dy;
      if (
        y < 0 ||
        CELL_COUNT - 1 < y ||
        x < 0 ||
        CELL_COUNT - 1 < x ||
        that.enemyPieces[x + y * CELL_COUNT] !== 1
      ) {
        return false;
      }

      // 2번째 이후
      for (let j = 0; j < CELL_COUNT; j++) {
        // 빈 칸
        if (
          y < 0 ||
          CELL_COUNT - 1 < y ||
          x < 0 ||
          CELL_COUNT - 1 < x ||
          (that.enemyPieces[x + y * CELL_COUNT] == 0 &&
            that.pieces[x + y * CELL_COUNT] == 0)
        ) {
          return false;
        }

        // 자신의 돌
        if (that.pieces[x + y * CELL_COUNT] == 1) {
          // 반전
          if (flip) {
            for (let i = 0; i < CELL_COUNT; i++) {
              x = x - dx;
              y = y - dy;
              if (that.pieces[x + y * CELL_COUNT] == 1) {
                return true;
              }
              that.pieces[x + y * CELL_COUNT] = 1;
              that.enemyPieces[x + y * CELL_COUNT] = 0;
            }
          }
          return true;
        }
        // 상대의 돌
        x = x + dx;
        y = y + dy;
      }
      return false;
    }

    // 빈칸 없음
    if (
      this.enemyPieces[x + y * CELL_COUNT] === 1 ||
      this.pieces[x + y * CELL_COUNT] === 1
    ) {
      return false;
    }

    // 돌을 놓음
    if (flip) {
      this.pieces[x + y * CELL_COUNT] = 1;
    }

    // 임의의 위치의 합법적인 수 여부 확인
    let flag = false;
    for (const [dx, dy] of this.dxy) {
      if (isLegalActionXyDxy(x, y, dx, dy)) {
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
  //   if (selectedAction !== CELL_COUNT ** 2) {
  //     console.log('AI 수 선택 완료');
  //   }

  //   return state.next(selectedAction);
  //   // if (state.isDone()) {
  //   //   console.log('게임 끝!');
  //   // }
  // }

  public setPassEnd(passEnd: boolean) {
    this.passEnd = passEnd;
  }
}

// 동작 확인
// function main() {
//   // 상태 생성
//   let state = new State();

//   // 게임 종료 시까지 반복
//   while (true) {
//     // 게임 종료 시
//     if (state.isDone()) break;

//     // 다음 상태 얻기
//     state = state.next(randomAction(state));

//     // 문자열 출력
//     console.log(state.print());
//   }
// }
