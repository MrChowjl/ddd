import React, { useRef, useState } from 'react';
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Button, Tag, Space, Badge, Popconfirm, message } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import AccountEdit from './components/AccountEdit'
import Qualifications from './components/Qualifications'
import { queryList, deleteCurrent } from './request'

type GithubIssueItem = {
  url: string;
  id: number;
  number: number;
  title: string;
  labels: {
    name: string;
    color: string;
  }[];
  status: number;
  state: string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
};

const Page: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [editShow, seteditShow] = useState<boolean>(false)
  const [qualyShow, setqualyShow] = useState<boolean>(false)
  const [select, setselect] = useState<string>()
  const confirm = (id: string) => {
    deleteCurrent({ k: id.toString() }).then(res => {
      if (res.code === 1) {
        message.success(res.msg)
        actionRef.current?.reload()
      }
    })
  }
  const statusTextMap = {
    '0': '等待审核',
    '1': '审核通过',
    '-1': '审核未过'
  }
  const statusMap = {
    '0': 'processing',
    '1': 'success',
    '-1': 'error',
  }
  const columns: ProColumns<GithubIssueItem>[] = [
    {
      dataIndex: 'id',
      title: 'id',
      width: 48,
    },
    {
      title: '广告主名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '具体公司名称',
      dataIndex: 'company',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      ellipsis: true,
      render: (_, item) => {
        return <Badge status={statusMap[item?.status.toString()]} text={statusTextMap[item?.status.toString()]} />;
      },
    },
    {
      title: '添加时间',
      dataIndex: 'created_at',
      valueType: 'dateTime',
      ellipsis: true,
    },
    {
      title: '操作',
      width: 235,
      valueType: 'option',
      render: (text, record, _, action) => [
        <Button type="primary" disabled={record?.status === 1 ? true : false} onClick={() => {
          seteditShow(true)
          setselect(record?.id)
        }}>编辑</Button>,
        <Button type="primary" disabled={record?.status === 1 ? true : false} onClick={() => {
          setqualyShow(true)
          setselect(record?.id)
        }}>资质</Button>,
        <Popconfirm title="您将要删除本条媒体？" placement="bottom" onConfirm={() => confirm(record?.id)} okText="Yes" cancelText="No">
          <Button>删除</Button>
        </Popconfirm>
      ]
    },
  ];

  return (
    <>
      <ProTable<any>
        columns={columns}
        actionRef={actionRef}
        request={async (
          // 第一个参数 params 查询表单和 params 参数的结合
          // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
          params: T & {
            pageSize: number;
            current: number;
          },
          sort,
          filter,
        ) => {
          // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
          // 如果需要转化参数可以在这里进行修改
          const msg = await queryList({
            page: params.current,
            limit: params.pageSize,
            sort: sort
          });
          return {
            data: msg.data,
            // success 请返回 true，
            // 不然 table 会停止解析数据，即使有数据
            success: true,
            // 不传会使用 data 的长度，如果是分页一定要传
            total: msg.count,
          };
        }}
        rowKey="id"
        search={false}
        form={{
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
                created_at: [values.startTime, values.endTime],
              };
            }
            return values;
          },
        }}
        pagination={{
          pageSize: 10,
        }}
        dateFormatter="string"
        headerTitle={false}
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} onClick={() => {
            seteditShow(true)
            setselect('')
          }} type="primary">
            添加广告主
          </Button>
        ]}
      />
      {editShow && <AccountEdit reload={() => actionRef.current?.reload()} Select={select} onCancel={() => seteditShow(false)} />}
      {qualyShow && <Qualifications reload={() => actionRef.current?.reload()} Select={select} onCancel={() => setqualyShow(false)} />}
    </>
  );
};
export default Page