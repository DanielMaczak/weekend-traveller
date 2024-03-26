/**
 * @module
 * Cron job management.
 * Job schedule is defined and initialized from here.
 * All jobs must be encapsulated in error catcher!
 * @version 1.0.0
 */

//  External dependencies
import { schedule, ScheduledTask } from 'node-cron';

//  Internal dependencies
import { loadCurrencies, loadAirports } from '../models/cronJobs.model.ts';
import { errorLogger, UnknownError } from '../middleware/errorHandler.ts';

//  Cron job schedules
const FLIGHT_DATA_SCHEDULE = `0 0 12 * * *`;

/**
 * Defines the crob job and starts the monitoring process.
 * All jobs must be encapsulated in error catcher!
 */
export const initCronJobs = async () => {
  const dataUpdate = async () => {
    try {
      await loadCurrencies();
      await loadAirports();
      console.log('Cron job finished');
    } catch (err) {
      errorLogger(new UnknownError(<Error>err));
    }
  };
  const jobFlightDataUpdate: ScheduledTask = await schedule(
    FLIGHT_DATA_SCHEDULE,
    dataUpdate
  );
  await jobFlightDataUpdate.start();
  console.log('Cron schedule initialized');
  await dataUpdate();
  console.log('Initial data update finished');
};
