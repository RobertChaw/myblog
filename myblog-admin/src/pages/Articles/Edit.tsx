import {Card, Button, Select, Form, Input, Spin, Result} from 'antd';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import {useState} from 'react';
import {
  createArticle,
  getArticle,
  getTagsList,
  updateArticle,
  uploadImage,
} from '@/services/ant-design-pro/api';
import {useNavigate, useParams} from 'umi';
import {useRequest} from 'ahooks';
import {PageContainer} from '@ant-design/pro-components';
import 'github-markdown-css'

const Editor = ({value = '', onChange = undefined}: any) => {
  const form = Form.useFormInstance();
  const mdParser = new MarkdownIt(/* Markdown-it options */);

  function handleEditorChange({html, text}: any) {
    // console.log('handleEditorChange', html, text);
    onChange?.(text);
    const dom = document.createElement('div');
    dom.innerHTML = html;
    form.setFieldValue('description', dom.innerText.substring(0, 80));
  }

  async function handleImageUpload(file: File) {
    console.log(file);
    return uploadImage(file);
  }

  return (
    <div style={{}}>
      <MdEditor
        value={value}
        style={{minHeight: '700px', maxHeight: 'auto'}}
        className=""
        renderHTML={(text) => mdParser.render(text)}
        onChange={handleEditorChange}
        onImageUpload={handleImageUpload}
        htmlClass="markdown-body"
      />
    </div>
  );
};

export default function () {
  const navigate = useNavigate();
  const {articleId} = useParams();
  const [form] = Form.useForm();
  const isAdd = articleId === 'add';

  const initialValues = {
    id: Number(articleId),
  };

  useRequest(() => getArticle({id: articleId}), {
    onSuccess(data) {
      form.setFieldsValue({
        // @ts-ignore
        title: data.title,
        // @ts-ignore
        content: data.content,
        // @ts-ignore
        description: data.description,
        // @ts-ignore
        tags: data.tags.map((value) => value.title),
      });
    },
    ready: !isAdd,
  });

  const {loading, runAsync} = useRequest(
    (title, tags, content, description, id) => {
      if (isAdd) return createArticle({title, tags, content, description});
      return updateArticle({id, title, tags, content, description});
    },
    {
      manual: true,
    },
  );

  const [isCompleted, setIsCompleted] = useState(false);
  const onFinish = async (values: any) => {
    console.log('Success:', values);
    const {id, title, tags, content, description} = values;
    runAsync(title, tags, content, description, id).then(() => {
      // navigate(-1)
      setIsCompleted(true);
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const [tagOptions, setTagOptions] = useState<any>([]);
  useRequest(() => getTagsList(), {
    onSuccess(data) {
      const tags = data.map((value) => ({
        value: value?.title,
        label: value?.title,
      }));
      setTagOptions(tags);
    },
  });

  return (
    <PageContainer header={{title: isAdd ? '??????????????????' : '??????????????????'}}>
      <Card>
        <Spin spinning={loading} delay={500}>
          {!isCompleted ? (
            <Form
              layout="vertical"
              form={form}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              initialValues={initialValues}
            >
              {!isAdd && (
                <Form.Item label="ID" name="id" rules={[{required: true, message: '?????????ID'}]}>
                  <Input type="text" disabled/>
                </Form.Item>
              )}
              <Form.Item
                label="??????"
                name="title"
                rules={[{required: true, message: '???????????????'}]}
              >
                <Input type="text"/>
              </Form.Item>
              <Form.Item label="??????" name="tags">
                <Select mode="tags" placeholder="????????????..." options={tagOptions}/>
              </Form.Item>
              <Form.Item
                label="??????"
                name="content"
                rules={[{required: true, message: '?????????????????????'}]}
              >
                <Editor/>
              </Form.Item>
              <Form.Item name="description" hidden/>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  ??????
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <Result
              status="success"
              title="?????????????????????"
              style={{
                minHeight: 900,
              }}
              // subTitle={`id: ${data.id}, title: ${data.title}`}
              extra={
                <Button type="primary" onClick={() => navigate(-1)}>
                  ???????????????
                </Button>
              }
            />
          )}
        </Spin>
      </Card>
    </PageContainer>
  );
}
