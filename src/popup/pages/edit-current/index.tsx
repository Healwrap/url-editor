// typescript
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  LinkOutlined,
  PlusOutlined,
  SyncOutlined
} from "@ant-design/icons"
import { Button, Card, Col, Divider, Form, Input, Row, Space } from "antd"
import ButtonGroup from "antd/es/button/button-group"
import { QRCodeSVG } from "qrcode.react"
import React, { useContext, useEffect, useRef, useState } from "react"
import URI from "urijs"

import { ConfigContext } from "~popup"
import {
  copyToClipboard,
  getCurrentURL,
  openPage,
  randomString,
  reloadPage
} from "~popup/utils"

const EditCurrent: React.FC = () => {
  const [url, setUrl] = useState("")
  const [params, setParams] = useState<Record<string, string>>({})
  const [fragment, setFragment] = useState("")
  const [host, setHost] = useState("")
  const [path, setPath] = useState("")
  const { tab } = useContext(ConfigContext)
  const paramIndex = useRef(0)

  useEffect(() => {
    ;(async () => {
      setUrl(await getCurrentURL(tab))
    })()
  }, [tab])

  // 用户手动更新 url 或重置时才解析参数
  useEffect(() => {
    try {
      // 解析新 url，更新 params
      const uri = new URI(url)
      console.log(uri)
      const newParams = uri.query(true)
      setParams((prev) => {
        // 只有当解析出的 params 和之前的不同时才更新
        if (JSON.stringify(prev) !== JSON.stringify(newParams)) {
          return newParams
        }
        return prev
      })
      setFragment(uri.fragment())
      setHost(uri.host())
      setPath(uri.path())
    } catch {}
  }, [url])

  useEffect(() => {
    try {
      const uri = new URI(url)
      uri.query(params)
      uri.fragment(fragment)
      uri.host(host)
      uri.path(path)
      setUrl(uri.toString())
    } catch {}
  }, [params, fragment, host, path])

  const addParam = () => {
    setParams({ ...params, [`newParam${++paramIndex.current}`]: "value" })
  }

  const handleKeyChange = (oldKey: string, newKey: string) => {
    if (!newKey.trim() || oldKey === newKey) return
    const { [oldKey]: val, ...rest } = params
    setParams({ ...rest, [newKey]: val })
  }

  const handleValueChange = (key: string, newValue: string) => {
    setParams({ ...params, [key]: newValue })
  }

  const handleDeleteParam = (key: string) => {
    const { [key]: _, ...rest } = params
    setParams(rest)
  }

  return (
    <Form layout="vertical">
      <Card
        title="调整URL"
        extra={
          <p>方便调整当前页面的URL，包括参数，生成对应的二维码，便于手机调试</p>
        }>
        <Form.Item>
          <Space.Compact block>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} />
            <Button
              icon={<SyncOutlined />}
              onClick={async () => {
                setUrl(await getCurrentURL(tab))
              }}>
              重置
            </Button>
            <Button
              icon={<CopyOutlined />}
              onClick={() => copyToClipboard(url)}>
              复制
            </Button>
          </Space.Compact>
          <ButtonGroup style={{ marginTop: 20 }}>
            <Button
              icon={<EditOutlined />}
              type="primary"
              onClick={() => url && reloadPage(tab, url)}>
              当前页面打开
            </Button>
            <Button
              icon={<LinkOutlined />}
              type="primary"
              onClick={() => url && openPage(tab, url)}>
              新标签页打开
            </Button>
          </ButtonGroup>
          <Divider dashed />
          <Row>
            <Col span={10}>
              {url && (
                <div style={{ marginTop: 20 }}>
                  <QRCodeSVG value={url} size={256} />
                </div>
              )}
            </Col>
            <Col span={14}>
              <Form.Item label="参数">
                <Space direction="vertical">
                  {Object.keys(params).map((key) => (
                    <Space.Compact block>
                      <Input
                        value={key}
                        onChange={(e) => handleKeyChange(key, e.target.value)}
                      />
                      <Input
                        value={params[key]}
                        onChange={(e) => handleValueChange(key, e.target.value)}
                      />
                      <Button
                        icon={<CopyOutlined />}
                        onClick={() => copyToClipboard(params[key])}>
                        复制
                      </Button>
                      <Button
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteParam(key)}
                        danger>
                        删除
                      </Button>
                    </Space.Compact>
                  ))}
                  <Button
                    icon={<PlusOutlined />}
                    type="primary"
                    onClick={addParam}>
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
                    />
                    <Button
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard(host)}>
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
                    />
                    <Button
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard(path)}>
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
                    />
                    <Button
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard(fragment)}>
                      复制
                    </Button>
                  </Space.Compact>
                </Form.Item>
              )}
            </Col>
          </Row>
        </Form.Item>
      </Card>
    </Form>
  )
}

export default EditCurrent
