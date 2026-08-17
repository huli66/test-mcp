import type {Transport} from '@modelcontextprotocol/sdk/shared/transport.js';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StdioClientTransport} from '@modelcontextprotocol/sdk/client/stdio.js';
import OpenAI from 'openai';
import {z} from 'zod'; // 导入 zod 用于模式验证

class MyClient {
  private openai: OpenAI;
  private client: Client;
  constructor() {
    this.openai = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: process.env.DEEPSEEK_TOKEN
    });

    this.client = new Client(
      {
        name: 'example-client',
        version: '1.0.0'
      },
      {
        capabilities: {
          prompts: {},
          resources: {},
          tools: {}
        }
      }
    );
  }

  async connectToServer(transport: Transport) {
    await this.client.connect(transport);
    this.run();
    console.error('MCPClient started on stdin/stdout');
  }

  openAiToolAdapter(tool: {name: string; description?: string; input_schema: any}) {
    // 基于 input_schema 创建一个 zod 模式
    const schema = z.object(tool.input_schema);

    return {
      type: 'function' as const, // 明确设置类型为 "function"
      function: {
        name: tool.name,
        description: tool.description,
        parameters: {
          type: 'object',
          properties: tool.input_schema.properties,
          required: tool.input_schema.required
        }
      }
    };
  }

  async callTools(
    tool_calls: OpenAI.Chat.Completions.ChatCompletionMessageToolCall[],
    toolResults: any[]
  ) {
    for (const tool_call of tool_calls) {
      const toolName = tool_call.function.name;
      const args = tool_call.function.arguments;

      console.log(`Calling tool ${toolName} with args ${JSON.stringify(args)}`);

      // 2. 调用服务器的工具
      const toolResult = await this.client.callTool({
        name: toolName,
        arguments: JSON.parse(args)
      });

      console.log('Tool result: ', toolResult);

      // 3. 对结果进行处理
      // 待办事项
    }
  }

  async run() {
    console.log('查询 server 提供的可用工具');
    const toolsResult = await this.client.listTools();
    const tools = toolsResult.tools.map((tool) => {
      return this.openAiToolAdapter({
        name: tool.name,
        description: tool.description,
        input_schema: tool.inputSchema
      });
    });

    const prompt = 'What is the sum of 2 and 3?';

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'user',
        content: prompt
      }
    ];

    console.log('Querying LLM: ', messages[0].content);
    const response = this.openai.chat.completions.create({
      model: 'deepseek-v4-flash',
      max_tokens: 1000,
      messages,
      tools: tools
    });

    const results: any[] = [];

    // 3. 遍历 LLM 响应，对于每个选项，检查是否包含工具调用
    (await response).choices.map(async (choice: {message: any}) => {
      const message = choice.message;
      if (message.tool_calls) {
        console.log('Making tool call');
        await this.callTools(message.tool_calls, results);
      }
    });
  }
}

const client = new MyClient();
const transport = new StdioClientTransport({
  command: 'node',
  args: ['./src/server.ts']
});

client.connectToServer(transport);
