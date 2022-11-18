import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Index from "./pages";

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
      </Routes>
    </BrowserRouter>
  )
};

export default Router;
