import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: 'node',
  args: ['src/server.ts']
});

const client = new Client({
  name: 'qeubee-client',
  version: '1.0.0'
})

await client.connect(transport);

const tools = await client.listTools();
console.error('tools', tools)
const resources = await client.listResources()
console.error('resources', resources)
const prompts = await client.listPrompts();
console.error('prompts', prompts)

const res = await client.ping();
console.error('res', res)

const resource = await client.readResource({
  uri: 'file:///docs/t.txt'
})
console.error('resource', resource)

const weather = await client.callTool({
  name: 'weather',
  arguments: {
    location: '上海'
  }
})
console.error('weather', weather)

const prompt = await client.getPrompt({
  name: 'review-code',
  arguments: {
    code: 'console.log(\"hello world\")'
  }
})
console.error('prompt', prompt)