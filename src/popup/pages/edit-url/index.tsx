import { CopyOutlined, LinkOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Divider, List, message, Pagination, Segmented, Select, Space } from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
import FormItem from 'antd/es/form/FormItem';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import browser from 'webextension-polyfill';
import type Browser from 'webextension-polyfill';
import { ConfigContext } from '~popup';
import { copyToClipboard, getLoginAccessURL, openPage, reloadPage } from '~popup/utils';

const loginAccessMap = {
  test: {
    'daocan-self': {
      url: '',
      reg: '^https://fspb.test.meituan.com(?=.*login-access)',
      desc: '到餐自入驻免登链接',
      loginUrl: { type: 'outerFragment' },
      cookie: {
        'com.sankuai.meishi.fe.kdb-bsid-test': 'BSID',
      },
    },
    'daocan-bd': {
      url: '',
      reg: '^https://39747-hvmbc-sl-paymp.pay.test.sankuai.com(?=.*merchant-entry-login-verify)',
      desc: '到餐BD入驻免登链接',
      loginUrl:
        'https://39747-hvmbc-sl-paymp.pay.test.sankuai.com/merchant/front/common/merchant-entry-login-verify?source=1&page=daocanSettleInfoList&verifyStrategy=bdToken&customerId=40914175&iphPayMerchantNo=1020502813&bizType=12000&useSSL=true',
      cookie: {
        'com.sankuai.meishi.fe.partner_ssoid': 'BSID',
      },
    },
  },
  st: {
    'daocan-self': {
      reg: '^https://fspb.test.meituan.com(?=.*login-access)',
    },
  },
  prod: {
    'daocan-self': {
      reg: '^https://fspb.test.meituan.com(?=.*login-access)',
    },
  },
};

const { Option } = Select;

export default function App() {
  const { tab } = useContext(ConfigContext);
  const [selectedEnv, setSelectedEnv] = useState('test');
  const [selectedType, setSelectedType] = useState('daocan-self');
  const [urlReg, setUrlReg] = useState('');
  const [open, setOpen] = useState(false);
  const [links, setLinks] = useState<{ url: string; key: number }[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const paginatedLinks = links.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const port = useRef<Browser.Runtime.Port | null>();

  const handleOpen = async (open: boolean) => {
    setLinks([]);
    try {
      port.current = browser.runtime.connect({ name: 'popup' });
      port.current?.postMessage({ tabId: tab.id, urlReg, enable: open });
    } catch {
      message.error('与background通信失败，请手动刷新页面重试');
    }
  };
  const handleGetLoginAccessURL = async () => {
    const res = await getLoginAccessURL('test');
    if (!res.length) message.error('未获取到免登链接');
    setLinks(res);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setUrlReg(loginAccessMap[selectedEnv][selectedType].reg);
    setOpen(false);
  }, [selectedEnv, selectedType]);
  useEffect(() => {
    handleOpen(open);
    return () => {
      handleOpen(false);
    };
  }, [open]);

  return (
    <Card title="获取免登链接" extra={<p>仅商户平台内部分页面生效，需要定制可自行修改代码</p>}>
      <Alert message="先打开请求监听，再点击刷新页面，即可获取免登链接" description="" showIcon />
      <Divider dashed />
      <FormItem label="环境">
        <Select value={selectedEnv} onChange={(value) => setSelectedEnv(value)} style={{ width: 200, marginRight: 20 }}>
          {Object.keys(loginAccessMap).map((env) => (
            <Option key={env} value={env}>
              {env}
            </Option>
          ))}
        </Select>
      </FormItem>
      <FormItem label="场景">
        <Select value={selectedType} onChange={(value) => setSelectedType(value)} style={{ width: 200 }}>
          {Object.keys(loginAccessMap[selectedEnv]).map((type) => (
            <Option key={type} value={type}>
              {type}
            </Option>
          ))}
        </Select>
      </FormItem>
      <div>当前匹配规则：{urlReg}</div>
      <Divider dashed />
      <Space direction="vertical">
        <Segmented
          options={[
            { label: '打开监听', value: true },
            { label: '关闭监听', value: false },
          ]}
          defaultValue={false}
          value={open}
          onChange={(val) => setOpen(val)}
        />
        <ButtonGroup>
          <Button type="primary" onClick={() => handleGetLoginAccessURL()}>
            获取免登链接
          </Button>
          <Button type="primary" onClick={() => reloadPage(tab)}>
            刷新页面
          </Button>
        </ButtonGroup>
      </Space>
      <Divider dashed />
      <List
        itemLayout="horizontal"
        dataSource={paginatedLinks}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(item.url)}>
                复制
              </Button>,
              <Button icon={<LinkOutlined />} onClick={() => openPage(tab, item.url)}>
                跳转
              </Button>,
            ]}
          >
            {/* TODO 考虑增加一个修改iframe链接的功能 */}
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
        total={links.length}
        onChange={handlePageChange}
        style={{ marginTop: 20, textAlign: 'center' }}
      />
      <Divider dashed plain>
        历史免登链接(考虑做，评估实用性)
      </Divider>
    </Card>
  );
}
