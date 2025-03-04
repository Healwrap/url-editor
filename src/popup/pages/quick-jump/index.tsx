import { Button, Card, List, Pagination } from "antd"
import React, { useContext, useState } from "react"

import { ConfigContext } from "~popup"
import { openPage } from "~popup/utils"

const links = [
  {
    title: "女娲线下&线上灰度账号",
    url: "https://km.sankuai.com/collabpage/1812812677"
  },
  {
    title: "【Test】环境账号集合",
    url: "https://km.sankuai.com/page/1337555711"
  }
]

export default function App() {
  const { tab } = useContext(ConfigContext)

  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  const paginatedLinks = links.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <Card title="相关文档" extra={<p>快捷跳转到对应文档</p>}>
      <List
        itemLayout="horizontal"
        dataSource={paginatedLinks}
        renderItem={(item, index) => (
          <List.Item>
            <Button
              key={index}
              type="link"
              onClick={() => openPage(tab, item.url)}>
              {item.title}
            </Button>
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
