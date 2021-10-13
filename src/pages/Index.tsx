import React, { useRef, useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Statistic, Row, Col, Button, Card, Badge } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getOptions, queryList, getCount } from './request'
import styles from './home.less';
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
export default (): React.ReactNode => {
  const actionRef = useRef<ActionType>();
  const [count, setCount] = useState();
  const [loading, setloading] = useState(false);
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
        setloading(true)
      }
    })
    getCount().then(res => {
      if (res.code === 1) {
        setCount(res.data)
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
      title: '投放媒体',
      hideInSearch: true,
    },
    {
      dataIndex: 'category',
      title: '投放类型',
      hideInSearch: true,
    },
    {
      dataIndex: 'balance',
      title: '剩余金额',
      hideInSearch: true,
    },
    {
      title: '消耗情况',
      hideInSearch: true,
      render: (r, t) => {
        return (
          <div style={{ lineHeight: 1.5 }}>
            <div>今：{t.day_used || 0}</div>
            <div>昨：{t.yesterday_used || 0}</div>
          </div>
        )
      }
    },
    {
      title: '投放计划',
      hideInSearch: true,
      render: (r, t) => {
        return (
          <div style={{ lineHeight: 1.5 }}>
            <div>{t.plan_num || 0}个计划</div>
            <div>{t.unit_num || 0}个单元</div>
            <div>{t.design_num || 0}个创意</div>
          </div>
        )
      }
    },
    {
      title: '操作',
      valueType: 'option',
      width: 125,
      render: (text, record, _, action) => [
        <Button type="primary" disabled={record?.status === '开启中' ? false : true} onClick={() => {
          history.push(`/account/basic?id=${record.id}`)
        }}>投放管理</Button>,
      ],
    },
  ];
  return (
    <PageContainer pageHeaderRender={false} title={false} breadcrumbRender={false} ghost={false}>
      <Card style={{ marginBottom: 24, minWidth: 1200 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Row justify="start" style={{ minWidth: 600 }} gutter={2}>
            <Col span={6}>
              <Statistic title="剩余金额" prefix="￥" value={count?.balance} />
            </Col>
            <Col span={6}>
              <Statistic title="今日总消耗" value={count?.statistics?.today_cost} />
            </Col>
            <Col span={6}>
              <Statistic title="昨日总消耗" value={count?.statistics?.yestoday_cost} />
            </Col>
            <Col span={6}>
              <Statistic
                title="昨日消耗环比前日"
                value={count?.statistics?.yestoday_cost}
                precision={2}
                prefix={<ArrowUpOutlined />}
                suffix="%"
              />
            </Col>
          </Row>
          <Row justify="end" style={{ minWidth: 500 }} gutter={1}>
            <Col span={5}>
              <Statistic title="投放账户" suffix="个" value={count?.account_num} />
            </Col>
            <Col span={5}>
              <Statistic title="广告计划" suffix="个" value={count?.plan_num} />
            </Col>
            <Col span={5}>
              <Statistic title="广告单元" suffix="个" value={count?.unit_num} />
            </Col>
            <Col span={5}>
              <Statistic title="广告创意" suffix="个" value={count?.design_num} />
            </Col>
          </Row>
        </div>
      </Card>
      {loading ? <ProTable
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
          return {
            data: Object.values(msg.data.list),
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
          pageSize: 20
        }}
        search={{
          filterType: 'light'
        }}
        headerTitle={false}
        dateFormatter="string"
      /> : null}
    </PageContainer>
  );
};
