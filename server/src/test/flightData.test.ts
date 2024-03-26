/**
 * @module
 * Test suite for Weekend Traveller app.
 * Covers integration tests.
 * All tests use real API connection.
 * @version 1.0.0
 */

//  External dependencies
import request, { Response } from 'supertest';

//  Internal dependencies
import * as libFd from '../libraries/flightData.model.ts';
import * as mocks from './mocks.ts';
import { server } from '../index.ts';

//  Regex test objects
const numTest: RegExp = /\d+/;
const nameTest: RegExp = /^.+\(\w+\), \w+/;

//  Close server afterwards
afterAll(async () => {
  server.then(server => server.close());
});

describe('GET /currencies', () => {
  let res: Response;
  beforeAll(async () => {
    res = await request(await server).get('/currencies');
  });

  it('should return currencies', async () => {
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body).toContain('EUR');
    expect(res.body).toContain('USD');
  });

  it('should contain valid currency codes', async () => {
    res.body.forEach((currency: string) => {
      expect(currency).toHaveLength(3);
      expect(currency.toUpperCase()).toBe(currency);
    });
  });

  it('should not contain duplicate currencies', async () => {
    const itemCount: number = res.body.length;
    const uniqueCount: number = res.body.filter(
      (currency: string, i: number) => i === res.body.indexOf(currency)
    ).length;
    expect(itemCount).toBe(uniqueCount);
  });
});

describe('GET /airports', () => {
  let res: Response;
  beforeAll(async () => {
    res = await request(await server).get('/airports');
  });

  it('should return airports', async () => {
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.find((airport: string[]) => airport[1].includes('Berlin'));
    res.body.find((airport: string[]) => airport[1].includes('Dallas'));
  });

  it('should contain valid airport IDs', async () => {
    res.body.forEach((airport: string[]) => {
      expect(numTest.test(airport[0])).toBeTruthy();
    });
  });

  it('should contain valid airport names', async () => {
    res.body.forEach((airport: string[]) => {
      expect(nameTest.test(airport[1])).toBeTruthy();
    });
  });

  it('should not contain duplicate airports', async () => {
    //  Dupe items
    const itemCount: number = res.body.length;
    const uniqueCount: number = res.body.filter(
      (airport: string[], i: number) => i === res.body.indexOf(airport)
    ).length;
    expect(itemCount).toBe(uniqueCount);

    //  Dupe keys
    const ids: string[] = res.body.map((airport: string[]) => airport[0]);
    const uniqueIdCount: number = ids.filter(
      (id: string, i: number) => i === ids.indexOf(id)
    ).length;
    expect(ids.length).toBe(uniqueIdCount);
  });
});

describe('POST /request-locale-info', () => {
  let res: Response;
  beforeAll(async () => {
    res = await request(await server)
      .post('/request-locale-info')
      .send({ ipAddress: mocks.ipAddress })
      .set('Content-Type', 'application/json');
  });

  it('should provide locale info', async () => {
    expect(res.statusCode).toBe(200);
    expect(res.body?.marketCode).toBe('US');
    expect(res.body?.locationName).toBe('United States');
    expect(res.body?.currencyCode).toBe('USD');
    expect(res.body?.localeCode).toBe('en-US');
  });

  it('should catch incorrect input', async () => {
    //  Incomplete IP
    const resIncomplete = await request(await server)
      .post('/request-locale-info')
      .send({ ipAddress: '1.2.3.' })
      .set('Content-Type', 'application/json');
    expect(resIncomplete.statusCode).toBeGreaterThanOrEqual(400);

    //  Letters where numbers should be
    const resLetters = await request(await server)
      .post('/request-locale-info')
      .send({ ipAddress: 'b.a.a.d' })
      .set('Content-Type', 'application/json');
    expect(resLetters.statusCode).toBeGreaterThanOrEqual(400);

    //  Empty IP (no numbers)
    const resEmpty = await request(await server)
      .post('/request-locale-info')
      .send({ ipAddress: '...' })
      .set('Content-Type', 'application/json');
    expect(resEmpty.statusCode).toBeGreaterThanOrEqual(400);
  });
});

describe('POST /request-cheapest-flights', () => {
  let res: Response;
  beforeAll(async () => {
    res = await request(await server)
      .post('/request-cheapest-flights')
      .send(mocks.cheapestFlightsRequest)
      .set('Content-Type', 'application/json');
  });

  it('should provide cheapest flight options', async () => {
    const travelDate: string = String(mocks.cheapestFlightsRequest.travelDate);
    expect(res.statusCode).toBe(200);
    expect(Object.keys(res.body).length).toBe(
      mocks.cheapestFlightsRequest.lookAtWeeks
    );
    expect(res.body).toHaveProperty(travelDate);
    const cheapestFlights: libFd.CheapFlight[] = res.body[travelDate];
    expect(cheapestFlights.length).toBeGreaterThan(0);
    expect(cheapestFlights[0]).toHaveProperty('vendorTherePic');
    expect(cheapestFlights[0]).toHaveProperty('destinationPlaceId');
    expect(cheapestFlights[0]).toHaveProperty('hasTransfers');
    expect(cheapestFlights[0]).toHaveProperty('price');
  });

  it('should provide flight options sorted from cheapest', async () => {
    const travelDate: string = String(mocks.cheapestFlightsRequest.travelDate);
    const cheapestFlights: libFd.CheapFlight[] = res.body[travelDate];
    expect(cheapestFlights[0].price).toBeLessThanOrEqual(
      cheapestFlights[1].price
    );
  });

  it('should contain valid values', async () => {
    const travelDate: string = String(mocks.cheapestFlightsRequest.travelDate);
    const cheapestFlights: libFd.CheapFlight[] = res.body[travelDate];
    expect(numTest.test(cheapestFlights[0].destinationPlaceId)).toBeTruthy();
    expect(numTest.test(String(cheapestFlights[0].price))).toBeTruthy();
  });

  it('should catch incorrect input', async () => {
    //  Missing properties
    const reqIncomplete = {
      currencyCode: mocks.cheapestFlightsRequest.currencyCode,
      localeCode: mocks.cheapestFlightsRequest.localeCode,
    };
    const resIncomplete = await request(await server)
      .post('/request-cheapest-flights')
      .send(reqIncomplete)
      .set('Content-Type', 'application/json');
    expect(resIncomplete.statusCode).toBeGreaterThanOrEqual(400);

    //  Incorrect format of travel date
    const reqIncorrectTravelDate = {
      currencyCode: mocks.cheapestFlightsRequest.currencyCode,
      localeCode: mocks.cheapestFlightsRequest.localeCode,
      marketCode: mocks.cheapestFlightsRequest.marketCode,
      originPlaceId: mocks.cheapestFlightsRequest.originPlaceId,
      lookAtWeeks: mocks.cheapestFlightsRequest.lookAtWeeks,
      travelDate: 'abcd',
    };
    const resIncorrectTravelDate = await request(await server)
      .post('/request-cheapest-flights')
      .send(reqIncorrectTravelDate)
      .set('Content-Type', 'application/json');
    expect(resIncorrectTravelDate.statusCode).toBeGreaterThanOrEqual(400);

    //  Incorrect format of place ID
    const reqIncorrectPlaceId = {
      currencyCode: mocks.cheapestFlightsRequest.currencyCode,
      localeCode: mocks.cheapestFlightsRequest.localeCode,
      marketCode: mocks.cheapestFlightsRequest.marketCode,
      originPlaceId: 'abcd',
      lookAtWeeks: mocks.cheapestFlightsRequest.lookAtWeeks,
      travelDate: mocks.cheapestFlightsRequest.travelDate,
    };
    const resIncorrectPlaceId = await request(await server)
      .post('/request-cheapest-flights')
      .send(reqIncorrectPlaceId)
      .set('Content-Type', 'application/json');
    expect(resIncorrectPlaceId.statusCode).toBeGreaterThanOrEqual(400);
  });
});

describe('Incorrect routes', () => {
  it('should respond 404 for non-existent branches', async () => {
    //  Currencies
    const resPostCurrencies = await request(await server)
      .post('/currencies')
      .set('Content-Type', 'application/json');
    expect(resPostCurrencies.statusCode).toBe(404);

    //  Airports
    const resPostAirports = await request(await server)
      .post('/airports')
      .set('Content-Type', 'application/json');
    expect(resPostAirports.statusCode).toBe(404);

    //  Locale info
    const resGetLocaleInfo = await request(await server).get(
      '/request-locale-info'
    );
    expect(resGetLocaleInfo.statusCode).toBe(404);
  });

  it('should respond 404 for non-existent routes', async () => {
    //  Made up route
    const resGetMadeUp = await request(await server).get('/made-up-route');
    expect(resGetMadeUp.statusCode).toBe(404);
    const resPostMadeUp = await request(await server)
      .post('/made-up-route')
      .set('Content-Type', 'application/json');
    expect(resPostMadeUp.statusCode).toBe(404);

    //  Empty route
    const resGetEmpty = await request(await server).get('/');
    expect(resGetEmpty.statusCode).toBe(404);
  });
});
