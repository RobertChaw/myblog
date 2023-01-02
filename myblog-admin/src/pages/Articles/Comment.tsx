// @flow
// import * as React from 'react';
import {PageContainer} from '@ant-design/pro-components';
import {Card} from 'antd';
import {useRequest} from 'ahooks';
import {getCommentsList} from '@/services/ant-design-pro/api';
import {useParams} from '@@/exports';
import {Comments} from '@/components/Comment/CommentList';

export default function () {
  const {articleId} = useParams();
  const {data: list, runAsync} = useRequest(() => getCommentsList({articleId}));

  return (
    <PageContainer>
      <Card
        style={{
          minHeight: 600,
        }}
      >
        <Comments articleId={Number(articleId)} list={list as API.Comment[]} onFinish={runAsync}/>
      </Card>
    </PageContainer>
  );
}
