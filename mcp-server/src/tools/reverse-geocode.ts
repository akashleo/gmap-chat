import { z } from 'zod';
import { ITool } from './tool.js';
import { ReverseGeocodeRequest } from '@googlemaps/google-maps-services-js';

const inputSchema = z.object({
  latlng: z.union([z.string(), z.object({ lat: z.number(), lng: z.number() })]).describe('The latitude and longitude values specifying the location for which you wish to obtain the closest, human-readable address.'),
});

async function execute(client: any, params: z.infer<typeof inputSchema>, apiKey: string) {
  const requestParams: Partial<ReverseGeocodeRequest['params']> = {
    latlng: params.latlng,
    key: apiKey,
  };

  const response = await client.reverseGeocode({ params: requestParams });
  return response.data;
}

export const reverseGeocodeTool: ITool = {
  name: 'maps_reverse_geocode',
  description: 'Converts geographic coordinates into a human-readable address.',
  inputSchema,
  execute,
};
