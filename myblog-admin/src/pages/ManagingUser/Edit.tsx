// @flow

import {PageContainer} from '@ant-design/pro-components';
import {Avatar, Card, message, Result} from 'antd';
import {Button, Form, Input} from 'antd';
import {useNavigate, useParams} from 'umi';
import {useState} from 'react';
import {getUser, resetUser} from '@/services/ant-design-pro/api';
import {useRequest} from 'ahooks';

// function BindingGithub({value = null, onChange = undefined}: { value?: null | API.UserFromGitHub, onChange?: Event }) {
//   const form = Form.useFormInstance();
//
//   function unbind() {
//     form.setFieldValue('githubProfile', null)
//   }
//
//   const {data, run, cancel, loading} = useRequest(
//     () => {
//     },
//     {
//       manual: true,
//       pollingInterval: 3000,
//       onSuccess: () => {
//         if (data)
//           cancel()
//       }
//     })
//
//   function bind() {
//     form.setFieldValue('githubProfile', null)
//   }
//
//   return (
//     <>
//       <Input value={value.username} disabled/>
//       {
//         value ?
//           <Button type="dashed" onClick={unbind} block>解除绑定</Button> :
//           <Button type="dashed" onClick={() => {
//           }} block>{loading ? '绑定Github账号' : '获取账号信息中...'}</Button>
//       }
//     </>
//   )
// }

export default function () {
  const navigate = useNavigate();
  const {userid} = useParams();
  const [form] = Form.useForm();
  useRequest(() => getUser({id: userid}), {
    onSuccess(data) {
      console.log(data);
      form.setFieldsValue({...data});
    },
  });

  const {runAsync: submit} = useRequest((body) => resetUser(body), {
    manual: true,
  });

  const [isCompleted, setIsCompleted] = useState(false);
  const onFinish = async (values: any) => {
    console.log('Success:', values);
    delete values['confirmedPassword'];
    try {
      await submit(values);
      setIsCompleted(true);
    } catch (e) {
      message.error('提交失败');
    }
    // navigate(-1);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <PageContainer>
      <Card
        style={{
          minHeight: 600,
        }}
      >
        <Avatar src="https://joeschmoe.io/api/v1/random"/>
        {!isCompleted ? (
          <Form
            style={{
              // margin:"auto",
              maxWidth: 600,
            }}
            form={form}
            name="basic"
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}
            initialValues={{}}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item label="ID" name="id" rules={[{required: true, message: '请输入ID'}]}>
              <Input type="text" disabled/>
            </Form.Item>
            <Form.Item
              label="用户名"
              name="username"
              rules={[{required: true, message: 'Please input your username!'}]}
            >
              <Input/>
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[{required: true, message: 'Please input your password!'}]}
            >
              <Input.Password/>
            </Form.Item>

            <Form.Item
              label="确认密码"
              name="confirmedPassword"
              rules={[
                {
                  required: true,
                  validator: async (rule, value) => {
                    if (form.getFieldValue('password') !== value)
                      throw new Error('两次密码不相等!');
                  },
                  message: '两次密码不相等!',
                },
              ]}
            >
              <Input.Password/>
            </Form.Item>
            {/*<Form.Item*/}
            {/*  label="Github绑定账号">*/}
            {/*  <BindingGithub/>*/}
            {/*</Form.Item>*/}
            <Form.Item wrapperCol={{offset: 8, span: 16}}>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <Result
            status="success"
            title="表单提交成功！"
            style={{
              minHeight: 900,
            }}
            extra={
              <Button type="primary" onClick={() => navigate(-1)}>
                返回上一页
              </Button>
            }
          />
        )}
      </Card>
    </PageContainer>
  );
}
