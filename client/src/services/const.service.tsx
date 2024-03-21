/**
 * @module
 * Global storage for public constants.
 * All objects must be frozen to ensure immutability.
 * Import module as 'c' (for convenience).
 * @version 1.0.0
 * @version 1.1.0 Add more constants
 */

//  Internal dependencies
import * as libFd from '../libraries/flightData.service';

/**
 * API connection constants
 * @constant SERVER_URL address of your webserver
 * @constant IP_REQUEST_URL used for Locale Info request which requires user IP
 */
export const SERVER_URL: string = `http://localhost:3000`;
export const IP_REQUEST_URL: string = `https://api.ipify.org?format=json`;

/**
 * Element ID constants
 * @constant ID_OPTIONS_FROM airport selection dropdown
 */
export const ID_OPTIONS_FROM: string = 'flight-options-from';
export const ID_NAV_MENU: string = 'navbar-flight-options';
export const ID_NAV_BUTTON: string = 'navbar-mobile-menu';
export const ID_FLIGHTS_CONTAINER: string =
  'flights-overview-overflow-container';

/**
 * CSS related constants
 * @constant CSS_SCREEN_WIDTH_MOBILE identifies user device as mobile
 * @constant CSS_SCREEN_WIDTH_TABLET mid-size user device
 */
export const CSS_SCREEN_WIDTH_MOBILE: number = 576;
export const CSS_SCREEN_WIDTH_TABLET: number = 996;
export const CSS_MIN_LOADING_DURATION: number = 2000;

/**
 * Website calculations constants
 * @constant PRICE_CHANGE_THRESHOLD max acceptable % of price change from indicated
 */
export const PRICE_CHANGE_THRESHOLD: number = 1.2;

/**
 * Request options
 * @constant GLOBAL_LOCALE decided to ignore user's locale due to time constraint
 * @constant OPTIONS_SHOW_WEEKS weeks to display, value MUST be a number
 * @constant OPTIONS_TRIP_LENGTH defines return date, value MUST be a number
 * @constant OPTION_SHOW_WEEKS_DEF default on initial load
 * @constant OPTION_START_DATE_DEF tomorrow, default on initial load
 * @constant OPTION_ONE_WAY no-return search, default on initial load
 */
export const GLOBAL_LOCALE: string = 'en-US';

export const OPTIONS_SHOW_WEEKS: libFd.Option[] = [
  { value: '4', label: '4' },
  { value: '6', label: '6' },
  { value: '8', label: '8' },
];

export const OPTIONS_TRIP_LENGTH: libFd.Option[] = Array.from(
  { length: 29 }, // return today plus 4 weeks
  (_, i: number) => ({ value: String(i), label: String(i) })
);

export const OPTION_SHOW_WEEKS_DEF: libFd.Option = OPTIONS_SHOW_WEEKS[0];

export const OPTION_START_DATE_DEF: Date = new Date(Date.now());
OPTION_START_DATE_DEF.setDate(OPTION_START_DATE_DEF.getDate() + 1);

export const OPTION_ONE_WAY: libFd.Option = { value: '-1', label: 'One way' };
OPTIONS_TRIP_LENGTH.unshift(OPTION_ONE_WAY);

//  Freeze objects!
Object.freeze(OPTIONS_SHOW_WEEKS);
Object.freeze(OPTIONS_TRIP_LENGTH);
Object.freeze(OPTION_SHOW_WEEKS_DEF);
Object.freeze(OPTION_START_DATE_DEF);
Object.freeze(OPTION_ONE_WAY);
