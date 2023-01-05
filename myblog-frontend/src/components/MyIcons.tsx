import React from "react";
import { createFromIconfontCN } from "@ant-design/icons";

const Iconfont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/c/font_3818990_vw7kz33sjzb.js",
});

export const Views = () => {
  return <Iconfont type="icon-view" />;
};
