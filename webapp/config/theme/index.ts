const theme: Themes = {
  default: {
    colors: {
      backgroundAColor: '#68955E',
      backgroundBColor: '#88B179',
      gridColor: '#00000000',
      borderColor: '#4B5F45',
      coordinateTextColor: '#88B179',
      blackPieceImageSrc: require('@theme/default/black_piece.png'),
      whitePieceImageSrc: require('@theme/default/white_piece.png'),
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
      blackPieceImageSrc: require('@theme/panda/black_piece.png'),
      whitePieceImageSrc: require('@theme/panda/white_piece.png'),
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
      blackPieceImageSrc: require('@theme/seok98/white_piece.png'),
      whitePieceImageSrc: require('@theme/seok98/black_piece.png'),
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

export type ThemeName = 'default' | 'panda' | 'seok98';

export type Themes = Record<ThemeName, Theme>;

export type Theme = ThemeColors & ThemeSize;

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
