import { Card, Image } from "antd"
import React from "react"

export default function App() {
  return (
    <Card title="使用教程" styles={{ body: { maxWidth: 600 } }}>
      <h2>安装插件、固定到工具栏</h2>
      <p>1. 将编译产物，以解压拓展程序的方式引入</p>
      <Image
        src="https://picgo-img-repo.oss-cn-beijing.aliyuncs.com/img/2ca01e450d49f7faac6f8ede1b5ca98b.png"
        alt=""
      />
      <p>2. 固定到工具栏，方便调试</p>
      <Image src="https://picgo-img-repo.oss-cn-beijing.aliyuncs.com/img/63d6a309342baf90bcc952cdbf351ffd.png" />
      <h2>编辑页面URL</h2>
      <p>1. 启动插件，选择第一个Tab，可以使用编辑页面URL功能</p>
      <Image src="https://picgo-img-repo.oss-cn-beijing.aliyuncs.com/img/7e465e2fbd26efb6dce6712e62fd147e.png" />
      <h2>获取iframe链接</h2>
      <p>
        1.
        在部分系统中，页面以iframe的形式嵌入页面，可以获取他的URL，或者编辑他的URL
      </p>
      <Image src="https://picgo-img-repo.oss-cn-beijing.aliyuncs.com/img/42c489e6a64692423cfcfcf9bb7a7d85.png" />
    </Card>
  )
}
