import {PageContainer} from '@ant-design/pro-components';
import {Button, Card, message, Result, Space} from 'antd';
import {getAbout, getCommentsList, updateAbout, uploadImage} from '@/services/ant-design-pro/api';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import {useState} from 'react';
// import {useNavigate} from "@@/exports";
import {useRequest} from 'ahooks';
import {Comments} from '@/components/Comment/CommentList';

interface EditorProps {
  value: string;
  onChange?: (text: string) => any;
}

const Editor = ({value = '', onChange = undefined}: EditorProps) => {
  const mdParser = new MarkdownIt(/* Markdown-it options */);

  function handleEditorChange({html, text}: any) {
    // console.log('handleEditorChange', html, text);
    onChange?.(text);
    const dom = document.createElement('div');
    dom.innerHTML = html;
  }

  async function handleImageUpload(file: File) {
    console.log(file);
    return uploadImage(file);
  }

  return (
    <div style={{}}>
      <MdEditor
        value={value}
        style={{minHeight: 700, maxHeight: 'auto'}}
        renderHTML={(text) => mdParser.render(text)}
        onChange={handleEditorChange}
        onImageUpload={handleImageUpload}
      />
    </div>
  );
};
export default function () {
  // const navigate = useNavigate();
  const [isCompleted, setIsCompleted] = useState(false);
  const [content, setContent] = useState('');

  const {data: commentsList, runAsync: getComments} = useRequest(
    (articleId) => {
      return getCommentsList({articleId});
    },
    {
      manual: true,
    },
  );

  const {data: article} = useRequest(() => getAbout(), {
    onSuccess(data) {
      setContent(data.content);
      getComments(data.id);
    },
  });

  const {runAsync} = useRequest(
    (body) =>
      updateAbout({
        ...body,
      }),
    {
      manual: true,
    },
  );

  function handleChange(text: string) {
    setContent(text);
  }

  async function handleClick() {
    try {
      await runAsync({content});
      message.success('提交成功');
      setIsCompleted(true);
    } catch (e) {
      message.error('提交失败');
      console.log(e);
    }
  }

  return (
    <PageContainer>
      <Space direction="vertical" size="middle" style={{display: 'flex'}}>
        <Card
          title="内容"
          style={{
            minHeight: 600,
          }}
        >
          {!isCompleted ? (
            <Space direction="vertical" size="middle" style={{display: 'flex'}}>
              <Editor value={content} onChange={handleChange}/>
              <Button type="primary" onClick={handleClick}>
                提交
              </Button>
            </Space>
          ) : (
            <Result
              status="success"
              title="表单提交成功！"
              style={{
                minHeight: 900,
              }}
              // subTitle={`id: ${data.id}, title: ${data.title}`}
              extra={
                <Button type="primary" onClick={() => setIsCompleted(false)}>
                  返回上一页
                </Button>
              }
            />
          )}
        </Card>

        <Card
          title="评论区"
          style={{
            minHeight: 600,
          }}
        >
          <Comments
            list={commentsList as API.Comment[]}
            articleId={article?.id}
            onFinish={async () => {
              if (article) await getComments(article.id);
            }}
          />
        </Card>
      </Space>
    </PageContainer>
  );
}
