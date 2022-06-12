export interface Theme {
  [themeName: string]: ThemeColors;
}

export type ThemeName = keyof Theme;

export interface ThemeColors {
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
}

const theme: Theme = {
  default: {
    colors: {
      backgroundAColor: '#68955E',
      backgroundBColor: '#88B179',
      gridColor: '#00000000',
      borderColor: '#4B5F45',
      coordinateTextColor: '#88B179',
      blackPieceInnerColor: '#2b4238',
      blackPieceOuterColor: '#2b4238',
      whitePieceInnerColor: '#FEFCDA',
      whitePieceOuterColor: '#FEFCDA',
      indicatorColor: 'rgba(255, 255, 255, 0.3)',
      indicatorHoverColor: 'rgba(0, 0, 0, 0.3)',
      pieceShadowColor: 'rgba(0, 0, 0, 0.3)',
      lastActionColor: 'rgba(255, 0, 0, 1)',
    },
  },
  panda: {
    colors: {
      backgroundAColor: '#54956b',
      backgroundBColor: '#54956b',
      gridColor: '#242424',
      borderColor: '#242424',
      coordinateTextColor: '#ffffff',
      blackPieceInnerColor: '#2c2c2c',
      blackPieceOuterColor: '#202020',
      whitePieceInnerColor: '#ffffff',
      whitePieceOuterColor: '#eeeeee',
      indicatorColor: 'rgba(255, 255, 255, 0.3)',
      indicatorHoverColor: 'rgba(0, 0, 0, 0.3)',
      pieceShadowColor: 'rgba(0, 0, 0, 0.3)',
      lastActionColor: 'rgba(255, 0, 0, 1)',
    },
  },
};

export default theme;
