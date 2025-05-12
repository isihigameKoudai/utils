import React from 'react';
import { Outlet } from '@tanstack/react-router';
import { NavigationHeader } from './NavigationHeader';

export const RootLayout: React.FC = () => {
  return (
    <>
      <NavigationHeader />
      <Outlet />
    </>
  );
}; 
