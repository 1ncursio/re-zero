import Reversi from './Reversi';

const reversi = new Reversi();

describe('Reversi', () => {
  test('count pieces', () => {
    expect(reversi.piecesCount(reversi.pieces)).toEqual(2);
  });

  test('count enemy pieces', () => {
    expect(reversi.piecesCount(reversi.enemyPieces)).toEqual(2);
  });

  test('initialize histories', () => {
    expect(reversi.histories).toEqual([]);
  });

  test('initialize depth', () => {
    expect(reversi.depth).toEqual(0);
  });
});
