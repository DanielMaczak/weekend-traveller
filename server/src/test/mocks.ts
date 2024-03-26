/**
 * @module
 * Mocks for server tests.
 * @version 1.0.0
 */

//  Internal dependencies
import * as libFd from '../libraries/flightData.model.ts';

//  Request data mocks
export const ipAddress: string = '8.8.8.8'; // Google DNS
export const cheapestFlightsRequest: libFd.CheapestFlightsRequest = {
  currencyCode: 'USD',
  localeCode: 'en-US',
  marketCode: 'US',
  originPlaceId: '95673502',
  lookAtWeeks: 1,
  travelDate: Date.now() + 1000 * 3600 * 24 * 7, // week from now
};
