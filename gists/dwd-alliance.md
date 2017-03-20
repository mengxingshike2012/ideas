[dwd-alliance](#internal)

# Fist Complete BFF project and learn to start up both f2e and gateway!

## 前端的文件组织方式  ** effor needed **
+ based on dwd-shop
+ compare dwd-alliance with dwd-express-manager

> 关于项目的文件组织方式， 参见react-boilerplate


> little things but import
+ id 比较， 使用int还是string ,判空， 不可避免
+ 按钮点击， 避免重复提交请求, debouce, throte
+ 处理跳转与数据的加载， loading 动画， 数据的及时性 preload and refresh
+ Q: 先展示给用户页面(目前是这个, 状态在store里面) 还是先加载数据

+ react 与第三方组件的结合， 比如地图, 如何控制地图的状态 (补课：react的diff处理)
+ ** data => view , {props, state} => view **


## 网关层的实现， BFF的网关 
+ based on dwd-shop
+ compare dwd-alliance with dwd-express-manager

> node-dubbo 
+ 借助maven， 更加自动化的生成网关service 代码 javadoc-loader && javadoc-=parse
+ node-dubbo: application, proxy, customer/consumer

+ 日志， 调用微服务的入参，出参, 记录微服务的执行时间， catch 错误信息
+ 网关暴露出 restful ? 符合语义的api 接口， 参数校验以及传递入参 给微服务
+ 如何与文档结合， 如何测试， 如何路由
+ 网关代码组织方式
