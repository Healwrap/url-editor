// typescript
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  LinkOutlined,
  PlusOutlined,
  SyncOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Divider, Form, Input, message, Row, Space } from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
import { QRCodeSVG } from 'qrcode.react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import URI from 'urijs';

import { ConfigContext } from '~popup';
import { copyToClipboard, forwardAndBack, getCurrentURL, openPage, randomString, reloadPage } from '~popup/utils';

type ParamItem = {
  id: string;
  key: string;
  value: string;
};

const mergeParams = (
  existing: ParamItem[], // 现有数组格式参数
  newParams: Record<string, string> // 新解析的键值对参数
): ParamItem[] => {
  // Step 1: 创建快速查找表
  const existingMap = new Map<string, ParamItem>(existing.map((item) => [item.key, item]));

  // Step 2: 创建结果数组
  const merged = Object.entries(newParams).map(([key, value]) => {
    // 保留已有条目的ID（如果存在）
    const existingItem = existingMap.get(key);
    return existingItem
      ? { ...existingItem, value } // 保留ID更新值
      : { id: randomString(10), key, value }; // 新建条目
  });

  // Step 3: 保留不在新参数中的旧参数（根据需求选择）
  // 如果需要保留旧参数（如用户手动添加）：
  // existing.forEach(item => {
  //   if (!newParams[item.key]) merged.push(item)
  // })

  return merged;
};

const EditCurrent: React.FC = () => {
  const [url, setUrl] = useState('');
  const [params, setParams] = useState<ParamItem[]>([]);
  const [fragment, setFragment] = useState('');
  const [host, setHost] = useState('');
  const [path, setPath] = useState('');
  const { tab } = useContext(ConfigContext);
  const paramIndex = useRef(0);

  useEffect(() => {
    (async () => {
      if (!tab?.id) return;
      try {
        setUrl(await getCurrentURL(tab));
      } catch {
        message.error('与content script通信失败，请手动刷新页面重试');
      }
    })();
  }, [tab]);

  // 用户手动更新 url 或重置时才解析参数
  useEffect(() => {
    try {
      // 解析新 url，更新 params
      const uri = new URI(url);
      const newParams = uri.query(true);
      setParams(mergeParams(params, newParams));
      setFragment(uri.fragment());
      setHost(uri.host());
      setPath(uri.path());
    } catch {}
  }, [url]);

  useEffect(() => {
    try {
      const uri = new URI(url);
      // 数组params转换为对象
      const newParams = params.reduce(
        (acc, item) => {
          acc[item.key] = item.value;
          return acc;
        },
        {} as Record<string, string>
      );
      uri.query(newParams);
      uri.fragment(fragment);
      uri.host(host);
      uri.path(path);
      setUrl(uri.toString());
    } catch {}
  }, [params, fragment, host, path]);

  const addParam = () => {
    setParams([
      ...params,
      { id: randomString(10), key: `newParam${++paramIndex.current}`, value: `value${paramIndex.current}` },
    ]);
  };

  const handleKeyChange = (id: string, oldKey: string, newKey: string) => {
    if (!newKey.trim() || oldKey === newKey) return;
    setParams(params.map((item) => (item.id === id ? { ...item, key: newKey } : item)));
  };

  const handleValueChange = (id: string, key: string, newValue: string) => {
    setParams(params.map((item) => (item.id === id ? { ...item, value: newValue } : item)));
  };

  const handleDeleteParam = (id: string) => {
    setParams(params.filter((item) => item.id !== id));
  };

  return (
    <Form layout="vertical">
      <Card title="调整URL" extra={<p>方便调整当前页面的URL，包括参数，生成对应的二维码，便于手机调试</p>}>
        <Row
          style={{
            position: 'sticky',
            top: 10,
            zIndex: 999,
            backgroundColor: '#ffffff80',
            padding: 5,
            borderRadius: 7,
            border: '1px solid #f0f0f0',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Space.Compact block>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onPressEnter={() => url && reloadPage(tab, url)}
            />
            <Button
              icon={<SyncOutlined />}
              onClick={async () => {
                setUrl(await getCurrentURL(tab));
              }}
            >
              重置
            </Button>
            <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(url)}>
              复制
            </Button>
          </Space.Compact>
          <ButtonGroup style={{ marginTop: 20 }}>
            <Button icon={<ArrowLeftOutlined />} type="primary" onClick={() => forwardAndBack(tab, 'back')}>
              回退
            </Button>
            <Button icon={<LinkOutlined />} type="primary" onClick={() => url && openPage(tab, url)}>
              新标签页打开
            </Button>
            <Button icon={<UndoOutlined />} type="primary" onClick={() => url && reloadPage(tab)}>
              刷新页面
            </Button>
            <Button icon={<ArrowRightOutlined />} type="primary" onClick={() => forwardAndBack(tab, 'forward')}>
              前进
            </Button>
          </ButtonGroup>
        </Row>
        <Divider dashed plain>
          在任意输入框按下回车会刷新当前页面
        </Divider>
        <Row>
          <Col span={10}>
            {url && (
              <div style={{ marginTop: 20, position: 'sticky', top: 140 }}>
                <QRCodeSVG value={url} size={256} />
                <div>注：移动端需要使用免登链接才能打开</div>
              </div>
            )}
          </Col>
          <Col span={14}>
            <Form.Item label="参数">
              <Space direction="vertical">
                {params.map((item) => (
                  // 使用固定id防止组件重新渲染导致焦点丢失
                  <Space.Compact block key={item.id}>
                    <Input
                      value={item.key}
                      onChange={(e) => handleKeyChange(item.id, item.key, e.target.value)}
                      onPressEnter={() => url && reloadPage(tab, url)}
                    />
                    <Input
                      value={item.value}
                      onChange={(e) => handleValueChange(item.id, item.key, e.target.value)}
                      onPressEnter={() => url && reloadPage(tab, url)}
                    />
                    <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(item.value)}>
                      复制
                    </Button>
                    <Button icon={<DeleteOutlined />} onClick={() => handleDeleteParam(item.id)} danger>
                      删除
                    </Button>
                  </Space.Compact>
                ))}
                <Button icon={<PlusOutlined />} type="primary" onClick={addParam}>
                  添加新的参数
                </Button>
              </Space>
            </Form.Item>
            {host && (
              <Form.Item label="域名">
                <Space.Compact block>
                  <Input
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    onPressEnter={() => url && reloadPage(tab, url)}
                  />
                  <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(host)}>
                    复制
                  </Button>
                </Space.Compact>
              </Form.Item>
            )}
            {path && (
              <Form.Item label="路径">
                <Space.Compact block>
                  <Input
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                    onPressEnter={() => url && reloadPage(tab, url)}
                  />
                  <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(path)}>
                    复制
                  </Button>
                </Space.Compact>
              </Form.Item>
            )}
            {fragment && (
              <Form.Item label="片段">
                <Space.Compact block>
                  <Input
                    value={fragment}
                    onChange={(e) => setFragment(e.target.value)}
                    onPressEnter={() => url && reloadPage(tab, url)}
                  />
                  <Button icon={<CopyOutlined />} onClick={() => copyToClipboard(fragment)}>
                    复制
                  </Button>
                </Space.Compact>
              </Form.Item>
            )}
          </Col>
        </Row>
      </Card>
    </Form>
  );
};

export default EditCurrent;
