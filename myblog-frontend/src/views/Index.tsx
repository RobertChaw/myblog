import React, {useEffect, useState} from "react";
import {Button, message, Skeleton, Spin, Tooltip, Typography} from "antd";
import {MessageOutlined, EyeOutlined} from "@ant-design/icons";
import {Avatar, List, Space} from "antd";
import {useRequest} from "ahooks";
import {getArticleList} from "../config/api";
import {useNavigate} from "react-router-dom";
import {absolute, relative} from "../utils/dateformat";

const {Title, Link, Text, Paragraph} = Typography;
const IconText = ({icon, text}: { icon: React.ReactNode; text: string }) => (
    <Space>
        {icon}
        {text}
    </Space>
);

export default function Index() {
    const navigate = useNavigate();
    const [initLoading, setInitLoading] = useState(true);
    // const [loading, setLoading] = useState(false);
    const [list, setList] = useState<API.Article[]>([]);
    const [total, seTotal] = useState(0);
    const [data, setData] = useState<Array<API.Article & API.Loading>>([]);
    const [current, setCurrent] = useState(0);
    const [size, setSize] = useState(10);
    const hasMore = current * size < total;

    const {runAsync, loading} = useRequest(
        () => getArticleList({current: current + 1, size}),
        {
            onBefore() {
                setInitLoading(false);
            },
            onSuccess(data) {
                if (!data) return;
                seTotal(data.total as number);
                setList((prev) => prev.concat(data.list as API.Article[]));
                setCurrent((prev) => prev + 1);
            },
        }
    );

    useEffect(() => {
        if (!loading) return;
        const empties = [...Array(size)].map((_) => ({
            loading: true,
        }));
        setData((prev) => prev.concat(empties));
    }, [loading]);

    useEffect(() => {
        setData([...list]);
    }, [list]);
    const onLoadMore = async () => {
        try {
            await runAsync();
        } catch (e) {
            message.error("请求失败");
            console.warn(e);
        }
        // setLoading(true);
    };

    const loadMore =
        !initLoading && !loading && hasMore ? (
            <div
                style={{
                    textAlign: "center",
                    marginTop: 12,
                    height: 32,
                    lineHeight: "32px",
                }}
            >
                <Button onClick={onLoadMore}>loading more</Button>
            </div>
        ) : null;

    return (
        <>
            <div className="relative">
                {/*{`用户:${useRecoilValue(userState)}`}*/}
                <Spin spinning={initLoading}>
                    <List
                        className="pb-4"
                        itemLayout="vertical"
                        size="large"
                        loadMore={loadMore}
                        dataSource={data}
                        renderItem={(item) =>
                            item?.loading ? (
                                <List.Item>
                                    <Skeleton
                                        title={true}
                                        paragraph={{rows: 4}}
                                        loading={item.loading}
                                        active
                                    ></Skeleton>
                                </List.Item>
                            ) : (
                                <List.Item
                                    className="transition-all duration-300 hover:cursor-pointer hover:bg-[#ececec] hover:text-[1677ff] "
                                    onClick={() => {
                                        navigate(`/index/article/${item.id}`);
                                    }}
                                    key={item.id}
                                    actions={[
                                        <IconText
                                            icon={
                                                <Tooltip title="观看">
                                                    <EyeOutlined/>
                                                </Tooltip>
                                            }
                                            text={`${item?.viewCount}`}
                                            key="list-vertical-like-o"
                                        />,
                                        <IconText
                                            icon={
                                                <Tooltip title="留言">
                                                    <MessageOutlined/>
                                                </Tooltip>
                                            }
                                            text={`${item?.comments?.length}`}
                                            key="list-vertical-message"
                                        />,
                                    ]}
                                    // extra={
                                    //   <img
                                    //     width={272}
                                    //     alt="logo"
                                    //     src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                                    //   />
                                    // }
                                >
                                    {/*<List.Item.Meta title={<Title level={2}>{item.title}</Title>} />*/}
                                    <div className="flex items-center justify-between">
                                        <Title level={2}>{item.title}</Title>
                                        <Tooltip title={absolute(item?.createdAt || "1970")}>
                                            <Text type="secondary" className="">
                                                {relative(item?.createdAt || "1970")}
                                            </Text>
                                        </Tooltip>
                                    </div>
                                    <div className="max-h-[84px] overflow-hidden text-ellipsis">
                                        <Text className="">{item.description}</Text>
                                    </div>
                                </List.Item>
                            )
                        }
                    />
                </Spin>
            </div>
        </>
    );
}
