import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  Router,
  Routes,
} from "react-router-dom";
import { NormalLayout } from "../layout/NormalLayout";
import App from "../App";
import Index from "../views/Index";
import Timeline from "../views/Timeline/Timeline";
import Article from "../views/Article/Article";
import About from "../views/About/About";
import Archive from "../views/Archive";
import Error404 from "../views/404";
import Redirect from "../views/Redirect";
import TravelMap from "../views/TravelMap/TravelMap";
import Sidebar from "../components/Sidebar";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      <Route index element={<Navigate to="/index" />} />
      <Route element={<NormalLayout />}>
        <Route
          path="/index"
          element={<Index />}
          handle={{ sidebar: <Sidebar /> }}
        ></Route>
        <Route path="/archive/:page" element={<Archive />}></Route>
        <Route
          path="/timeline"
          element={<Timeline />}
          handle={{ sidebar: <Sidebar /> }}
        ></Route>
        <Route
          path="/travelMap"
          element={<TravelMap />}
          handle={{ sidebar: <Sidebar /> }}
        ></Route>
        <Route
          path="/about"
          element={<About />}
          handle={{ sidebar: <Sidebar /> }}
        ></Route>
        <Route path="/:type/article/:id" element={<Article />}></Route>
      </Route>
      {/*<Route path="/login"></Route>*/}
      <Route path="/Redirect" element={<Redirect />}></Route>
      <Route path="*" element={<Error404 />} />
    </Route>
  )
);

export default router;
