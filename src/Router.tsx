import React from "react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";

import Index from "./pages";
import Shader from './pages/shader';
import ThreeDimension from "./pages/ThreeDimension";

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
}]


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
