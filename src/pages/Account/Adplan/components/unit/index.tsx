import React, { useRef, useState } from 'react';
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Button, Tag, Badge, Switch, Popconfirm, message } from 'antd';
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
};

const Page: React.FC = (props) => {
  const actionRef = useRef<ActionType>();
  const [editShow, seteditShow] = useState<boolean>(false)
  const [pagesize, setpagesize] = useState<number>(10)
  const [select, setselect] = useState<string>()
  const confirm = (id: string) => {
    let form = new FormData()
    form.append('id', id)
    deleteCurrent(form).then(res => {
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
      title: '关键词',
      dataIndex: 'keywords',
      ellipsis: true,
      hideInTable: true
    },
    {
      title: '单元名',
      dataIndex: 'name',
      ellipsis: true,
      hideInSearch: true
    },
    {
      title: '所属计划',
      dataIndex: 'plan_name',
      ellipsis: true,
      hideInSearch: true
    },
    {
      title: '开关',
      dataIndex: 'status',
      hideInSearch: true,
      ellipsis: true,
      render: (r, re) => {
        return (
          <Switch checked={re.is_active === 1 ? true : false} onChange={() => {
            let form = new FormData()
            form.append('id', re?.id.toString())
            switchAccount(form).then(res => {
              if (res.code === 1) {
                message.success(res.msg)
                actionRef.current?.reload()
              }
            })
          }} />
        )
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInSearch: true,
      width: 120,
      filters: true,
      render: (_, item) => {
        return <Badge status={status[item.status]} text={item.status} />;
      },
    },
    {
      title: '消耗',
      dataIndex: 'used',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '总预算',
      dataIndex: 'budget_all',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '日预算',
      dataIndex: 'budget_day',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '转化',
      dataIndex: 'change',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '转化率',
      dataIndex: 'change_rate',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '点击',
      dataIndex: 'frequency_click',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '点击率',
      dataIndex: 'change_rate',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '出价',
      dataIndex: 'cost_value',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '曝光',
      dataIndex: 'frequency_show',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: 'CPM',
      dataIndex: 'cpm',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: 'CPC',
      dataIndex: 'cpc',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: 'CPA',
      dataIndex: 'cpa',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      width: 255,
      valueType: 'option',
      render: (text, record, _, action) => [
        <Button type="primary" disabled={record?.status === 1 ? true : false} onClick={() => {
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
            keywords: params.keywords
          });
          return {
            data: msg.data.list,
            success: true,
            total: msg.count,
          };
        }}
        rowKey="id"
        pagination={{
          pageSize: pagesize,
        }}
        dateFormatter="string"
        headerTitle={false}
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} onClick={() => {
            seteditShow(true)
            setselect('')
          }} type="primary">
            创建单元
          </Button>
        ]}
      />
      {editShow && <AccountEdit reload={() => actionRef.current?.reload()} Select={select} onCancel={() => seteditShow(false)} />}
    </>
  );
};
export default Page