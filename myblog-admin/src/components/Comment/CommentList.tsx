import * as React from 'react';
import {useEffect, useState} from 'react';
import {Avatar, Divider, List, Space, Tooltip, Typography} from 'antd';
import {absolute, relative} from '@/utils/dateformat';
import {CommentForm, Reply} from '@/components/Comment/Reply';

const {Text} = Typography;

interface CommentListProps {
  articleId: number;
  list: API.Comment[];
  style?: React.CSSProperties;
  onFinish: () => Promise<any>;
}

function CommentList({articleId, list, style, onFinish}: CommentListProps) {
  const [, setValue] = useState<number>(0);
  useEffect(() => {
    const timeout = setTimeout(() => setValue((prev) => prev + 1), 1000);
    return () => clearTimeout(timeout);
  });

  return (
    <>
      <List
        style={style}
        itemLayout="vertical"
        dataSource={list}
        renderItem={(item) => (
          <>
            <List.Item>
              <List.Item.Meta
                key={item.id}
                avatar={<Avatar src={item.user.avatar}/>}
                title={
                  <Space size="small">
                    <a href="Articles/components#">{item.user.username}</a>
                    {item?.parent?.user?.username && (
                      <a href="Articles/components#">@{item.parent.user.username}</a>
                    )}
                    <Tooltip title={absolute(item.createdAt)}>
                      <Text type="secondary">{relative(item.createdAt)}</Text>
                    </Tooltip>
                  </Space>
                }
                description={item.message}
              />
              <Reply articleId={articleId} parent={item} onFinish={onFinish}/>
            </List.Item>
            {/*/@ts-ignore*/}
            {item?.nodes?.length > 0 && (
              <>
                {/*/@ts-ignore*/}
                <CommentList
                  articleId={articleId}
                  list={item.nodes}
                  style={{marginLeft: 45}}
                  onFinish={onFinish}
                />
                <Divider style={{margin: 0}}/>
              </>
            )}
          </>
        )}
      />
    </>
  );
}

export function Comments({articleId, list, style, onFinish}: CommentListProps) {
  return (
    <>
      <CommentList articleId={articleId} list={list} style={style} onFinish={onFinish}/>
      <CommentForm articleId={articleId} onFinish={onFinish}/>
    </>
  );
}
