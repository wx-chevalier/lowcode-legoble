import { Tabs } from 'antd';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as smoothscroll from 'smoothscroll-polyfill';

import './index.css';
import Input from './Input';
import Arrays from './Arrays';
import Select from './Select';
import DateTime from './DateTime';

const TabPane = Tabs.TabPane;

smoothscroll.polyfill();

ReactDOM.render(
  <Tabs>
    <TabPane tab="Input" key="Input">
      <Input />
    </TabPane>
    <TabPane tab="Select" key="Select">
      <Select />
    </TabPane>
    <TabPane tab="Arrays" key="Arrays">
      <Arrays />
    </TabPane>
    <TabPane tab="DateTime" key="DateTime">
      <DateTime />
    </TabPane>
  </Tabs>,
  document.getElementById('root')
);
