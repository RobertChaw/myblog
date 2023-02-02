// @flow

import {PageContainer} from '@ant-design/pro-components';
import {Avatar, Card, message, Space, Typography, Upload} from 'antd';
import {Button, Input} from 'antd';
import {useNavigate, useParams} from 'umi';
import {useEffect, useState} from 'react';
import {getUser, resetUser} from '@/services/ant-design-pro/api';
import {useRequest} from 'ahooks';
import {UploadChangeParam} from 'antd/lib/upload/interface';

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
  const [user, setUser] = useState<API.User>({});

  const {run: load} = useRequest(() => getUser({id: userid}), {
    onSuccess(data) {
      console.log(data);
      setUser({...data});
    },
  });

  const [userNameEditable, setUserNameEditable] = useState(false);
  const [nameEditable, setNameEditable] = useState(false);
  const [passwordEditable, setPasswordEditable] = useState(false);

  const {run: submit} = useRequest((body) => resetUser(body), {
    manual: true,
    onSuccess() {
      message.success('提交成功');
    },
    onError() {
      message.error('提交失败');
    },
    onFinally() {
      load();
    },
  });

  function handleNameSubmit() {
    submit({name: user.name, id: userid});
    setNameEditable(false);
  }

  function handleUserNameSubmit() {
    submit({username: user.username, id: userid});
    setUserNameEditable(false);
  }

  function handlePasswordSubmit() {
    submit({password: user.password, id: userid});
    setPasswordEditable(false);
  }

  function handleUpload(info: UploadChangeParam) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      const url = info.file.response.data;
      submit({avatar: url, id: userid});
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <PageContainer>
      <Card
        style={{
          minHeight: 600,
        }}
      >
        <Space direction="vertical" size="large">
          <div>
            <Typography.Text>ID:</Typography.Text>
            <Space direction="horizontal" style={{display: 'flex'}}>
              <Input disabled value={user.id} style={{width: 240}}/>
            </Space>
          </div>
          <div>
            <Typography.Text>头像:</Typography.Text>
            <Space direction="horizontal" style={{display: 'flex'}}>
              <Avatar src={user.avatar}/>
              <Upload
                name="file"
                action="/api/upload"
                maxCount={1}
                showUploadList={false}
                onChange={handleUpload}
              >
                <Button>修改头像</Button>
              </Upload>
            </Space>
          </div>
          <div>
            <Typography.Text>登录名:</Typography.Text>
            <Space direction="horizontal" style={{display: 'flex'}}>
              <Input
                disabled={!userNameEditable}
                value={user.username}
                onChange={(e) => setUser({...user, username: e.target.value})}
                style={{width: 240}}
              />
              {!userNameEditable ? (
                <Button onClick={() => setUserNameEditable(true)} style={{width: 120}}>
                  修改登录名
                </Button>
              ) : (
                <Button onClick={handleUserNameSubmit}>提交</Button>
              )}
            </Space>
          </div>
          <div>
            <Typography.Text>用户名:</Typography.Text>
            <Space direction="horizontal" style={{display: 'flex'}}>
              <Input
                disabled={!nameEditable}
                value={user.name}
                onChange={(e) => setUser({...user, name: e.target.value})}
                style={{width: 240}}
              />
              {!nameEditable ? (
                <Button onClick={() => setNameEditable(true)} style={{width: 120}}>
                  修改用户名
                </Button>
              ) : (
                <Button onClick={handleNameSubmit}>提交</Button>
              )}
            </Space>
          </div>
          <div>
            <Typography.Text>密码:</Typography.Text>
            <Space direction="horizontal" style={{display: 'flex'}}>
              <Input.Password
                value={passwordEditable ? user.password : '********'}
                disabled={!passwordEditable}
                onChange={(e) => setUser({...user, password: e.target.value})}
                style={{width: 240}}
              />
              {!passwordEditable ? (
                <Button onClick={() => setPasswordEditable(true)} style={{width: 120}}>
                  修改密码
                </Button>
              ) : (
                <Button onClick={handlePasswordSubmit}>提交</Button>
              )}
            </Space>
          </div>
        </Space>
        <br/>
        <Button style={{marginTop: 40}} type="primary" onClick={() => navigate(-1)}>
          返回上一页
        </Button>
      </Card>
    </PageContainer>
  );
}
