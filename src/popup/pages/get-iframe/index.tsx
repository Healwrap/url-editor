import { CopyOutlined, LinkOutlined } from "@ant-design/icons"
import { Alert, Button, Card, List, message, Pagination, Row } from "antd"
import ButtonGroup from "antd/es/button/button-group"
import React, { useContext, useEffect, useState } from "react"

import { sendMessage } from "~messaging"
import { ConfigContext } from "~popup"
import {
  copyToClipboard,
  getIframeLinks,
  openPage,
  reloadPage
} from "~popup/utils"

const App: React.FC = () => {
  const [links, setLinks] = useState<{ url: string; key: number }[]>([])

  useEffect(() => {}, [])

  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  const { tab } = useContext(ConfigContext)

  const paginatedLinks = links.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <Card title="获取iframe链接" extra={<p>获取网页中的链接，方便调试</p>}>
      <ButtonGroup>
        <Button
          type="primary"
          onClick={async () => setLinks(await getIframeLinks(tab))}>
          获取链接列表
        </Button>
        <Button type="primary" onClick={() => reloadPage(tab)}>
          刷新页面
        </Button>
      </ButtonGroup>
      <List
        itemLayout="horizontal"
        dataSource={paginatedLinks}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                icon={<CopyOutlined />}
                onClick={() => copyToClipboard(item.url)}>
                复制
              </Button>,
              <Button
                icon={<LinkOutlined />}
                onClick={() => openPage(tab, item.url)}>
                跳转
              </Button>
            ]}>
            {/* TODO 考虑增加一个修改iframe链接的功能 */}
            <List.Item.Meta
              title={
                <div
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}>
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
        style={{ marginTop: 20, textAlign: "center" }}
      />
    </Card>
  )
}

export default App
