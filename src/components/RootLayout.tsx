import React from 'react';
import { NavigationHeader } from './NavigationHeader';

interface RootLayoutProps {
  children: React.ReactNode;
}

export const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <>
      <NavigationHeader />
      {children}
    </>
  );
}; 
