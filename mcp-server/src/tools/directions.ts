import { z } from 'zod';
import { ITool } from './tool.js';
import { DirectionsRequest, TravelMode } from '@googlemaps/google-maps-services-js';

const latLngSchema = z.union([z.string(), z.object({ lat: z.number(), lng: z.number() })]);

const inputSchema = z.object({
  origin: latLngSchema.describe('The address, textual latitude/longitude value, or place ID from which you wish to calculate directions.'),
  destination: latLngSchema.describe('The address, textual latitude/longitude value, or place ID to which you wish to calculate directions.'),
  mode: z.nativeEnum(TravelMode).optional().describe('Specifies the mode of transport to use when calculating directions.'),
});

async function execute(client: any, params: z.infer<typeof inputSchema>, apiKey: string) {
  const requestParams: Partial<DirectionsRequest['params']> = {
    origin: params.origin,
    destination: params.destination,
    key: apiKey,
  };

  if (params.mode) {
    requestParams.mode = params.mode;
  }

  const response = await client.directions({ params: requestParams });
  return response.data;
}

export const directionsTool: ITool = {
  name: 'maps_directions',
  description: 'Calculates directions between an origin and a destination.',
  inputSchema,
  execute,
};
