import { Client } from '@googlemaps/google-maps-services-js';
import { z } from 'zod';

/**
 * Defines the common structure for a tool that can be executed by the MCP server.
 */
export interface ITool {
  /**
   * The name of the tool, as it will be called from the backend.
   */
  name: string;

  /**
   * A human-readable description of what the tool does.
   */
  description: string;

  /**
   * A Zod schema that defines the expected input parameters for the tool.
   * This is used to validate incoming requests.
   */
  inputSchema: z.ZodObject<any, any, any>;

  /**
   * The function that executes the tool's logic.
   * @param client The authenticated Google Maps client.
   * @param params The validated input parameters.
   * @param apiKey The Google Maps API key.
   * @returns A promise that resolves with the result of the tool's execution.
   */
  execute(
    client: Client,
    params: z.infer<this['inputSchema']>, // Ensures params match the schema
    apiKey: string
  ): Promise<any>;
}
