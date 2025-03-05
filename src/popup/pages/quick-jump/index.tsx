import { Button, Card, List, Pagination, Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import { url } from 'inspector';
import { title } from 'process';
import React, { useContext, useMemo, useState } from 'react';

import { ConfigContext } from '~popup';
import { openPage } from '~popup/utils';

const pageLinks = [
  {
    title: '女娲线下&线上灰度账号',
    url: 'https://km.sankuai.com/collabpage/1812812677',
  },
  {
    title: '【Test】环境账号集合',
    url: 'https://km.sankuai.com/page/1337555711',
  },
];

const platformLinks = [
  {
    title: '盘古',
    url: 'https://crm04.meishi.test.sankuai.com/partner/manage/main/settle?partnerId=40914175',
  },
  {
    title: '开店宝',
    url: 'https://ecom.meishi.test.meituan.com/meishi/?cate=24236#https://fspb.test.meituan.com/mwallet/front/common/login-access?source=1&page=daocanMwalletList&type=PC&mwallet_channel=side-menu&bizType=12000&iphPayMerchantNo=1020502813&useSSL=true',
  },
];

const toolsLinks = [
  {
    title: 'PAPI',
    url: 'https://a.sankuai.com/index',
  },
  {
    title: 'QAHome',
    url: 'https://qahome.sankuai.com/#/index',
  },
  {
    title: 'HPX',
    url: 'https://hpx.sankuai.com/',
  },
  {
    title: 'QDC',
    url: 'https://qdc.mws.sankuai.com/qdc/tool/list',
  },
];

export default function App() {
  const { tab } = useContext(ConfigContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [use, setUse] = useState('1');

  const map: { [key in string]: { title: string; url: string }[] } = {
    '1': pageLinks,
    '2': platformLinks,
    '3': toolsLinks,
  };

  const pageSize = 5;
  const paginatedLinks = useMemo(
    () => map[use].slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [currentPage, use]
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTabChange = (key: string) => {
    console.log(key);

    setUse(key);
    setCurrentPage(1); // 切换 Tab 时重置当前页码
  };

  return (
    <Card title="相关链接" extra={<p>快捷跳转到对应文档</p>}>
      <Tabs defaultActiveKey="1" onChange={handleTabChange}>
        <TabPane tab="测试工具" key="3"></TabPane>
        <TabPane tab="测试链接" key="1"></TabPane>
        <TabPane tab="平台直达" key="2"></TabPane>
      </Tabs>
      <List
        itemLayout="horizontal"
        dataSource={paginatedLinks}
        renderItem={(item, index) => (
          <List.Item>
            <Button key={index} type="link" onClick={() => openPage(tab, item.url)}>
              {item.title}
            </Button>
          </List.Item>
        )}
      />
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={map[use].length}
        onChange={handlePageChange}
        style={{ marginTop: 20, textAlign: 'center' }}
      />
    </Card>
  );
}
