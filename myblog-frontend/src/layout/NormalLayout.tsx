import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Divider, Menu } from "antd";
import { Typography } from "antd";
import Sidebar from "../components/Sidebar";

const { Title, Text, Link } = Typography;

export function NormalLayout() {
  const items: MenuProps["items"] = [
    {
      label: "首页",
      key: "index",
      icon: <MailOutlined />,
    },
    // {
    //   label: "分类",
    //   key: "category",
    //   icon: <AppstoreOutlined />,
    //   // disabled: true,
    // },
    {
      label: "时间线",
      key: "timeline",
      icon: <SettingOutlined />,
    },
    {
      label: "关于",
      key: "about",
      // icon: <SettingOutlined />,
    },
  ];
  const [current, setCurrent] = useState("");
  const navigate = useNavigate();

  const location = useLocation();
  useEffect(() => {
    const { pathname } = location;
    console.log(pathname);
    if (pathname.toLowerCase().startsWith("/timeline")) setCurrent("timeline");

    if (pathname.toLowerCase().startsWith("/about")) setCurrent("about");

    if (pathname.toLowerCase().startsWith("/index")) setCurrent("index");
  }, [location]);

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    switch (e.key) {
      case "index":
        navigate("/index");
        break;
      case "timeline":
        navigate("/timeline");
        break;
      case "about":
        navigate("/about");
        break;
    }
  };

  return (
    <div className="flex flex-1 items-start gap-x-8 py-36">
      <div>
        <div className="relative w-[38rem] rounded-lg bg-white shadow-md lg:w-[46rem] xl:w-[64rem]">
          <div className="space-y-4 p-7">
            <Title level={1} className="">
              Robert Chaw 的博客
            </Title>
            <Title level={4} type="secondary">
              重剑无锋，大巧不工。
            </Title>
          </div>
          <Menu
            className=" h-16 border-y border-solid border-y-[#0505050d] pl-3 text-lg leading-[4rem]"
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={items}
          />
          <Outlet />
        </div>
        <Text type="secondary" className="px-7">
          Copyright{" "}
          <Link href="https://github.com/RobertChaw">@RobertChaw</Link>
        </Text>
      </div>
      <Sidebar />
    </div>
  );
}
