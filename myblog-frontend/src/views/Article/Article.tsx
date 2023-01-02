import React, {useState} from "react";
import Comments from "./Comments";
import MarkdownIt from "markdown-it";
import {Divider, Space, Spin, Typography} from "antd";
import {useParams} from "react-router-dom";
import {useRequest} from "ahooks";
import {getArticle} from "../../config/api";
import {absolute} from "../../utils/dateformat";
import "./Article.scss";

const {Title, Link, Text} = Typography;
const md = new MarkdownIt();
export default function Article() {
    let {id} = useParams();

    // const id = Number(articleId);
    //
    // if (isNaN(id)) throw new Error(`ID: ${id} 文章ID异常`);

    const [article, setArticle] = useState<API.Article>({});

    const {loading} = useRequest(() => getArticle({id}), {
        onSuccess(data) {
            console.log(data);
            if (data) setArticle(data);
        },
        refreshDeps: [id],
    });

    const tags = article?.tags?.map((tag) => (
        <Link type="secondary" key={tag.id}>
            {tag.title}
        </Link>
    ));

    const content = md.render(article?.content || "loading...");

    return (
        <Spin spinning={loading}>
            <div className="article space-y-4 px-7 py-7">
                <div className="">
                    <Title level={2}>{article.title}</Title>
                    <Text type="secondary">
                        {article.createdAt
                            ? `创建时间: ${absolute(article.createdAt)}`
                            : null}
                    </Text>

                    <Space
                        split={<Divider type="vertical"/>}
                        style={{display: "flex"}}
                    >
                        {tags}
                    </Space>
                </div>
                <Divider/>
                <div dangerouslySetInnerHTML={{__html: content}}></div>
                <Divider>评论区</Divider>
                {/*<div>评论...</div>*/}
                <Comments articleId={Number(id)}/>
            </div>
        </Spin>
    );
}
