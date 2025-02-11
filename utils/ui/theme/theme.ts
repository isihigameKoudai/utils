import { useState } from "react";

import { createContainer } from "@/utils/unstated-next";

import { Theme } from "./type";


// グローバルなテーマコンテナを保持する変数
let ThemeContainer: ReturnType<typeof createContainer<{ theme: Theme }, Theme>> | undefined = undefined;

export const createTheme = (theme: Theme) => {
  // テーマコンテナを作成
  ThemeContainer = createContainer<{ theme: Theme }, Theme>((initialState = theme) => {
    const [theme, setTheme] = useState(initialState);
    return { theme, setTheme };
  });

  return ThemeContainer;
};

// テーマを取得するためのヘルパー関数
export const useTheme = () => {
  try  {
    return ThemeContainer?.useContainer();
  } catch (error) {
    console.error('Error in useTheme:', error);
  }
};
