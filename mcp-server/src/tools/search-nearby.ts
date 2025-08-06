import { z } from 'zod';
import { ITool } from './tool.js';
import { TextSearchRequest } from '@googlemaps/google-maps-services-js';

const inputSchema = z.object({
  query: z.string().describe('The text string on which to search, for example: "restaurant" or "123 Main Street".'),
  location: z.optional(z.object({ lat: z.number(), lng: z.number() })).describe('The point around which to retrieve place information.'),
  radius: z.optional(z.number()).describe('Defines the distance (in meters) within which to return place results.'),
});

async function execute(client: any, params: z.infer<typeof inputSchema>, apiKey: string) {
  const requestParams: Partial<TextSearchRequest['params']> = {
    query: params.query,
    key: apiKey,
  };

  if (params.location) {
    requestParams.location = params.location;
  }
  if (params.radius) {
    requestParams.radius = params.radius;
  }

  const response = await client.textSearch({ params: requestParams });
  return response.data;
}

export const searchNearbyTool: ITool = {
  name: 'search_nearby',
  description: 'Searches for places based on a text query, such as "restaurants in New York".',
  inputSchema,
  execute,
};
