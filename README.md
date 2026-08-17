# mcp

```sh
# 例如 TypeScript，安装和运行 MCP Inspector
npx @modelcontextprotocol/inspector node build/index.js
```

使用 console.error() 进行日志记录（不要使用 console.log()，因为它会写入 stdout）

新版本不再需要 session-id，而是把部分元数据放在 HTTP header 中，其余部分放在 body 里，网关层可以简单读取 header 内容来过滤，而不用解析 body 数据
