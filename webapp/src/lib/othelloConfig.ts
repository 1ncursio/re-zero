export const COORDINATE_SIZE = 16;
export const GAME_CANVAS_SIZE = 480;
export const BACKGROUND_CANVAS_SIZE = GAME_CANVAS_SIZE + COORDINATE_SIZE * 2;
export const CELL_COUNT = 6;
export const CELL_SIZE = GAME_CANVAS_SIZE / CELL_COUNT;
export const TOTAL_CELL_COUNT = CELL_COUNT ** 2;

// colors for the game
export const BACKGROUND_COLOR = 'rgba(84, 149, 107)';
export const GRID_COLOR = 'rgba(36, 36, 36, 1)';
export const COORDINATE_COLOR = GRID_COLOR;
export const BLACK_PIECE_COLOR = 'rgba(64, 64, 64, 1)';
export const WHITE_PIECE_COLOR = 'rgba(255, 255, 255, 1)';
export const STROKE_COLOR = 'rgba(100, 100, 100, 1)';
export const INNER_STROKE_COLOR = 'rgba(100, 100, 100, 0.2)';
export const INDICATOR_COLOR = 'rgba(255, 255, 255, 0.3)';
export const HOVER_INDICATOR_COLOR = 'rgba(0, 0, 0, 0.3)';

export const SHADOW_COLOR = 'rgba(0, 0, 0, 0.3)';
export const LAST_ACTION_COLOR = 'rgba(255, 0, 0, 1)';
