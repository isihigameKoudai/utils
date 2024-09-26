import React, { createContext, useContext, ReactNode } from 'react';
import { createStore } from './createStore';

type AnyStore = ReturnType<typeof createStore<any, any, any>>;

type CombinedStores<T extends Record<string, AnyStore>> = {
  [K in keyof T]: ReturnType<T[K]['useStore']>;
};

const StoreContext = createContext<CombinedStores<any> | null>(null);

export function combineStore<T extends Record<string, AnyStore>>(stores: T) {
  const useStore = <K extends keyof T>(key?: K) => {
    const context = useContext(StoreContext);
    if (!context) {
      throw new Error('useStore must be used within a StoreProvider');
    }
    return key ? context[key] : context;
  };

  const Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const storeValues = Object.entries(stores).reduce((acc, [key, store]) => {
      const currentStore = store.useStore();
      return {
        ...acc,
        [key]: currentStore
      };
    }, {} as CombinedStores<T>);

    return (
      <StoreContext.Provider value={storeValues}>
        {children}
      </StoreContext.Provider>
    );
  };

  return { useStore, Provider };
}