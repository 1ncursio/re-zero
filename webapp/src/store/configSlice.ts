import produce from 'immer';
import theme, { ThemeName } from '../config/theme';
import Background from '../lib/othello/Background';
import Canvas from '../lib/othello/Canvas';
import { AppSlice, AppState } from './useStore';

export interface ConfigSlice {
  config: {
    theme: {
      colors: {
        backgroundAColor: string;
        backgroundBColor: string;
        gridColor: string;
        borderColor: string;
        coordinateTextColor: string;
        blackPieceInnerColor: string;
        blackPieceOuterColor: string;
        whitePieceInnerColor: string;
        whitePieceOuterColor: string;
        indicatorColor: string;
        indicatorHoverColor: string;
        pieceShadowColor: string;
        lastActionColor: string;
      };
    };
    changeTheme: (bgCanvas: Canvas, gameCanvas: Canvas, themeName: ThemeName) => void;
  };
}

const createConfigSlice: AppSlice<ConfigSlice> = (set, get) => ({
  config: {
    theme: {
      name: 'default',
      colors: theme.default.colors,
    },
    changeTheme: (bgCanvas: Canvas, gameCanvas: Canvas, themeName: ThemeName) => {
      set(
        produce((state: AppState) => {
          state.config.theme.colors = theme[themeName].colors;
        }),
      );

      bgCanvas.setTheme();
      gameCanvas.setTheme();
      bgCanvas.draw();
    },
  },
});

export default createConfigSlice;
