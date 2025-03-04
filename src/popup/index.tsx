import { Tabs } from "antd"
import React, { useEffect, useRef, useState } from "react"
import type Browser from "webextension-polyfill"
import browser from "webextension-polyfill"

import styles from "./index.module.scss"
import EditCurrent from "./pages/edit-current"
import EditUrl from "./pages/edit-url"
import GetIframe from "./pages/get-iframe"
import QuickJump from "./pages/quick-jump"

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
        <Tabs
          defaultActiveKey="1"
          onChange={(key) =>
            key === "5" && window.open("./options.html", "__black")
          }>
          <TabPane tab="编辑当前页面" key="1">
            <EditCurrent></EditCurrent>
          </TabPane>
          <TabPane tab="获取免登链接" key="2">
            <EditUrl></EditUrl>
          </TabPane>
          <TabPane tab="获取iframe链接" key="3">
            <GetIframe></GetIframe>
          </TabPane>
          <TabPane tab="相关文档" key="4">
            <QuickJump></QuickJump>
          </TabPane>
          <TabPane tab="使用教程" key="5"></TabPane>
        </Tabs>
      </div>
    </ConfigContext.Provider>
  )
}

export default App
