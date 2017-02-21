[douban-movie-react-ssr](https://github.com/ibufu/douban-movie-react-ssr)

# The first demo of server-side rending I have seen, shows somethings important

## 服务器端的问题

 + 首屏渲染获取storeState时，一个action返回后，如何获取异步的所有数据
 + 服务器端代码与客户端代码的同构(universal)
 + 针对ES6的特性支持不足，e.g modules/async
 + webpack编译所有服务器端的代码，开发体验没有跟上，e.g每次修改需要重新编译和启动Server

 ## 要点:
 + option static loadData for both client and server-side
 + use receivedAt to reduce data fetching
 + api-middlewares
 + react-router {RouterContext, match}
 + ReactDOMServer.renderToString
 + 代码组织结构

 ## 常见的针对手段
 + webpack.node.config.js
 + webpack-isomorphic-tools
 + universal-webpack
