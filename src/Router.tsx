import React from "react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";

import Index from "./pages";
import Shader from './pages/shader';
import ThreeDimension from "./pages/ThreeDimension";
import Shadows from './pages/ThreeDimension/Shadows';
import ShaderPage from './pages/ThreeDimension/Shader';

type IRoute = {
  title: string;
  path: string;
  element: JSX.Element;
}

export const routeList: IRoute[] = [{
  title: 'TOP',
  path: '/',
  element: <Index />
},{
  title: 'Shader',
  path: '/shader',
  element: <Shader />
},{
  title: '3D',
  path: '/three-dimension',
  element: <ThreeDimension />
},{
  title: '3D（影）',
  path: '/three-dimension/shadows',
  element: <Shadows />
},{
  title: '3D（シェーダー）',
  path: '/three-dimension/shader',
  element: <ShaderPage />
},]


export const NavigationHeader: React.FC = () => (
  <header>
    <nav>
      <ul>
      {
        routeList.map((item, i) => (
          <li key={`link-${i}`}>
            <Link to={item.path}>{item.title}</Link>
          </li>
        ))
      }
      </ul>
    </nav>
  </header>
)

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <NavigationHeader />
      <Routes>
        {
          routeList.map((item, i) => <Route key={`route-${i}`} index={item.title === '/'} path={item.path} element={item.element} />)
        }
      </Routes>
    </BrowserRouter>
  )
};

export default Router;
