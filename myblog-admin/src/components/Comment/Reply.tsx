import {useState} from 'react';
import {InputStatus} from 'antd/lib/_util/statusUtils';
import {useRequest} from 'ahooks';
import {addComment, delComment} from '@/services/ant-design-pro/api';
import {Button, message, Popconfirm, Space} from 'antd';
import TextArea from 'antd/es/input/TextArea';

interface CommentFormProps {
  articleId: number;
  parent?: API.Comment;
  onFinish?: () => Promise<any>;
}

export function CommentForm({articleId, parent, onFinish}: CommentFormProps) {
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState<InputStatus>('');
  // const {articleId} = useParams();
  const {runAsync: submit} = useRequest((body) => addComment({...body}), {
    manual: true,
  });

  async function handleSubmit() {
    if (!msg) {
      setStatus('error');
      message.error('评论不能为空!');
      return;
    }

    try {
      console.log(parent);
      await submit({
        message: msg,
        parentId: parent?.id,
        rootId: parent?.rootId || parent?.id,
        articleId,
      });
      message.success('提交成功');
      await onFinish?.();
      setMsg('');
    } catch (e) {
      message.error('提交失败');
      console.log(e);
    }
  }

  return (
    <Space direction="vertical" size="small" style={{display: 'flex'}}>
      <TextArea
        rows={4}
        value={msg}
        onChange={(e) => {
          setStatus('');
          setMsg(e.currentTarget.value);
        }}
        placeholder="点击输入评论"
        maxLength={200}
        showCount
        style={{width: 800}}
        status={status}
      />
      <Button type="primary" onClick={handleSubmit}>
        提交
      </Button>
    </Space>
  );
}

interface ReplyProps {
  articleId: number;
  parent?: API.Comment;
  onFinish?: () => Promise<any>;
}

export function Reply({articleId, parent, onFinish}: ReplyProps) {
  const [hidden, setHidden] = useState(true);

  const {runAsync: del} = useRequest((body) => delComment({...body}), {
    manual: true,
  });

  async function handleDelete() {
    try {
      await del({id: parent?.id});
      await onFinish?.();
      message.success('删除成功');
    } catch (e) {
      message.error('删除失败');
      console.log(e);
    }
  }

  return (
    <Space direction="horizontal" size="small" style={{display: 'flex'}}>
      {hidden ? (
        <>
          <Button type="text" onClick={() => setHidden(false)}>
            回复
          </Button>
          <Popconfirm
            placement="topLeft"
            title="确认删除？"
            onConfirm={() => {
              handleDelete();
            }}
            okText="是"
            cancelText="否"
          >
            <Button type="text" danger>
              删除
            </Button>
          </Popconfirm>
        </>
      ) : (
        <>
          <Space direction="vertical" size="small" style={{display: 'flex'}}>
            <Button type="text" onClick={() => setHidden(true)}>
              {' '}
              隐藏{' '}
            </Button>
            <CommentForm
              parent={parent}
              articleId={articleId}
              onFinish={async () => {
                await onFinish?.();
                setHidden(true);
              }}
            />
          </Space>
        </>
      )}
    </Space>
  );
}
