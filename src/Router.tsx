import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Index from "./pages";
import Shader from './pages/shader';

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Index />} />
        <Route path="/shader" element={<Shader />} />
      </Routes>
    </BrowserRouter>
  )
};

export default Router;
