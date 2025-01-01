import { createContainer } from "../unstated-next";

export interface Theme {
  breakpoints: {
    values: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
  };
  palette: {
    mode: 'light' | 'dark';
    common: {
      black: string;
      white: string;
    };
    primary: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    secondary: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    error: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    warning: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    info: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    success: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    text: {
      primary: string;
      secondary: string;
      disabled: string;
    };
    background: {
      default: string;
      paper: string;
    };
    divider: string;
  };
  spacing: (factor: number) => number;
  shape: {
    borderRadius: number;
  };
  shadows: string[];
  typography: {
    fontFamily: string;
    fontSize: number;
    fontWeightLight: number;
    fontWeightRegular: number;
    fontWeightMedium: number;
    fontWeightBold: number;
    h1: React.CSSProperties;
    h2: React.CSSProperties;
    h3: React.CSSProperties;
    h4: React.CSSProperties;
    h5: React.CSSProperties;
    h6: React.CSSProperties;
    subtitle1: React.CSSProperties;
    subtitle2: React.CSSProperties;
    body1: React.CSSProperties;
    body2: React.CSSProperties;
    button: React.CSSProperties;
    caption: React.CSSProperties;
    overline: React.CSSProperties;
  };
  transitions: {
    easing: {
      easeInOut: string;
      easeOut: string;
      easeIn: string;
      sharp: string;
    };
    duration: {
      shortest: number;
      shorter: number;
      short: number;
      standard: number;
      complex: number;
      enteringScreen: number;
      leavingScreen: number;
    };
  };
  zIndex: {
    mobileStepper: number;
    fab: number;
    speedDial: number;
    appBar: number;
    drawer: number;
    modal: number;
    snackbar: number;
    tooltip: number;
  };
}

// グローバルなテーマコンテナを保持する変数
let ThemeContainer: ReturnType<typeof createContainer<{ theme: Theme }, Theme>> | undefined = undefined;

export const createTheme = (theme: Theme) => {
  // テーマコンテナを作成
  ThemeContainer = createContainer<{ theme: Theme }, Theme>((initialState = theme) => ({
    theme: initialState
  }));
  
  return ThemeContainer;
};

// テーマを取得するためのヘルパー関数
export const useTheme = () => {
  if (!ThemeContainer) {
    throw new Error('Theme container has not been created. Call createTheme first.');
  }
  return ThemeContainer.useContainer();
};
