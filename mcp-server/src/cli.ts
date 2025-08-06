#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import dotenv from 'dotenv';
import { startServer } from './index.js';

dotenv.config();

yargs(hideBin(process.argv))
  .command(
    '$0',
    'Starts the MCP Google Map server',
    (yargs) => {
      return yargs
        .option('port', {
          alias: 'p',
          type: 'number',
          description: 'Port to run the server on',
          default: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
        })
        .option('apikey', {
          alias: 'k',
          type: 'string',
          description: 'Google Maps API Key',
          default: process.env.GOOGLE_MAPS_API_KEY,
        });
    },
    (argv) => {
      if (!argv.apikey) {
        console.error('Error: Google Maps API Key is required. Provide it with --apikey or in a .env file as GOOGLE_MAPS_API_KEY.');
        process.exit(1);
      }
      startServer(argv.port, argv.apikey);
    }
  )
  .help()
  .parse();
