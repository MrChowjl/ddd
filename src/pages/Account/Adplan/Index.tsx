import React from 'react';
import { Tabs } from 'antd';
const { TabPane } = Tabs;
import { PageContainer } from '@ant-design/pro-layout';
import Plan from './components/plan'
import Unit from './components/unit'
import Create from './components/create'
export default (): React.ReactNode => {
  return (
    <Tabs defaultActiveKey="1" destroyInactiveTabPane={true}>
      <TabPane tab="广告计划" key="1">
        <Plan />
      </TabPane>
      <TabPane tab="广告单元" key="2">
        <Unit />
      </TabPane>
      <TabPane tab="广告创意" key="3">
        <Create />
      </TabPane>
    </Tabs>
  );
};
