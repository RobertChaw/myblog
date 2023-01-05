import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "antd/dist/reset.css";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./config/router";
import { RecoilRoot } from "recoil";
import "./config/axiosConfig";
import { Spin } from "antd";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <React.Suspense fallback={<Spin spinning tip="Loading"></Spin>}>
        <RouterProvider router={router} />
      </React.Suspense>
    </RecoilRoot>
  </React.StrictMode>
);
