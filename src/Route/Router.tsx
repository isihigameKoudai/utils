import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Box from '@/packages/ui/Box';

import Menu from "../components/Menu";
import { routeList } from "./routes";

export const NavigationHeader: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box as='header' zIndex={10} position="relative">
      <button style={{
        position: 'fixed',
        top: 10,
        right: 10
      }} onClick={() => setIsOpen(true)}>Menu</button>
      {
        isOpen && (
          <Menu onClose={() => setIsOpen(false)} />
        )
      }
    </Box>
  )
}

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {
          routeList.map((item, i) => <Route key={`route-${i}`} index={item.title === '/'} path={item.path} element={item.element} />)
        }
      </Routes>
      <NavigationHeader />
    </BrowserRouter>
  )
};

export default Router;
