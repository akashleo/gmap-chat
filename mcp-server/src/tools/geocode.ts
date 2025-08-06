import { z } from 'zod';
import { ITool } from './tool.js';
import { GeocodeRequest } from '@googlemaps/google-maps-services-js';

const inputSchema = z.object({
  address: z.string().describe('The street address that you want to geocode, in the format used by the national postal service of the country concerned.'),
});

async function execute(client: any, params: z.infer<typeof inputSchema>, apiKey: string) {
  const requestParams: Partial<GeocodeRequest['params']> = {
    address: params.address,
    key: apiKey,
  };

  const response = await client.geocode({ params: requestParams });
  return response.data;
}

export const geocodeTool: ITool = {
  name: 'maps_geocode',
  description: 'Converts an address into geographic coordinates (latitude and longitude).',
  inputSchema,
  execute,
};
