// @flow
import {Button, Card, Popconfirm, Tag, Table, Space} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {useState} from 'react';
import type {PaginationProps} from 'antd';
import {useRequest} from 'ahooks';
import Search from 'antd/es/input/Search';
import {useNavigate} from 'react-router-dom';
import {deleteArticle, getArticleList} from '@/services/ant-design-pro/api';
import {PageContainer} from '@ant-design/pro-components';
import dayjs from 'dayjs';

export default function () {
  const navigate = useNavigate();

  const [dataSource, setDataSource] = useState<API.Article[]>([]);

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

  const {data: deletedData, run: runDelete} = useRequest((id) => deleteArticle({id}), {
    manual: true,
  });

  const {loading} = useRequest(
    () =>
      getArticleList({
        current: String(current),
        size: String(pageSize),
        params: JSON.stringify(searchParams),
      }),
    {
      onSuccess(data) {
        setDataSource([...data?.list]);
        setTotal(data.total);
      },
      refreshDeps: [current, pageSize, searchParams, deletedData],
    },
  );

  const columns: ColumnsType<API.Article> = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 320,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 200,
      render: (tags) => tags.map((tag: any) => <Tag>{tag.title}</Tag>),
      ellipsis: true,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      // textWrap: 'word-break',
      ellipsis: true,
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
      render: (_, record) => {
        return (
          <>
            <Button type="text" onClick={() => navigate(`/articles/edit/${record.id}`)}>
              编辑
            </Button>
            <Button type="text" onClick={() => navigate(`/articles/comments/${record.id}`)}>
              评论
            </Button>
            <Popconfirm
              placement="topLeft"
              title="确认删除？"
              onConfirm={() => runDelete(record.id)}
              okText="是"
              cancelText="否"
            >
              <Button type="text" danger>
                删除
              </Button>
            </Popconfirm>
          </>
        );
      },
      width: 300,
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
      <Space size="middle" direction="vertical" style={{}}>
        <Card>
          <Space size="middle">
            <Search
              placeholder="输入关键词搜索"
              onSearch={onSearch}
              style={{width: 200}}
              loading={loading}
            />
            <Button type="primary" onClick={() => navigate('/articles/edit/add')}>
              添加文章
            </Button>
          </Space>
        </Card>
        <Card
          style={{
            minHeight: 280,
          }}
        >
          {table}
        </Card>
      </Space>
    </PageContainer>
  );
}
