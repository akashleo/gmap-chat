import { z } from 'zod';
import { ITool } from './tool.js';
import { DistanceMatrixRequest, TravelMode } from '@googlemaps/google-maps-services-js';

const latLngSchema = z.union([z.string(), z.object({ lat: z.number(), lng: z.number() })]);

const inputSchema = z.object({
  origins: z.array(latLngSchema).describe('An array of addresses, textual latitude/longitude values, or place IDs to use as origins for calculating distances.'),
  destinations: z.array(latLngSchema).describe('An array of addresses, textual latitude/longitude values, or place IDs to use as destinations for calculating distances.'),
  mode: z.nativeEnum(TravelMode).optional().describe('Specifies the mode of transport to use.'),
});

async function execute(client: any, params: z.infer<typeof inputSchema>, apiKey: string) {
  const requestParams: Partial<DistanceMatrixRequest['params']> = {
    origins: params.origins,
    destinations: params.destinations,
    key: apiKey,
  };

  if (params.mode) {
    requestParams.mode = params.mode;
  }

  const response = await client.distancematrix({ params: requestParams });
  return response.data;
}

export const distanceMatrixTool: ITool = {
  name: 'maps_distance_matrix',
  description: 'Calculates travel time and distance for a matrix of origins and destinations.',
  inputSchema,
  execute,
};
