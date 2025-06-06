type IRoute = {
  title: string;
  path: string;
  menuPath?: string;
};

export const routeList: IRoute[] = [
  {
    title: "TOP",
    path: "/",
  },
  {
    title: 'プレイグラウンド',
    path: '/playground',
  },
  {
    title: "Shader",
    path: "/shader",
  },
  {
    title: "オーディオ",
    path: "/audio",
  },
  {
    title: "オーディオ（マイク）",
    path: "/audio/mic",
  },
  {
    title: "オーディオ（音声認識）",
    path: "/audio/speech",
  },
  {
    title: "3D",
    path: "/three-dimension",
  },
  {
    title: "3D（影）",
    path: "/three-dimension/shadows",
  },
  {
    title: "3D（シェーダー）",
    path: "/three-dimension/shader",
  },
  {
    title: "3D（パーティクル）",
    path: "/three-dimension/particle",
  },
  {
    title: 'stable fluids',
    path: '/stable-fluids',
  },
  {
    title: 'サンプル',
    path: '/'
  },
  {
    title: '5スター',
    path: '/samples/5star-particle',
  },
  {
    title: '円',
    path: '/samples/normal-circle',
  },
  {
    title: '円(オーディオ)',
    path: '/samples/audio-circle',
  },
  {
    title: '円（追尾）',
    path: '/samples/follower-circle',
  },
  {
    title: 'キラキラ',
    path: '/samples/square-apark',
  },
  {
    title: 'ML',
    path: '/samples/detector',
  },
  {
    title: 'ML（顔ランドマーク検出）',
    path: '/samples/face-landmark-detector',
  },
  {
    title: 'ML（手のポーズ検出）',
    path: '/samples/hand-pose-detection',
  },
  {
    title: 'ML（ポーズ検出）',
    path: '/samples/pose-detection',
  },
  {
    title: 'fluid-detect',
    path: '/samples/fluid-detect',
  },
  {
    title: 'ノイズ',
    path: '/noise',
  },
  {
    title: 'fBMノイズ',
    path: '/noise/fbm',
  },
  {
    title: 'フラクタルノイズ',
    path: '/noise/fractal',
  },
  {
    title: 'セルラーノイズ',
    path: '/noise/cellular',
  },
  {
    title: 'Melt the border',
    path: '/melt-the-border',
  },
  {
    title: 'IState',
    path: '/samples/istate',
  },
  {
    title: 'CryptoCharts',
    path: '/crypto-charts',
  },
  {
    title: 'MultiChart',
    path: '/crypto-charts/multi/:token',
    menuPath: '/crypto-charts/multi/BTC',
  }
];
