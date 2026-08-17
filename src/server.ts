import {McpServer, ResourceTemplate} from '@modelcontextprotocol/sdk/server/mcp.js';
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';
import fs from 'node:fs/promises';
import {z} from 'zod';

const server = new McpServer({
  name: 'qeubee Mcp Server',
  version: '1.0.0'
});

server.registerTool(
  'weatherTool',
  {
    title: 'location',
    description: 'input a location',
    inputSchema: {
      location: z.string().describe('The location to get weather for')
    }
  },
  async ({location}) => {
    const weatherData = await getWeatherData(location);

    return {
      content: [
        {
          type: 'text',
          text: `Temperature: ${weatherData.temperature} °C, Condition: ${weatherData.condition}`
        }
      ]
    };
  }
);

server.registerTool(
  'forecastTool',
  {
    title: 'add params',
    description: 'add location and days',
    inputSchema: z.object({
      location: z.string().describe('The location to get forecast for'),
      days: z.number().int().min(1).max(7).describe('Number of days to forecast (1-7)')
    })
  },
  async ({location, days}) => {
    const forecast = await getForecastData(location, days);

    return {
      content: [
        {
          type: 'text',
          text: `${days}-day forecast for ${location}: ${JSON.stringify(forecast)}`
        }
      ]
    };
  }
);

server.registerResource(
  'file',
  new ResourceTemplate('file:///{+path}', {list: undefined}),
  {
    title: 'file',
    description: 'file path',
    mimeType: 'text/plain'
  },
  async (uri, {path}) => {
    let text;
    try {
      text = await fs.readFile(String(path), 'utf-8');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      text = `Error reading file: ${message}`;
    }
    return {
      contents: [
        {
          uri: uri.href,
          text
        }
      ]
    };
  }
);

server.registerPrompt(
  'review-code',
  {
    title: 'review Cod(e',
    description: 'review a code',
    argsSchema: {
      code: z.string().describe('Code to review'),
      language: z.string().optional().describe('programming language')
    }
  },
  async ({code, language}) => {
    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `请review 下面这段 ${language ?? '代码'}: \n\n${code}`
          }
        }
      ]
    };
  }
);

// 辅助函数
async function getWeatherData(
  location: string
): Promise<{temperature: number; condition: string; location: string}> {
  // 模拟 API 调用
  return {
    temperature: 72.5,
    condition: 'Sunny',
    location: location
  };
}

async function getForecastData(location: string, days: number) {
  // 模拟 API 调用
  return Array.from({length: days}, (_, i) => ({
    day: i + 1,
    temperature: 70 + Math.floor(Math.random() * 10),
    conditions: i % 2 === 0 ? 'Sunny' : 'Partly Cloudy'
  }));
}

const transport = new StdioServerTransport();
server
  .connect(transport)
  .then(() => {
    console.error('qeubee mcp server started');
  })
  .catch(console.error);
