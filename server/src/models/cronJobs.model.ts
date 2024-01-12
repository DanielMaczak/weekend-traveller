import { Optional } from 'sequelize';

import { errors } from '../middleware/errorHandler.js';
import * as api from '../api/skyscanner.api.js';
import * as libApi from '../libraries/skyscanner.api.js';
import { Airports, Currencies } from '../databases/flightData.database.js';

const PLACE_TYPE_COUNTRY = 'PLACE_TYPE_COUNTRY';
const PLACE_TYPE_AIRPORTS = [
  'PLACE_TYPE_ISLAND',
  'PLACE_TYPE_CITY',
  'PLACE_TYPE_AIRPORT',
];

export const loadCurrencies = async (): Promise<void> => {
  //  Obtain data from API
  const dataIn: libApi.Currencies = await api.getCurrencies();
  if (!(dataIn instanceof Object))
    throw new errors.BadGateway('Data retrieved in unknown format.');
  //  Process data to internal format
  const dataProc: { code: string }[] = [];
  for (let currency of dataIn.currencies) {
    dataProc.push({ code: currency.code });
  }
  if (!dataProc.length) throw new errors.BadGateway('No data to process.');
  //  Store data in database
  await Currencies.truncate();
  await Currencies.bulkCreate(<Optional<any, string>[]>dataProc);
};

export const loadAirports = async (): Promise<void> => {
  //  Obtain data from API
  const dataIn: libApi.GeoHierarchy = await api.getGeoHierarchy('en-US');
  if (!(dataIn instanceof Object))
    throw new errors.BadGateway('Data retrieved in unknown format.');
  //  Process data to internal format
  const dataProc: { id: string; name: string }[] = [];
  for (let [placeId, place] of Object.entries(dataIn.places)) {
    if (place.iata && PLACE_TYPE_AIRPORTS.includes(place.type)) {
      //  Find parent country
      let parent = place;
      while (parent.parentId && parent.type !== PLACE_TYPE_COUNTRY) {
        parent = dataIn.places[parent.parentId];
      }
      //  Compose airport name
      let airport = `${place.name} (${place.iata})`.trim();
      if ((parent.type = PLACE_TYPE_COUNTRY)) airport += `, ${parent.name}`;
      dataProc.push({ id: placeId, name: airport });
    }
  }
  if (!Array.from(dataProc.keys()).length)
    throw new errors.BadGateway('No data to process.');
  //  Store data in database
  await Airports.truncate();
  await Airports.bulkCreate(<Optional<any, string>[]>dataProc);
};