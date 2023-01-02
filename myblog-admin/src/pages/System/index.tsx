// @flow
import {PageContainer} from '@ant-design/pro-components';
import {Button, Card, message, Space} from 'antd';
import {useRequest} from 'ahooks';
import {deleteArticle, getAnncmnt, updateAnncmnt} from '@/services/ant-design-pro/api';
import TextArea from 'antd/es/input/TextArea';
import {useState} from 'react';

export default function () {
  const [msg, setMsg] = useState('');

  useRequest(() => getAnncmnt(), {
    onSuccess(data) {
      setMsg(data);
    },
  });
  const {run: submit} = useRequest((anncmnt) => updateAnncmnt({anncmnt}), {
    manual: true,
    onSuccess() {
      message.success('修改成功');
    },
    onError() {
      message.warn('修改失败');
    },
  });

  function handleSubmit() {
    submit(msg);
  }

  return (
    <PageContainer>
      <Card
        title="公告设置"
        style={{
          minHeight: 600,
        }}
      >
        <Space direction="vertical">
          <TextArea
            rows={4}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            style={{
              width: '24rem',
            }}
            showCount
            maxLength={100}
          />
          <Button onClick={handleSubmit} type="primary">
            提交
          </Button>
        </Space>
      </Card>
    </PageContainer>
  );
}
