import React, {useMemo, useRef, useState} from "react";
import {Button, Divider, Space, Tag, Typography} from "antd";
import {Plot, WordCloud} from "@ant-design/plots";
import {WordCloudConfig} from "@ant-design/plots/es/components/word-cloud";
import randomColor from "randomcolor";
import {
    getAnncmnt,
    getLatestComments,
    getTagsList,
    getTopArticles,
} from "../config/api";
import {useRequest} from "ahooks";
import {createSearchParams, useNavigate} from "react-router-dom";

export default function Sidebar({
                                    style,
                                    className,
                                }: {
    style?: React.CSSProperties;
    className?: string;
}) {
    const navigate = useNavigate();

    const {data: anncmnt = "", loading: anncmntLoading} = useRequest(() =>
        getAnncmnt()
    );

    const {data: topArticles = [], loading: articlesLoading} = useRequest(() =>
        getTopArticles()
    );
    const TopArticlesContent = topArticles.map((article) => (
        <Typography.Paragraph key={`sidebar-${article.id}`}>
            <Typography.Link
                type="secondary"
                // to={`/index/article/${article?.id}`}
                onClick={() => navigate(`/index/article/${article?.id}`)}
            >
                {article.title}
            </Typography.Link>
            {` - ${article.viewCount} Views`}
        </Typography.Paragraph>
    ));

    const {data: latestComments = [], loading: commentsLoading} = useRequest(
        () => getLatestComments()
    );
    const commentsContent = latestComments.map((comment) => (
        <Typography.Paragraph key={`sidebar-${comment.id}`}>
            {comment?.user?.name} 发表在
            <Typography.Link
                type="secondary"
                onClick={() => navigate(`/index/article/${comment?.article?.id}`)}
            >
                {/*Todo: href待完成*/}《{comment?.article?.title}》
            </Typography.Link>
        </Typography.Paragraph>
    ));

    const {data: tags = [], loading: tagsLoading} = useRequest(() =>
        getTagsList()
    );
    const tagsContent = useMemo(() => {
        return tags.map((tag) => (
            <Button
                key={`sidebar-${tag.id}`}
                type="primary"
                className="my-0.5 mx-0.5"
                onClick={() =>
                    navigate(`/timeline?${createSearchParams({tags: `${tag.id}`})}`)
                }
                size="small"
            >
                {tag.title}
            </Button>
        ));
    }, [tags]);

    return (
        <div
            className="w-[12rem] rounded-lg bg-white p-5 shadow-md lg:w-[13rem] xl:w-[14rem]"
            style={style}
        >
            <Typography.Title level={5}>公告</Typography.Title>
            <Typography.Paragraph>{anncmnt}</Typography.Paragraph>
            <Divider/>
            <Typography.Title level={5}>Views</Typography.Title>
            {TopArticlesContent}
            <Divider/>
            <Typography.Title level={5}>评论</Typography.Title>
            {commentsContent}
            <Divider/>
            <Typography.Title level={5}>标签</Typography.Title>
            <div className="flex flex-wrap ">{tagsContent}</div>
        </div>
    );
}
