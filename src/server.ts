import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "Weather MCP Server",
    version: "1.0.0"
  });

  server.tool(
    "weatherTool",
    {
      city: z.string().describe("city name"),
    },
    async ({ city }) => {
      if (!city) {
        return {
          content: [
            {
              type: "text",
              text: "Please provide a city name.",
            },
          ],
        };
      }
      const weatherData = await getWeather(city);

      return {
        content: [
          {
            type: "text",
            text: `The weather in ${weatherData.location} is currently ${weatherData.temperature}°C with ${weatherData.condition}.`,
          },
        ],
      };
    },
  );

  // Add an addition tool
  server.tool("add",
    { a: z.number(), b: z.number() },
    async ({ a, b }) => ({
      content: [{ type: "text", text: String(a + b) }]
    })
  );

  // Add a dynamic greeting resource
  server.resource(
    "file",
    new ResourceTemplate("file://{path}", { list: undefined }),
    async (uri, { path }) => ({
      contents: [{
        uri: uri.href,
        text: `File, ${path}!`
      }]
    })
  );

  server.prompt(
    "review-code",
    { code: z.string() },
    ({ code }) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `Please review this code:\n\n${code}`
        }
      }]
    })
  );

  return server;
}

async function getWeather(location: string) {
  // Simulate fetching weather data
  return {
    location: location,
    temperature: Math.floor(Math.random() * 30),
    condition: "Sunny",
  };
}

async function getForecastData(location: string, days: number) {
  return Array.from({ length: days }, (_, i) => ({
    day: i + 1,
    temperature: 70 + Math.floor(Math.random() * 10),
    conditions: i % 2 === 0 ? 'Sunny' : 'Partly Cloudy'
  }));
}