import React, { useRef, useState } from 'react';
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Button, Tag, Image, Switch, Popconfirm, message } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import AccountEdit from './components/AccountEdit'
import { queryList, deleteCurrent, switchAccount } from './request'

type GithubIssueItem = {
  url: string;
  id: number;
  number: number;
  title: string;
  labels: {
    name: string;
    color: string;
  }[];
  state: string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  is_active?: number;
  category?: number;
};

const Page: React.FC = (props) => {
  const actionRef = useRef<ActionType>();
  const [editShow, seteditShow] = useState<boolean>(false)
  const [select, setselect] = useState<string>()
  const confirm = (id: string) => {
    deleteCurrent({
      k: id.toString()
    }).then(res => {
      if (res.code === 1) {
        message.success(res.msg)
        actionRef.current?.reload()
      }
    })
  }
  enum status {
    '待系统审核' = 'processing',
    '待媒体审核' = 'processing',
    '系统审核通过' = 'default',
    '媒体审核通过' = 'default',
    '系统审核失败' = 'error',
    '媒体审核失败' = 'error',
    '开启中' = 'success',
    '已关闭' = 'default',
    '已删除' = 'default'
  }
  const columns: ProColumns<GithubIssueItem>[] = [
    {
      dataIndex: 'id',
      title: 'id',
      width: 48,
      hideInSearch: true
    },
    {
      title: '投放账户ID',
      dataIndex: 'ad_acc_id',
      ellipsis: true,
      hideInSearch: true
    },
    {
      title: '人群包标题',
      dataIndex: 'title',
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'category',
      ellipsis: true,
      render: (_, re) => {
        return re.category === 0 ? '手动上传' : 'RTA'
      },
      hideInSearch: true
    },
    {
      title: '文件/RTA路径',
      dataIndex: 'url',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '匹配设备类型',
      dataIndex: 'device_type',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '文件大小(b)',
      dataIndex: 'filesize',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '设备数',
      dataIndex: 'device_num',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '添加时间',
      dataIndex: 'created_at',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '编辑时间',
      dataIndex: 'updated_at',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      width: 155,
      valueType: 'option',
      render: (text, record, _, action) => [
        <Button type="primary" onClick={() => {
          seteditShow(true)
          setselect(record?.id)
        }}>编辑</Button>,
        <Popconfirm title="您将要删除本条项目？" placement="bottom" onConfirm={() => confirm(record?.id)} okText="Yes" cancelText="No">
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
          params: T & {
            pageSize: number;
            current: number;
          },
          sort,
          filter,
        ) => {
          const msg = await queryList({
            page: params.current,
            limit: params.pageSize,
            title: params.title
          });
          return {
            data: msg.data,
            success: true,
            total: msg.count,
          };
        }}
        rowKey="id"
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
            上传人群包
          </Button>
        ]}
      />
      {editShow && <AccountEdit reload={() => actionRef.current?.reload()} Select={select} onCancel={() => seteditShow(false)} />}
    </>
  );
};
export default Page