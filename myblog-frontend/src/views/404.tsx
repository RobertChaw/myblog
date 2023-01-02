import React from "react";
import {Button, Result} from "antd";
import {useNavigate} from "react-router-dom";

export default function Error404() {
    const navigate = useNavigate();
    return (
        <Result
            className="m-0 h-screen w-screen bg-white"
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={
                <Button type="primary" onClick={() => navigate(-1)}>
                    返回上一页
                </Button>
            }
        />
    );
}
