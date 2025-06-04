import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "Weather MCP Server",
    version: "1.0.0",
  });


  server.resource(
    'greeting',
    new ResourceTemplate("greeting://{name}", { list: undefined }),
    async (uri, { name }) => {
      return {
        contents: [{
          uri: uri.href,
          text: `Hello, ${name}!`
        }]
      };
    }
  );

  server.tool(
    "weatherTool",
    "Get weather info for a given city.",
    {
      city: z.string().describe("city name"),
    },
    async ({ city }) => {
      if (!city) {
        throw new Error("city name is required.");
      }

      const weather = await getWeather(city);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(weather, null, 2),
          },
        ],
      };
    },
  );

  server.tool(
    "forecastTool",
    {
      location: z.string().describe("location name"),
      days: z.number().default(3).describe("number of days for forecast"),
    },
    async ({ location, days }) => {
      const forecast = await getForecastData(location, days);

      return {
        content: [
          {
            type: "text",
            text: `${days}-day forecast for ${location}: ${JSON.stringify(forecast)}`
          }
        ]
      };
    }
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