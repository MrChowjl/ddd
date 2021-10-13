import React, { useRef, useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Statistic, Row, Col, Button, Card, Tabs } from 'antd';
import { DualAxes } from '@ant-design/charts';
const { TabPane } = Tabs;
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import {
  QueryFilter,
  ProFormText,
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormDateTimePicker,
} from '@ant-design/pro-form';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { queryList, getCount, getAccount, getPlan, getUnit, getCreate } from './request'
import styles from './home.less';
import { history } from 'umi';
import moment from 'moment';
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
  const [account, setAccount] = useState()
  const [data, setdatalist] = useState()
  const [currentaccount, setcurrentaccount] = useState()
  const [plan, setPlan] = useState()
  const [currentplan, setcurrentplan] = useState()
  const [unit, setunit] = useState()
  const [currentunit, setcurrentunit] = useState()
  const [create, secreate] = useState()
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
    getAccount().then(res => {
      if (res.code === 1) {
        setAccount(res.data.list?.map((itm: any) => {
          return {
            label: itm.name,
            value: itm.id
          }
        }))
      }
    })
  }, [])
  useEffect(() => {
    currentaccount && getPlan({
      acc_id: currentaccount,
      status: 3
    }).then(res => {
      if (res.code === 1) {
        setPlan(res.data.list?.map((itm: any) => {
          return {
            label: itm.name,
            value: itm.id
          }
        }))
      }
    })
  }, [currentaccount])
  useEffect(() => {
    currentplan && currentaccount && getUnit({
      acc_id: currentaccount,
      status: 3
    }).then(res => {
      if (res.code === 1) {
        setunit(res.data.list?.filter((it: any) => it.plan_id === currentplan).map((itm: any) => {
          return {
            label: itm.name,
            value: itm.id
          }
        }))
      }
    })
  }, [currentplan])
  useEffect(() => {
    currentunit && currentaccount && getCreate({
      acc_id: currentaccount,
      status: 3
    }).then(res => {
      if (res.code === 1) {
        secreate(res.data.list?.map((itm: any) => {
          return {
            label: itm.name,
            value: itm.id
          }
        }))
      }
    })
  }, [currentunit])
  const columns: ProColumns<Item>[] = [
    {
      title: '所属账户',
      dataIndex: 'account_name',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '所属计划',
      dataIndex: 'plan_name',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '所属单元',
      dataIndex: 'unit_name',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '时间',
      hideInSearch: true,
      ellipsis: true,
      width: 150,
      render: (r, t) => {
        return moment(t.time_sign * 1000).format('yyyy-MM-DD HH:mm:ss')
      }
    },
    {
      dataIndex: 'cost_num',
      title: '消耗',
      hideInSearch: true,
    },
    {
      dataIndex: 'show_num_pv',
      title: '曝光',
      hideInSearch: true,
    },
    {
      dataIndex: 'cpm',
      title: 'CPM',
      hideInSearch: true,
    },
    {
      dataIndex: 'click_num_pv',
      title: '点击',
      hideInSearch: true,
    },
    {
      dataIndex: 'click_percent',
      title: '点击率',
      hideInSearch: true,
    },
    {
      dataIndex: 'cpc',
      title: 'CPC',
      hideInSearch: true,
    },
    {
      dataIndex: 'valid_num',
      title: '转化',
      hideInSearch: true,
    },
    {
      dataIndex: 'valid_percent',
      title: '转化率',
      hideInSearch: true,
    },
    {
      dataIndex: 'cpa',
      title: 'CPA',
      hideInSearch: true,
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
        <QueryFilter<{
          name: string;
          company: string;
        }>
          onFinish={async (values) => {
            let obj = {
              sdate: values?.time?.[0],
              edate: values?.time?.[1],
            }
            await queryList({ ...values, ...obj }).then(res => {
              if (res.code === 1) {
                setdatalist(res.data)
              }
            })
            console.log(values.name);
          }}
        >
          <ProFormSelect
            name="acc_id"
            label="投放账户"
            showSearch
            options={account}
            fieldProps={{
              onChange: (value) => {
                setcurrentaccount(value)
              }
            }}
          />
          <ProFormSelect
            name="plan_id"
            label="广告计划"
            showSearch
            options={plan}
            fieldProps={{
              onChange: (value) => {
                setcurrentplan(value)
              }
            }}
          />
          <ProFormSelect
            name="unit_id"
            label="广告单元"
            showSearch
            options={unit}
            fieldProps={{
              onChange: (value) => {
                setcurrentunit(value)
              }
            }}
          />
          <ProFormSelect
            name="des_id"
            label="广告创意"
            showSearch
            options={create}
          />
          <ProFormDateRangePicker
            name="time"
            label="时间范围"
          />
        </QueryFilter>
      </Card>
      <Card bordered={false}>
        <Tabs defaultActiveKey="10" centered tabBarGutter={90}>
          <TabPane tab={
            <Statistic valueStyle={{ fontSize: 34 }} title="剩余金额" prefix="￥" value={data?.cost_num} />
          } key="1">
          </TabPane>
          <TabPane tab={
            <Statistic valueStyle={{ fontSize: 34 }} title="CPM" prefix="￥" value={data?.cpm} />
          } key="2">
          </TabPane>
          <TabPane tab={
            <Statistic valueStyle={{ fontSize: 34 }} title="曝光" value={data?.show_num_pv} />
          } key="3">
          </TabPane>
          <TabPane tab={
            <Statistic valueStyle={{ fontSize: 34 }} title="点击" value={data?.click_num_pv} />
          } key="4">
          </TabPane>
          <TabPane tab={
            <Statistic valueStyle={{ fontSize: 34 }} title="点击率" suffix="%" value={data?.click_percent ? data?.click_percent * 100 : 0} />
          } key="5">
          </TabPane>
          <TabPane tab={
            <Statistic valueStyle={{ fontSize: 34 }} title="CPC" prefix="￥" value={data?.cpc} />
          } key="6">
          </TabPane>
          <TabPane tab={
            <Statistic valueStyle={{ fontSize: 34 }} title="转化" value={data?.valid_num} />
          } key="7">
          </TabPane>
          <TabPane tab={
            <Statistic valueStyle={{ fontSize: 34 }} title="转化率" suffix="%" value={data?.valid_percent ? data?.valid_percent * 100 : 0} />
          } key="8">
          </TabPane>
          <TabPane tab={
            <Statistic valueStyle={{ fontSize: 34 }} title="CPA" prefix="￥" value={data?.cpa} />
          } key="9">
          </TabPane>
        </Tabs>
      </Card>
      <Card bordered={false}>
        <DualAxes {...{
          data: [[{
            year: '1991',
            value: 3,
            count: 10,
          },
          {
            year: '1992',
            value: 4,
            count: 4,
          },
          {
            year: '1993',
            value: 3.5,
            count: 5,
          },
          {
            year: '1994',
            value: 5,
            count: 5,
          },
          {
            year: '1995',
            value: 4.9,
            count: 4.9,
          },
          {
            year: '1996',
            value: 6,
            count: 35,
          },
          {
            year: '1997',
            value: 7,
            count: 7,
          },
          {
            year: '1998',
            value: 9,
            count: 1,
          },
          {
            year: '1999',
            value: 13,
            count: 20,
          },], [{
            year: '1991',
            value: 3,
            count: 10,
          },
          {
            year: '1992',
            value: 4,
            count: 4,
          },
          {
            year: '1993',
            value: 3.5,
            count: 5,
          },
          {
            year: '1994',
            value: 5,
            count: 5,
          },
          {
            year: '1995',
            value: 4.9,
            count: 4.9,
          },
          {
            year: '1996',
            value: 6,
            count: 35,
          },
          {
            year: '1997',
            value: 7,
            count: 7,
          },
          {
            year: '1998',
            value: 9,
            count: 1,
          },
          {
            year: '1999',
            value: 13,
            count: 20,
          },]],
          legend: {
            position: 'top'
          },
          xField: 'year',
          yField: ['value', 'count'],
          geometryOptions: [
            {
              geometry: 'line',
              color: '#5B8FF9',
              smooth: true,
              point: {
                shape: 'circle',
                size: 4,
                style: {
                  opacity: 0.5,
                  stroke: '#5B8FF9',
                  fill: '#fff',
                },
              },
            },
            {
              geometry: 'line',
              color: '#5AD8A6',
              smooth: true,
              point: {
                shape: 'circle',
                size: 4,
                style: {
                  opacity: 0.5,
                  stroke: '#5AD8A6',
                  fill: '#fff',
                },
              },
            },
          ],
        }} />
      </Card>
      <ProTable
        options={false}
        columns={columns}
        actionRef={actionRef}
        dataSource={data?.list}
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
      />
    </PageContainer>
  );
};
