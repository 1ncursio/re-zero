import { CELL_COUNT, TOTAL_CELL_COUNT } from '@lib/othelloConfig';

/**
 *
 * @param action 액션 코드 (0 ~ TOTAL_CELL_COUNT ** 2 - 1)
 * @returns notation 액션 코드에 해당하는 문자열 (예: 'A1')
 */
export default function convertActionToNotation(action: number) {
  const SKIP_NOTATION = '--';
  if (action === TOTAL_CELL_COUNT) return SKIP_NOTATION;

  const row = String.fromCharCode((action % CELL_COUNT) + 65);
  const col = Math.floor(action / CELL_COUNT) + 1;

  return `${row}${col}`;
}
