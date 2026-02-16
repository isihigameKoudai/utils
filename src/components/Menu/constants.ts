type IRoute = {
  title: string;
  path: string;
  menuPath?: string;
};

export const routeList: IRoute[] = [
  {
    title: 'TOP',
    path: '/',
  },
  {
    title: 'プレイグラウンド',
    path: '/playground',
  },
  {
    title: 'Shader',
    path: '/shader',
  },
  {
    title: 'オーディオ',
    path: '/audio',
  },
  {
    title: 'オーディオ（マイク）',
    path: '/audio/mic',
  },
  {
    title: 'オーディオ（音声認識）',
    path: '/audio/speech',
  },
  {
    title: '3D',
    path: '/three-dimension',
  },
  {
    title: '3D（影）',
    path: '/three-dimension/shadows',
  },
  {
    title: '3D（シェーダー）',
    path: '/three-dimension/shader',
  },
  {
    title: '3D（パーティクル）',
    path: '/three-dimension/particle',
  },
  {
    title: 'stable fluids',
    path: '/stable-fluids',
  },
  {
    title: 'サンプル（Shader）',
    path: '/',
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
    title: 'Detection',
    path: '/',
  },
  {
    title: 'ML',
    path: '/detection/detector',
  },
  {
    title: 'ML（顔ランドマーク検出）',
    path: '/detection/face-landmark',
  },
  {
    title: 'ML（手のポーズ検出）',
    path: '/detection/hand-pose',
  },
  {
    title: 'ML（ポーズ検出）',
    path: '/detection/pose',
  },
  {
    title: 'Fluid + Detection',
    path: '/detection/fluid',
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
    title: 'CryptoCharts（一覧）',
    path: '/trade',
  },
  {
    title: 'CryptoCharts（BTC詳細）',
    path: '/trade',
    menuPath: '/trade',
  },
  {
    title: 'クレジットカード集計',
    path: '/aggregate-bill',
  },
  {
    title: 'クレジットカード集計サマリー',
    path: '/aggregate-bill/summary',
  },
];
