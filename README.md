## 免登调试插件

本项目核心功能是在页面中以浏览器插件的形式，配置免登链接参数，并实现切换页面进行调试，或者在App中调试的功能

目前支持
1. 当前页面改变URL参数
2. 获取免登链接

### 0. 前置梳理

目前有这几个需求
1. 能够方便修改当前页面的url参数
  1. 通用功能，不仅局限于开发调试场景，甚至可以切换路径，切换参数，目的主要都是减少直接操作浏览器地址栏
2. 能够根据设定场景获取免登链接
  0. 可能得更多考虑在业务场景的使用，自定义功能
  1. 预设场景
    1. 代码配置场景-适配度高，支持自定义功能，无法方便拓展，不过作为开发者，可以自己修改代码
    2. 配置文件场景-适配度低，无法根据不同场景自定义功能，优点是方便拓展，可以考虑导出配置
  2. 保存历史参数，设置备注，快速切换
3. 快速获取页面中的iframe链接
  1. 获取
4. 一些测试文档的快速跳转

需要支持在modal中切换页面

### 1. 技术选型

1. 原生开发
  1. 配置较复杂，无插件热更新，无自动安装插件
  2. 需要关注manifest.json的配置
  3. 不能同时支持多个浏览器
  4. content script比较难隔离，需要使用shadow dom、iframe等操作隔离
2. Plasmo
  1. 不会自动安装插件，但是都支持热更新
  2. 支持多个浏览器
  3. 内容放在plasmo-csui的shadow dom中，可以实现样式隔离
  4. 使用parcel打包
  5. 使用@plasmojs/messaging实现消息传递
3. WXT
  1. 脚手架快速生成，支持热更新，支持自动安装插件
  2. 可以同时支持多个浏览器
  3. 有多种隔离方案，不过基本使用shadow dom，和plasmo差不多
  4. 使用vite打包
  5. 没有官方的消息传递方案
4. 选择方案
  1. 相比于原生开发, 使用框架可以节省配置的时间、包括HMR、或者自动安装插件(实际上作用不大)
  2. 框架都配置有隔离方案，包括shadow dom、iframe等，可以实现样式隔离，而原生开发需要自己实现(没啥思路)
  3. plasmo和wxt，plasmo相比更加成熟，包括就antd的集成，wxt就没有相关文档，所以暂时选择plasmo(主要是也没怎么熟悉这两个框架)



### 参考资料

- https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world?hl=zh-cn
- https://blog.csdn.net/Backspace110/article/details/125262468
- https://wxt.dev
- https://docs.plasmo.com/