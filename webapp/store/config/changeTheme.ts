import theme, { ThemeName } from '../../config/theme';
import Canvas from '../../lib/othello/Canvas';
import useStore from '../useStore';

// define the actions
export default function changeTheme(themeName: ThemeName, ...canvases: Canvas[]) {
  useStore.setState((state) => {
    state.config.theme = theme[themeName];
  });

  canvases.forEach((canvas) => {
    canvas.setTheme();
    canvas.draw();
  });
}
