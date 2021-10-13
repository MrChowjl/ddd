import React, { useRef, useState, useEffect } from 'react';
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Button, Tag, Space, Popconfirm, Badge, Switch, message } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import AccountEdit from './components/AccountEdit'
import { getOptions, queryList, acountDelete, switchAccount } from './request'
import { history } from 'umi';
type Item = {
  url: string;
  id: number;
  number: number;
  title: string;
  labels: {
    name: string;
    color: string;
  }[];
  status: string;
  state: string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
};

const Page: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [editShow, seteditShow] = useState<boolean>(false)
  const [currentSelected, setcurrentSelected] = useState<Item | undefined>()
  const [options, setoptions] = useState<{
    Media: { status: number; text: string } | {},
    Adhost: { status: number; text: string } | {},
    Cate: { status: number; text: string } | {},
    Status: { status: number; text: string } | {},
  }>({
    Media: {},
    Adhost: {},
    Cate: {},
    Status: {},
  })
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
  useEffect(() => {
    getOptions().then(res => {
      if (res.code === 1) {
        let Media = {}
        let Adhost = {}
        let Cate = {}
        let Status = {}
        res.data.adx?.forEach(itm => {
          Media[itm.id] = {
            status: itm.id,
            text: itm.name
          }
        })
        res.data.category?.forEach(itm => {
          Cate[itm.id] = {
            status: itm.id,
            text: itm.name
          }
        })
        res.data.status?.forEach(itm => {
          Status[itm.id] = {
            status: itm.id,
            text: itm.name
          }
        })
        res.data.adv?.forEach(itm => {
          Adhost[itm.id] = {
            status: itm.id,
            text: itm.name
          }
        })
        setoptions({ ...options, Media, Cate, Status, Adhost })
      }
    })
  }, [])
  const columns: ProColumns<Item>[] = [
    {
      title: '所有广告主',
      hideInTable: true,
      valueType: 'select',
      name: 'adv_id',
      valueEnum: options.Adhost,
    },
    {
      title: '所有媒体',
      hideInTable: true,
      valueType: 'select',
      name: 'adx_id',
      valueEnum: options.Media,
    },
    {
      title: '投放类型',
      hideInTable: true,
      valueType: 'select',
      name: 'type',
      valueEnum: options.Cate,
    },
    {
      title: '所有状态',
      hideInTable: true,
      valueType: 'select',
      name: 'status',
      valueEnum: options.Status,
    },
    {
      dataIndex: 'id',
      title: 'id',
      hideInSearch: true,
      width: 48,
    },
    {
      title: '投放账户名称',
      dataIndex: 'name',
      hideInSearch: true,
      width: 150,
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '开关',
      dataIndex: 'status',
      hideInSearch: true,
      ellipsis: true,
      render: (r, re) => {
        return (
          <Switch checked={re.status === '开启中' ? true : false} onChange={() => {
            switchAccount(
              { aid: re.id }
            ).then(res => {
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
      dataIndex: 'adv_name',
      title: '广告主',
      hideInSearch: true,
    },
    {
      dataIndex: 'adx_name',
      title: '媒体',
      hideInSearch: true,
    },
    {
      dataIndex: 'category',
      title: '投放类型',
      hideInSearch: true,
    },
    {
      dataIndex: 'budget_all',
      title: '总预算',
      hideInSearch: true,
    },
    {
      dataIndex: 'budget_day',
      title: '日预算',
      hideInSearch: true,
    },
    {
      dataIndex: 'balance',
      title: '剩余金额',
      hideInSearch: true,
    },
    {
      dataIndex: 'day_used',
      title: '今日消耗',
      hideInSearch: true,
    },
    {
      dataIndex: 'yesterday_used',
      title: '昨日消耗',
      hideInSearch: true,
    },
    {
      dataIndex: 'plan_num',
      title: '计划数',
      hideInSearch: true,
    },
    {
      dataIndex: 'unit_num',
      title: '单元数',
      hideInSearch: true,
    },
    {
      dataIndex: 'design_num',
      title: '创意数',
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 235,
      render: (text, record, _, action) => [
        <Button type="primary" disabled={record?.status === '开启中' ? false : true} onClick={() => {
          history.push(`/account/basic?id=${record.id}`)
        }}>投放</Button>,
        <Button type="primary" disabled={record?.status === '待系统审核' || record?.status === '系统审核失败' ? false : true} onClick={() => {
          seteditShow(true)
          setcurrentSelected(record)
        }}>编辑</Button>,
        <Popconfirm title="您将要删除本条媒体？" placement="bottom" onConfirm={async () => {
          let form = new FormData()
          form.append('id', record.id)
          let res = await acountDelete(form)
          if (res.code === 1) {
            message.success(res.msg)
            actionRef.current?.reload()
          }
        }} okText="Yes" cancelText="No">
          <Button>删除</Button>
        </Popconfirm>
      ],
    },
  ];
  return (
    <>
      <ProTable
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
            adv_id: params.adv_id,
            adx_id: params.adx_id,
            type: params.type,
            status: params.status
          });
          console.log(msg)

          return {
            data: msg.data.list,
            // success 请返回 true，
            // 不然 table 会停止解析数据，即使有数据
            success: true,
            // 不传会使用 data 的长度，如果是分页一定要传
            total: msg.data.count,
          };
        }}
        editable={{
          type: 'multiple',
        }}
        rowKey="id"
        pagination={{
          pageSize: 10,
        }}
        // search={{
        //   // filterType: 'light'
        // }}
        headerTitle={false}
        dateFormatter="string"
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} onClick={() => {
            seteditShow(true)
            setcurrentSelected(undefined)
          }} type="primary">
            创建投放账户
          </Button>
        ]}
      />
      {editShow && <AccountEdit currentSelected={currentSelected} onCancel={() => seteditShow(false)} reFresh={() => actionRef.current?.reload()} />}
    </>
  );
};
export default Page