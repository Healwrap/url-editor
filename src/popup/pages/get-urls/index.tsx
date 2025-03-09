import { CopyOutlined, LinkOutlined, LoadingOutlined, UndoOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Divider, List, message, Pagination, Row, Checkbox, Image } from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
import React, { useContext, useEffect, useState } from 'react';
import URI from 'urijs';

import { sendMessage } from '~messaging';
import { ConfigContext } from '~popup';
import { copyToClipboard, getLinks, openPage, reloadPage } from '~popup/utils';

const options = ['iframe', 'a', 'img'];

const PageList = ({ dataSource }: { dataSource: { url: string; key: number }[] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [resolvedLinks, setResolvedLinks] = useState<{ [key: number]: string }>({});
  const pageSize = 5;
  const paginatedData = dataSource.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const isImageUrl = (url: string, key: number) => {
    if (resolvedLinks[key] && resolvedLinks[key].startsWith('http') && resolvedLinks[key].includes('image')) {
      return true;
    }
    if (url.startsWith('data:image/')) {
      return true;
    }
    const uri = new URI(url);
    const path = uri.path();
    // 匹配以图片扩展名结尾的路径，忽略后续的参数
    return /\.(jpeg|jpg|gif|png|webp|svg)(@|$)/i.test(path);
  };

  const resolveLink = async (key: number, url: string) => {
    if (resolvedLinks[key]) return; // 如果已经解析过，直接返回
    try {
      const response = await fetch(url, { method: 'HEAD', redirect: 'follow' });
      const finalUrl = response.url || url; // 获取最终的重定向链接
      setResolvedLinks((prev) => ({ ...prev, [key]: finalUrl }));
    } catch {
      message.error(`无法解析链接: ${url}`);
    }
  };

  useEffect(() => {
    // 自动解析当前页的链接
    paginatedData.forEach((item) => resolveLink(item.key, item.url));
  }, [paginatedData]);

  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={paginatedData}
        renderItem={(item) => {
          const resolvedUrl = resolvedLinks[item.key] || item.url; // 使用解析后的链接
          return (
            <List.Item
              key={item.key}
              actions={[
                <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(resolvedUrl)}>
                  复制
                </Button>,
                <Button icon={<LinkOutlined />} onClick={() => window.open(resolvedUrl, '_blank')}>
                  跳转
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={
                  isImageUrl(resolvedUrl, item.key) ? (
                    <Image
                      src={resolvedUrl}
                      alt="图片"
                      style={{ maxWidth: 300, maxHeight: 300 }}
                      placeholder={<LoadingOutlined style={{ fontSize: 20 }} />}
                    />
                  ) : (
                    <div
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {resolvedUrl}
                    </div>
                  )
                }
              />
            </List.Item>
          );
        }}
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
        <Button type="primary" icon={<UndoOutlined />} onClick={() => (links && setLinks({}), reloadPage(tab))}>
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
