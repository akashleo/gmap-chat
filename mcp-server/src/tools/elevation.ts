import { z } from 'zod';
import { ITool } from './tool.js';
import { ElevationRequest } from '@googlemaps/google-maps-services-js';

const latLngSchema = z.object({ lat: z.number(), lng: z.number() });

const inputSchema = z.object({
  locations: z.array(latLngSchema).describe('An array of location objects for which to return elevation data.'),
});

async function execute(client: any, params: z.infer<typeof inputSchema>, apiKey: string) {
  const requestParams: Partial<ElevationRequest['params']> = {
    locations: params.locations,
    key: apiKey,
  };

  const response = await client.elevation({ params: requestParams });
  return response.data;
}

export const elevationTool: ITool = {
  name: 'maps_elevation',
  description: 'Provides elevation data for locations on the surface of the earth.',
  inputSchema,
  execute,
};
