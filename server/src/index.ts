/**
 * @module
 * Initializes DB connection and express server with Cron job schedule.
 * Core server properties are defined here.
 * @author Daniel Maczak / where not specified otherwise
 * @version 1.0.0
 */

import 'dotenv/config';

//  External dependencies
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors, { CorsOptions } from 'cors';

//  Internal dependencies
import { initSequelize } from './databases/flightData.database.ts';
import { initCronJobs } from './controllers/cronJobs.controller.ts';
import { router } from './router.ts';
import { errorHandler } from './middleware/errorHandler.ts';

const SERVER_URL: string = process.env.SERVER_URL;
const SERVER_PORT: number = process.env.SERVER_PORT;
const CLIENT_URL: string = process.env.CLIENT_URL;
const CLIENT_PORT: number = process.env.CLIENT_PORT;

const corsOptions: CorsOptions = {
  origin: `http://${CLIENT_URL}:${CLIENT_PORT}`,
  methods: ['GET', 'POST'], // we don't use more
};

/**
 * Initializes all processes of this webserver app.
 * Is auto-initialized on server start.
 * Is exported so that Jest can close the connection when done testing.
 */
export const server = (async () => {
  await initSequelize();
  await initCronJobs();
  const app: Application = express();
  app
    .use(cors(corsOptions))
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use(router)
    .use(errorHandler);
  return app.listen(SERVER_PORT, SERVER_URL, () => {
    console.log(`Webserver on: ${SERVER_URL}:${SERVER_PORT}`);
  });
})();
