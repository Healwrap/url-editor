import { Tabs } from "antd"
import React, { useEffect, useRef, useState } from "react"
import type Browser from "webextension-polyfill"
import browser from "webextension-polyfill"

import styles from "./index.module.scss"
import EditCurrent from "./pages/edit-current"
import GetIframe from "./pages/get-iframe"

const { TabPane } = Tabs

export const ConfigContext = React.createContext<{ tab?: Browser.Tabs.Tab }>({})

const App = () => {
  const [tab, setTab] = useState<Browser.Tabs.Tab>()
  useEffect(() => {
    browser.tabs.query({ active: true, currentWindow: true }).then((tab) => {
      console.log(tab)
      setTab(tab[0])
    })
  }, [])
  return (
    <ConfigContext.Provider value={{ tab }}>
      <div className={styles["popup-container"]}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="编辑当前页面" key="1">
            <EditCurrent></EditCurrent>
          </TabPane>
          <TabPane tab="获取免登链接" key="2">
            {/* 页面2的内容 */}
            <p>这是页面2的内容</p>
          </TabPane>
          <TabPane tab="获取iframe链接" key="3">
            <GetIframe></GetIframe>
          </TabPane>
          <TabPane tab="相关文档" key="4">
            {/* 页面3的内容 */}
            <p>这是页面3的内容</p>
          </TabPane>
        </Tabs>
      </div>
    </ConfigContext.Provider>
  )
}

export default App
