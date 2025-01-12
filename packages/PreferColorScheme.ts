export default class PreferColorScheme {
  _mediaQueryList: MediaQueryList;

  constructor() {
    if(typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
      throw new Error('window.matchMedia is not defined');
    }

    this._mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
  }

  get mediaQueryList() {
    return this._mediaQueryList;
  }

  get isDark() {
    return this.mediaQueryList.matches;
  }

  get isLight() {
    return !this.isDark;
  }

  subscribe(callback: (event: MediaQueryListEvent) => void) {
    callback(new MediaQueryListEvent('change', {
      matches: this.mediaQueryList.matches,
      media: this.mediaQueryList.media
    }));
    
    this.mediaQueryList.addEventListener('change', callback);
    return () => {
      this.mediaQueryList.removeEventListener('change', callback)
    };
  }
};
