import express from 'express';
import { Client } from '@googlemaps/google-maps-services-js';
import { toolMap } from './tools/index.js';

export function startServer(port: number, apiKey: string) {
  const app = express();
  app.use(express.json());

  const client = new Client({});

  app.post('/mcp', async (req, res) => {
    const { tool_name, parameters } = req.body;

    if (typeof tool_name !== 'string') {
      return res.status(400).json({ error: 'Invalid tool_name' });
    }

    const tool = toolMap[tool_name];
    if (!tool) {
      return res.status(404).json({ error: `Tool '${tool_name}' not found.` });
    }

    try {
      // Validate parameters with Zod
      const validatedParams = tool.inputSchema.parse(parameters);

      console.log(`Executing tool: ${tool_name}`);
      const result = await tool.execute(client, validatedParams, apiKey);

      return res.json({ result });
    } catch (error: any) {
      console.error(`Error executing tool '${tool_name}':`, error);
      // Handle Zod validation errors
      if (error.errors) {
        return res.status(400).json({ error: 'Invalid parameters', details: error.flatten() });
      }
      return res.status(500).json({ error: error.message || 'An internal error occurred' });
    }
  });

  app.get('/tools', (req, res) => {
    const availableTools = Object.values(toolMap).map(t => ({ 
        name: t.name, 
        description: t.description 
    }));
    res.json(availableTools);
  });

  app.listen(port, () => {
    console.log(`MCP Server listening on http://localhost:${port}`);
    console.log('Press Ctrl+C to stop the server.');
  });
}
