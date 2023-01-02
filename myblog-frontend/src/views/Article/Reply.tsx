import React, {useState} from "react";
import {
    Avatar,
    Button,
    message,
    Popconfirm,
    Space,
    Spin,
    Typography,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import {InputStatus} from "antd/es/_util/statusUtils";
import {GithubOutlined} from "@ant-design/icons";
import {atom, selector, useRecoilState, useRecoilValue} from "recoil";
import {addComment, currentUser, outLogin} from "../../config/api";
import {useLocalStorageState, useRequest} from "ahooks";

const {Title, Link, Text} = Typography;

const userState = atom({
    key: "userState",
    default: selector({
        key: "userState/default",
        get: async () => {
            try {
                return await currentUser();
            } catch (e) {
                console.error(e);
                return null;
            }
        },
    }),
});

type ReplyProps = {
    articleId: number;
    parentComment?: API.Comment;
    onFinish?: () => void;
};
export default function Reply({
                                  articleId,
                                  parentComment,
                                  onFinish,
                              }: ReplyProps) {
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    const user = useRecoilValue(userState);

    function handleGithubLogin() {
        localStorage.setItem("redirect", window.location.pathname);
        window.location.href = `/api/login/github`;
    }

    async function handleLogout() {
        try {
            await outLogin();
            window.location.href = window.location.href;
        } catch (e) {
            console.log("");
        }
    }

    const [msg, setMsg] = useState("");
    const [status, setStatus] = useState<InputStatus>("");

    // const {} = useRequest(()=>)

    async function handleSubmit() {
        try {
            await addComment({
                message: msg,
                articleId,
                parentId: parentComment?.id,
                rootId: parentComment?.rootId || parentComment?.id,
            });
            setMsg("");
            onFinish?.();
            message.success("提交成功");
        } catch (e) {
            console.log("");
        }
    }

    const placeholder = user ? "点击输入评论" : "请先登录";

    return (
        // <Space direction="vertical" size="small" style={{ display: "flex" }}>
        <div className="space-y-2">
            {user ? (
                <Space>
                    <Avatar src={user?.avatar}/>
                    <Text>{user?.name}</Text>
                    <Button type="text" size="small" onClick={handleLogout}>
                        登出
                    </Button>
                </Space>
            ) : null}
            <TextArea
                rows={4}
                value={msg}
                onChange={(e) => {
                    setStatus("");
                    setMsg(e.currentTarget.value);
                }}
                placeholder={placeholder}
                maxLength={200}
                showCount
                // style={{ width:  }}
                status={status}
                disabled={!user}
            />
            <div className="">
                {!user ? (
                    <Button onClick={handleGithubLogin}>
                        <GithubOutlined/>
                        GitHub登录留言
                    </Button>
                ) : (
                    <Button type="primary" onClick={handleSubmit}>
                        提交
                    </Button>
                )}
            </div>
        </div>
        // </Space>
    );
}
