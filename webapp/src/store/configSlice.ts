import produce from 'immer';
import theme, { Theme, ThemeName } from '../config/theme';
import Canvas from '../lib/othello/Canvas';
import { AppSlice, AppState } from './useStore';

export interface ConfigSlice {
  config: {
    theme: Theme;
    changeTheme: (themeName: ThemeName, ...canvases: Canvas[]) => void;
  };
}

const createConfigSlice: AppSlice<ConfigSlice> = (set, get) => ({
  config: {
    theme: {
      name: 'default',
      ...theme.default,
    },
    changeTheme(themeName: ThemeName, ...canvases: Canvas[]) {
      set(
        produce((state: AppState) => {
          state.config.theme = theme[themeName];
        }),
      );

      canvases.forEach((canvas) => {
        canvas.setTheme();
        canvas.draw();
      });
    },
  },
});

export default createConfigSlice;
