import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "node",
  args: ["./dist/index.js"]
});

const client = new Client(
  {
    name: "example-client",
    version: "1.0.0"
  }
);

await client.connect(transport);

// List prompts
const prompts = await client.listPrompts();
console.log("Available prompts: ", prompts);

// Get a prompt
const prompt = await client.getPrompt({
  name: "review-code",
  arguments: {
    code: "console.log(\"hello\");"
  }
});

console.log("Prompt: ", prompt.messages[0].content);

// List resources
const resources = await client.listResources();
for (const resource in resources.resources) {
  console.log("Resource: ", resource);
}

// List resource templates
const templates = await client.listResourceTemplates();
for (const template of templates.resourceTemplates) {
  console.log("Resource template: ", template.name);
}

// Call add tool
const result = await client.callTool({
  name: "add",
  arguments: {
    a: 1,
    b: 8
  }
});

console.log("Add Tool result: ", result);

// Call weather tool
const weatherResult = await client.callTool({
  name: "weatherTool",
  arguments: {
    city: "San Francisco"
  }
});
console.log("Weather Tool result: ", weatherResult);