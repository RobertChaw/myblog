import React, {useState} from "react";
import {
    Button,
    Checkbox,
    CheckboxOptionType,
    Divider,
    Radio,
    Space,
    Spin,
    Timeline,
    Typography,
} from "antd";
import type {RadioChangeEvent} from "antd";
import {useRequest} from "ahooks";
import {
    getArticlesByTags,
    getTagsList,
    getTopArticles,
} from "../../config/api";
import {CheckboxValueType} from "antd/es/checkbox/Group";
import {
    createSearchParams,
    useNavigate,
    useSearchParams,
} from "react-router-dom";
import dayjs from "dayjs";
import "./Timeline.scss";

export default function () {
    // const [selectedTags, setSelectedTags] = useState<CheckboxValueType[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedTags = searchParams.getAll("tags");

    function setSelectedTags(tags: string[]) {
        setSearchParams(createSearchParams({tags}));
    }

    const [tags, setTags] = useState<CheckboxOptionType[]>([]);
    const {loading: tagsLoading} = useRequest(() => getTagsList(), {
        onSuccess(data) {
            if (!data) return;
            const mapTags = data.map((tag) => ({
                value: `${tag.id}`,
                label: `${tag.title}`,
            }));
            setTags(mapTags);
        },
    });
    const onChange = (checkedValues: CheckboxValueType[]) => {
        setSelectedTags(checkedValues as string[]);
    };

    const {data: articles, loading: articlesLoading} = useRequest(
        () => getArticlesByTags({tags: selectedTags}),
        {
            refreshDeps: [searchParams],
        }
    );

    function sortByMonth(list: typeof articles) {
        if (!list) return [];
        const map = new Map<string, typeof list>();
        list.forEach((article) => {
            const date = dayjs(article.createdAt).format("YYYY-MM-DD");
            // console.log(article, date);
            if (!map.has(date)) {
                map.set(date, []);
            }
            const set = map.get(date) as typeof list;
            set.push(article);
        });

        const newList = [];
        for (const [key, value] of map) {
            newList.push({date: key, list: value});
        }
        newList.sort((a, b) => {
            const aDate = dayjs(a.date);
            const bDate = dayjs(b.date);
            return bDate.diff(aDate);
        });
        return newList;
    }

    const sortedArticles = sortByMonth(articles);
    const navigate = useNavigate();
    const timelineItems = sortedArticles.map((item) => (
        <Timeline.Item>
            <Space direction="vertical" style={{display: "flex"}}>
                <Typography.Title level={5}>{item.date}</Typography.Title>
                {item.list.map((i) => (
                    <Button
                        type="text"
                        size="large"
                        onClick={() => navigate(`/index/article/${i.id}`)}
                        block
                    >
                        <div className="flex justify-between">
                            <Typography.Paragraph>
                                <Typography.Text underline>{i.title}</Typography.Text>
                            </Typography.Paragraph>
                            <Typography.Paragraph>
                                <Space split={<Divider type="vertical"/>}>
                                    {i?.tags?.map((t) => (
                                        <Typography.Text>{t.title}</Typography.Text>
                                    ))}
                                </Space>
                            </Typography.Paragraph>
                        </div>
                    </Button>
                ))}
            </Space>
        </Timeline.Item>
    ));

    return (
        <div className="p-5">
            <Typography.Title level={5}>标签</Typography.Title>
            <Checkbox.Group
                options={tags}
                defaultValue={selectedTags}
                onChange={onChange}
                value={selectedTags}
            />
            <Divider/>
            <Spin spinning={articlesLoading} tip="Loading">
                <Timeline>
                    {timelineItems}
                    <Timeline.Item></Timeline.Item>
                </Timeline>
            </Spin>
        </div>
    );
}
