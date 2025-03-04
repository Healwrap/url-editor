import { message } from "antd"
import browser from "webextension-polyfill"

import { onMessage, sendMessage } from "~/messaging"

onMessage("getURL", (message) => {
  const url = window.location.href
  console.log("获取URL", url)
  return url
})

onMessage("setURL", (message) => {
  try {
    window.location.href = message.data
  } catch (err) {
    console.error(err)
    return false
  }
  return true
})

onMessage("getIrameLinks", (message) => {
  console.log("获取iframe链接")
  const iframes = document.querySelectorAll("iframe")
  const links = Array.from(iframes).map((iframe) => iframe.src)
  return links.map((item, index) => ({ url: item, key: index }))
})

onMessage("reloadPage", (message) => {
  // 如果传入url，则在当前页面打开
  if (message.data) {
    window.location.href = message.data
  } else {
    window.location.reload()
  }
  return true
})

onMessage("openURL", (message) => {
  window.open(message.data)
  return true
})
