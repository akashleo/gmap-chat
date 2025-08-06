import { z } from 'zod';
import { ITool } from './tool.js';
import { PlaceDetailsRequest } from '@googlemaps/google-maps-services-js';

const inputSchema = z.object({
  place_id: z.string().describe('A textual identifier that uniquely identifies a place, returned from a Place Search.'),
  fields: z.optional(z.array(z.string())).describe('A comma-separated list of place data types to return.'),
});

async function execute(client: any, params: z.infer<typeof inputSchema>, apiKey: string) {
  const requestParams: Partial<PlaceDetailsRequest['params']> = {
    place_id: params.place_id,
    key: apiKey,
  };

  if (params.fields) {
    requestParams.fields = params.fields;
  }

  const response = await client.placeDetails({ params: requestParams });
  return response.data;
}

export const placeDetailsTool: ITool = {
  name: 'get_place_details',
  description: 'Retrieves detailed information about a specific place, identified by its unique place ID.',
  inputSchema,
  execute,
};
