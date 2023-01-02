// @flow
import {useState} from 'react';
import {PageContainer} from '@ant-design/pro-components';
import {Button, Card, message, PaginationProps, Space, Table} from 'antd';
import {usePagination, useRequest} from 'ahooks';
import {getUsersList, resetUser} from '@/services/ant-design-pro/api';
import {ColumnsType} from 'antd/es/table';
import dayjs from 'dayjs';
import {Typography} from 'antd';
import {useNavigate} from 'umi';
import Search from 'antd/es/input/Search';

const {Link} = Typography;

export default function () {
  const navigate = useNavigate();
  const [reload, setReload] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);

  const PaginationOnChange: PaginationProps['onShowSizeChange'] = (cur, pSize) => {
    console.log(cur, pSize);
    setCurrent(cur);
    setPageSize(pSize);
  };

  const pagination = {
    defaultCurrent: current,
    defaultPageSize: pageSize,
    total,
    onChange: PaginationOnChange,
    showSizeChanger: true,
  };

  const [searchParams, setSearchParams] = useState({q: ''});

  function onSearch(value: string) {
    setCurrent(1);
    setSearchParams({q: value});
  }

  const {
    data: resetRes,
    run: updateUser,
    loading: isUpdating,
  } = useRequest((user) => resetUser({...user}), {
    manual: true,
  });
  const banUser = (id: string) => {
    updateUser({id, isBanned: true});
    message.info('提交成功');
  };
  const unbanUser = (id: string) => {
    updateUser({id, isBanned: false});
    message.info('提交成功');
  };

  const [dataSource, setDataSource] = useState<API.User[]>([]);
  const {loading} = useRequest(
    () =>
      getUsersList({
        current: String(current),
        size: String(pageSize),
        params: JSON.stringify(searchParams),
      }),
    {
      onSuccess(data) {
        setDataSource([...data?.usersList]);
        setTotal(data.total);
      },
      refreshDeps: [current, pageSize, searchParams, reload, resetRes],
    },
  );

  const columns: ColumnsType<API.User> = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '登录名',
      dataIndex: 'username',
      key: 'username',
      width: 100,
    },
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: '管理员',
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      width: 100,
      render: (isAdmin) => (isAdmin ? '是' : '否'),
    },
    {
      title: 'Github账号',
      dataIndex: 'url',
      key: 'url',
      width: 100,
      render: (url) =>
        url ? (
          <Link href={url} target="_blank">
            链接
          </Link>
        ) : (
          '/'
        ),
    },
    {
      title: '修改时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
      width: 250,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
      width: 250,
    },
    {
      title: '操作',
      dataIndex: '',
      key: 'action',
      render: (_, user) => {
        return (
          <>
            {user.isAdmin && (
              <Button type="text" onClick={() => navigate(`/managingUser/edit/${user.id}`)}>
                修改
              </Button>
            )}
            {!user.isAdmin && !user.isBanned && (
              <Button type="text" onClick={() => banUser(user.id)} danger>
                禁用
              </Button>
            )}
            {!user.isAdmin && user.isBanned && (
              <Button type="text" onClick={() => unbanUser(user.id)}>
                恢复
              </Button>
            )}
          </>
        );
      },
      width: 200,
    },
  ];
  const table = (
    <Table
      dataSource={dataSource}
      columns={columns}
      pagination={pagination}
      loading={loading}
      rowKey={(record) => `${record.id}`}
    />
  );

  return (
    <PageContainer>
      <Space size="middle" direction="vertical" style={{display: 'flex'}}>
        <Card>
          <Search
            placeholder="输入关键词搜索"
            onSearch={onSearch}
            style={{width: 200}}
            loading={loading}
          />
        </Card>
        <Card
          style={{
            minHeight: 600,
          }}
        >
          {table}
        </Card>
      </Space>
    </PageContainer>
  );
}
