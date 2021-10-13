import React from 'react';
import { Tabs } from 'antd';
const { TabPane } = Tabs;
import Plan from './components/plan'
import Unit from './components/unit'
export default (): React.ReactNode => {
  return (
    <Tabs defaultActiveKey="1" destroyInactiveTabPane={true}>
      <TabPane tab="视频库" key="1">
        <Plan />
      </TabPane>
      <TabPane tab="图片库" key="2">
        <Unit />
      </TabPane>
    </Tabs>
  );
};
