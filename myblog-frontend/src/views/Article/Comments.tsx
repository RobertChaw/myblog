import {
    Avatar,
    Button,
    Divider,
    List,
    Space,
    Tooltip,
    Typography,
} from "antd";
import React, {useEffect, useState} from "react";
import {absolute, relative} from "../../utils/dateformat";
import Reply from "./Reply";
import {useRequest} from "ahooks";
import {getCommentsList} from "../../config/api";

const {Text, Link} = Typography;

type CommentsProps = {
    articleId: number;
};
export default function Comments({articleId}: CommentsProps) {
    const [list, setList] = useState<API.Comment[]>([]);
    const {run} = useRequest(() => getCommentsList({articleId}), {
        onSuccess(data) {
            if (!data) return;
            setList([...data]);
        },
        refreshDeps: [articleId],
    });

    function refresh() {
        run();
    }

    return (
        <div>
            <CommentsList articleId={articleId} list={list} onFinish={refresh}/>
            <Divider style={{margin: 0, paddingBottom: 12}}/>
            <Reply articleId={articleId} onFinish={refresh}/>
        </div>
    );
}

type CommentsListProps = {
    articleId: number;
    list: API.Comment[];
    style?: React.CSSProperties;
    onFinish?: () => void;
};

function CommentsList({articleId, list, style, onFinish}: CommentsListProps) {
    return (
        <List
            style={style}
            itemLayout="vertical"
            dataSource={list}
            renderItem={(item) => (
                <CommentItem articleId={articleId} item={item} onFinish={onFinish}/>
            )}
        />
    );
}

type CommentItemProps = {
    articleId: number;
    item: API.Comment;
    onFinish?: () => void;
};

function CommentItem({articleId, item, onFinish}: CommentItemProps) {
    const [, setValue] = useState<number>(0);
    useEffect(() => {
        const timeout = setTimeout(() => setValue((prev) => prev + 1), 1000);
        return () => clearTimeout(timeout);
    });

    const user = item?.user;
    const parentUser = item?.parent?.user;
    const title = (
        <Space size="small">
            <a
                href={user?.url}
                className="text-black hover:text-[#1677ff] hover:underline hover:decoration-[#1677ff]"
            >
                {`${user?.name} ${user?.isAdmin ? "(管理员)" : ""}`}
            </a>
            {parentUser && (
                <a
                    href={parentUser?.url}
                    className="text-black hover:text-[#1677ff] hover:underline hover:decoration-[#1677ff]"
                >
                    @{`${parentUser?.name} ${parentUser?.isAdmin ? "(管理员)" : ""}`}
                </a>
            )}
            <Tooltip title={item.createdAt && absolute(item.createdAt)}>
                <Text type="secondary">
                    {item.createdAt && relative(item.createdAt)}
                </Text>
            </Tooltip>
        </Space>
    );

    const avatar = <Avatar src={user?.avatar}/>;
    const description = (
        <Tooltip title={item.createdAt && absolute(item.createdAt)}>
            <Text type="secondary">{item.createdAt && relative(item.createdAt)}</Text>
        </Tooltip>
    );

    const [hidden, setHidden] = useState(true);
    let reply = null;
    if (hidden) {
        reply = <Button onClick={() => setHidden(false)}>回复</Button>;
    } else {
        reply = (
            <>
                <Button onClick={() => setHidden(true)}>隐藏</Button>
                <Reply
                    articleId={articleId}
                    parentComment={item}
                    onFinish={() => {
                        onFinish?.();
                        setHidden(true);
                    }}
                />
            </>
        );
    }

    let children = null;
    if (item?.nodes?.length) {
        children = (
            <>
                <Divider style={{margin: 12}}/>
                <div className="w-full shrink">
                    <CommentsList
                        articleId={articleId}
                        list={item.nodes as API.Comment[]}
                        style={{marginLeft: 8}}
                        onFinish={onFinish}
                    />
                </div>
                {/*</div>*/}
            </>
        );
    }
    return (
        <List.Item>
            <List.Item.Meta
                key={item.id}
                avatar={avatar}
                title={title}
                // description={description}
            />
            <Space direction="vertical" size="small" style={{display: "flex"}}>
                {item.message}
                {reply}
            </Space>
            {children}
        </List.Item>
    );
}
