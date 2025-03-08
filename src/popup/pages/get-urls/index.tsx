import { CopyOutlined, LinkOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Divider, List, message, Pagination, Row, Checkbox } from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
import React, { useContext, useEffect, useState } from 'react';

import { sendMessage } from '~messaging';
import { ConfigContext } from '~popup';
import { copyToClipboard, getLinks, openPage, reloadPage } from '~popup/utils';

const options = ['iframe', 'a', 'img'];

const PageList = ({ dataSource }: { dataSource: { url: string; key: number }[] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const paginatedData = dataSource.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={paginatedData}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(item.url)}>
                复制
              </Button>,
              <Button icon={<LinkOutlined />} onClick={() => window.open(item.url, '_blank')}>
                跳转
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={
                <div
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.url}
                </div>
              }
            />
          </List.Item>
        )}
      />
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={dataSource.length}
        onChange={handlePageChange}
        style={{ marginTop: 20, textAlign: 'center' }}
      />
    </>
  );
};

const App: React.FC = () => {
  const [categories, setCategories] = useState<string[]>(['iframe', 'a', 'img']);
  const [links, setLinks] = useState<{ [key in string]: { url: string; key: number }[] }>({});

  const { tab } = useContext(ConfigContext);

  const getDocLinks = async () => {
    try {
      links && setLinks({});
      const res = await getLinks(tab, categories);
      if (!res) message.error('未获取到有效链接');
      setLinks(res);
    } catch {
      message.error('与content script通信失败，请手动刷新页面重试');
    }
  };

  const handleCheckboxChange = (checkedValues: Array<(typeof options)[number]>) => {
    setCategories(checkedValues);
  };

  return (
    <Card title="获取链接" extra={<p>获取网页中的链接，方便调试</p>}>
      <Checkbox.Group options={options} value={categories} onChange={handleCheckboxChange} />
      <Divider dashed plain />
      <ButtonGroup>
        <Button type="primary" onClick={getDocLinks}>
          获取链接列表
        </Button>
        <Button type="primary" onClick={() => (links && setLinks({}), reloadPage(tab))}>
          刷新页面
        </Button>
      </ButtonGroup>
      {Object.keys(links).map((key) => (
        <div key={key}>
          <Divider dashed plain>
            {key}
          </Divider>
          <PageList dataSource={links[key]} />
        </div>
      ))}
      <Divider dashed plain>
        历史网站及对应iframe链接(考虑做，评估实用性)
      </Divider>
    </Card>
  );
};

export default App;
