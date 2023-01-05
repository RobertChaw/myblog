import React from "react";
import MarkdownIt from "markdown-it";
import { Divider, Spin } from "antd";
import { getAbout } from "../../config/api";
import { useRequest } from "ahooks";
import Comments from "../Article/Comments";
import "./About.scss";

const md = new MarkdownIt();
export default function About() {
  const { data, loading } = useRequest(() => getAbout());
  const content = md.render(data?.content || "loading...");
  return (
    <Spin spinning={loading} delay={500}>
      <div className="article p-7">
        <div dangerouslySetInnerHTML={{ __html: content }}></div>
        <Divider>评论区</Divider>
        {data?.id ? <Comments articleId={data.id}></Comments> : null}
      </div>
    </Spin>
  );
}
