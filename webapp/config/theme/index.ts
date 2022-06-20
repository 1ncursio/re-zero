// import seok98BlackPieceImage from './seok98/black_piece.png';
// import seok98WhitePieceImage from './seok98/white_piece.png';
// import defaultBlackPieceImage from './default/black_piece.png';
// import defaultWhitePieceImage from './default/white_piece.png';
// import pandaBlackPieceImage from './panda/black_piece.png';
// import pandaWhitePieceImage from './panda/white_piece.png';

const theme: Themes = {
  default: {
    colors: {
      backgroundAColor: '#68955E',
      backgroundBColor: '#88B179',
      gridColor: '#00000000',
      borderColor: '#4B5F45',
      coordinateTextColor: '#88B179',
      blackPieceImageSrc: 'defaultBlackPieceImage',
      whitePieceImageSrc: 'defaultWhitePieceImage',
      indicatorColor: 'rgba(255, 255, 255, 0.3)',
      indicatorHoverColor: 'rgba(0, 0, 0, 0.3)',
      pieceShadowColor: 'rgba(0, 0, 0, 0.3)',
      lastActionColor: '#ff0000',
    },
    size: {
      piece: 0.75,
    },
  },
  panda: {
    colors: {
      backgroundAColor: '#54956b',
      backgroundBColor: '#54956b',
      gridColor: '#242424',
      borderColor: '#242424',
      coordinateTextColor: '#ffffff',
      blackPieceImageSrc: 'pandaBlackPieceImage',
      whitePieceImageSrc: 'pandaWhitePieceImage',
      indicatorColor: 'rgba(255, 255, 255, 0.3)',
      indicatorHoverColor: 'rgba(0, 0, 0, 0.3)',
      pieceShadowColor: 'rgba(0, 0, 0, 0.3)',
      lastActionColor: '#ff0000',
    },
    size: {
      piece: 0.75,
    },
  },
  seok98: {
    colors: {
      backgroundAColor: '#c9c8bd',
      backgroundBColor: '#f4f3ef',
      gridColor: '#00000000',
      borderColor: '#4B5F45',
      coordinateTextColor: '#88B179',
      blackPieceImageSrc: 'seok98BlackPieceImage',
      whitePieceImageSrc: 'seok98WhitePieceImage',
      indicatorColor: 'rgba(255, 255, 255, 0.3)',
      indicatorHoverColor: 'rgba(0, 0, 0, 0.3)',
      pieceShadowColor: 'rgba(0, 0, 0, 0.3)',
      lastActionColor: '#ff0000',
    },
    size: {
      piece: 0.9,
    },
  },
};

export interface Themes {
  [themeName: string]: Theme;
}

export type Theme = ThemeColors & ThemeSize;

export type ThemeName = keyof Themes;

export interface ThemeColors {
  colors: {
    backgroundAColor: string;
    backgroundBColor: string;
    gridColor: string;
    borderColor: string;
    coordinateTextColor: string;
    blackPieceImageSrc: string;
    whitePieceImageSrc: string;
    indicatorColor: string;
    indicatorHoverColor: string;
    pieceShadowColor: string;
    lastActionColor: string;
  };
}

export interface ThemeSize {
  size: {
    piece: number;
  };
}

export default theme;
