## URL Editor 浏览器插件

本项目核心功能是
1. 编辑页面URL
2. 获取页面中的链接
3. 监听网络请求URL
4. 储存信息
5. 记录想要快速跳转的页面

### 0. 前置梳理

目前有这几个需求
1. 能够方便修改当前页面的url参数
    1. 通用功能，不仅局限于开发调试场景，甚至可以切换路径，切换参数，目的主要都是减少直接操作浏览器地址栏
2. 能够根据设定场景获取请求链接
    0. 可能得更多考虑在业务场景的使用，自定义功能
    1. 预设场景
        1. 代码配置场景-适配度高，支持自定义功能，无法方便拓展，不过作为开发者，可以自己修改代码
        2. 配置文件场景-适配度低，无法根据不同场景自定义功能，优点是方便拓展，可以考虑导出配置
    2. 保存历史参数，设置备注，快速切换
3. 快速获取页面中的链接链接，支持多种元素的链接
4. 一些外部链接的快速跳转，便于开发
5. 储存一些信息

### 1. 技术选型

浏览器插件一般由几个部分组成
- popup 点击插件图标时弹出的窗口
- content script 注入到页面中的js代码，可以分为带界面的和不带界面的
- background 后台脚本，拥有较多浏览器的API和特性，比如获取网络请求等
- option 插件独有的页面
- ... 其他一些省略了

如果是纯原生开发，面临的问题是
1. 我没有办法方便的做数据响应式了
2. 我不好拆分页面了
3. 我没有好的组件生态，写不出好看的页面了

所以选择使用前端框架+组件库开发，选型为react+vite+antd+ts

但是有几个问题

1. 插件的编译需要打成：popup.html、option.html、background.js、content.js，需要各自独立编译，不能依赖外部的js（浏览器限制），所以需要配置vite打包配置，比较繁琐
2. vite支持HMR，但浏览器不支持，所以每次修改一点东西，都需要疯狂点插件刷新...而一些浏览器插件框架支持真正的HMR，甚至可以自动安装插件调试

浏览器插件框架的选型

1. Plasmo
    1. 不会自动安装插件，但是都支持热更新
    2. 支持多个浏览器
    3. 内容放在plasmo-csui的shadow dom中，可以实现样式隔离
    4. 使用parcel打包
    5. 使用@plasmojs/messaging实现消息传递
2. WXT
    1. 脚手架快速生成，支持热更新，支持自动安装插件
    2. 可以同时支持多个浏览器
    3. 有多种隔离方案，不过基本使用shadow dom，和plasmo差不多
    4. 使用vite打包
    5. 没有官方的消息传递方案
3. 选择方案
    1. 相比于原生开发, 使用框架可以节省配置的时间、包括HMR、或者自动安装插件(实际上作用不大)
    2. 框架都配置有隔离方案，包括shadow dom、iframe等，可以实现样式隔离，而原生开发需要自己实现(没啥思路)
    3. plasmo和wxt，plasmo相比更加成熟，包括就antd的集成，wxt就没有相关文档，所以暂时选择plasmo(主要是也没怎么熟悉这两个框架)

### 2. 实现方案

#### 1.编辑URL

因为popup不能操作页面，也就无法修改URL，所以使用注入在页面中的content script实现页面URL的获取，页面刷新等操作

#### 2.监听网络请求

background脚本拥有脚本浏览器API特性，可以方便地操作浏览器，比如获取监听请求，在插件中使用popup与background进行通信实现请求的监听

### 3.使用教程

#### 1.编辑URL

1. 插件的核心功能是支持编辑网页的URL，可以调整参数、域名、路径等
2. 同时支持记忆历史参数、路径、片段等，方便快速选择
3. 插件支持在任意输入框按下回车立即刷新页面，和浏览器本身的路径栏使用体验一致
4. 插件支持同步生成二维码，便于手机进行调试

![](https://picgo-img-repo.oss-cn-beijing.aliyuncs.com/img/f97a0914c211fe693b7827acfdd434b1.png)

#### 2.获取请求链接

1. 插件目前支持自定义环境和场景，按照对应的匹配规则，可以从页面的网络请求中获取请求链接，便于拼接免登链接
2. 未来会支持更自由地编辑匹配规则，目前只能在代码中修改

![](https://picgo-img-repo.oss-cn-beijing.aliyuncs.com/img/b56f58f4fddf845292bb2b0c93000539.png)

#### 3.快速获取页面中的链接

1. 插件支持获取页面中iframe(部分场景可能存在嵌套两层iframe，因为浏览器跨域限制无法获取)、a、img元素的链接，便于调试

![](https://picgo-img-repo.oss-cn-beijing.aliyuncs.com/img/16167b63c32bf28008f1e89bee660058.png)

#### 4.储存信息

1.某些情况下，你可能需要使用一些值，但又不想在粘贴板中寻找时，可以试着放在这里

![](https://picgo-img-repo.oss-cn-beijing.aliyuncs.com/img/7e81eb4dc77a3e8d38bcbd823b3a04f2.png)

#### 5. 快速跳转链接

1. 记录一些测试文档、链接、工具等，在调试时快速跳转

![](https://picgo-img-repo.oss-cn-beijing.aliyuncs.com/img/3b54e011cca27fd6b06861e7763c9d6a.png)

### 参考资料

- https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world?hl=zh-cn
- https://blog.csdn.net/Backspace110/article/details/125262468
- https://wxt.dev
- https://docs.plasmo.com/