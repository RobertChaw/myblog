// @flow
import {PageContainer} from '@ant-design/pro-components';
import {Button, Card, message, Popconfirm, Table} from 'antd';
import {useRequest} from "ahooks";
import {deleteTag, getTagsList} from "@/services/ant-design-pro/api";
import {ColumnsType} from "antd/es/table";

export default function () {
  const {data, runAsync: refresh} = useRequest(() => getTagsList());

  const {run: runDelete} = useRequest((id) => deleteTag({id}), {
    manual: true,
    onSuccess() {
      message.success('删除成功');
    }, onError() {
      message.error('删除失败');
    },
    onFinally() {
      refresh()
    }
  });

  const columns: ColumnsType<API.Tag> = [
    {
      title: 'id',
      dataIndex: 'id',
    },
    {
      title: '名称',
      dataIndex: 'title',
    },
    {
      title: '操作',
      dataIndex: '',
      key: 'action',
      render: (_, record) => {
        return (
          <>
            <Popconfirm
              placement="topLeft"
              title={`确认删除?(关联文章将会把标签移除)`}
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
  return (
    <PageContainer>
      <Card
        style={{
          minHeight: 600,
        }}
      >
        <Table
          columns={columns}
          dataSource={data}
        />
      </Card>
    </PageContainer>
  );
}
