import { searchNearbyTool } from './search-nearby.js';
import { placeDetailsTool } from './place-details.js';
import { geocodeTool } from './geocode.js';
import { reverseGeocodeTool } from './reverse-geocode.js';
import { directionsTool } from './directions.js';
import { distanceMatrixTool } from './distance-matrix.js';
import { elevationTool } from './elevation.js';
import { ITool } from './tool.js';

// A map of all available tools, indexed by their name.
export const toolMap: Record<string, ITool> = {
  [searchNearbyTool.name]: searchNearbyTool,
  [placeDetailsTool.name]: placeDetailsTool,
  [geocodeTool.name]: geocodeTool,
  [reverseGeocodeTool.name]: reverseGeocodeTool,
  [directionsTool.name]: directionsTool,
  [distanceMatrixTool.name]: distanceMatrixTool,
  [elevationTool.name]: elevationTool,
};
