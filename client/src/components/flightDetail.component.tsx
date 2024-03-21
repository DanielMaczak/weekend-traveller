/**
 * @version 1.0.0
 */

//  External dependencies
import { useEffect, useState } from 'react';
import moment, { Moment } from 'moment';

//  Internal dependencies
import * as c from '../services/const.service';
import * as libFd from '../libraries/flightData.service';
import { getAirports } from '../services/flightData.service';

/**
 * Converts datetime from API to user's local.
 * @param time datetime to convert
 * @returns converted datetime
 */
const getTimeLocal = (time: number): Moment => {
  return moment.utc(time);
};

/**
 * @module
 * Table containing single flight details with accurate price.
 * Provides link to vendor page.
 * Price from flightData sometimes significantly diverges from indicated.
 * ALl cases I checked so far were correctly requested and processed,
 * but there might be error in back-end (assuming external API is correct).
 * @param flightData destination, price etc.
 * @param indicatedFlightPrice for comparison with final price
 * @param requestBody request generating flightInfo with additional info
 */
function FlightDetail({
  flightData,
  indicatedFlightPrice,
  requestBody,
}: {
  flightData: libFd.FlightInfo | undefined;
  indicatedFlightPrice: number;
  requestBody: libFd.FlightInfoRequest;
}) {
  //  State hooks
  const [flightInfo, setFlightInfo] = useState<libFd.FlightInfoProcessed>();

  //  Data load hooks
  useEffect(() => {
    if (flightData) {
      //  Initialize processed data object
      const finalFlightPrice: number = flightData.links.reduce(
        (totalPrice, link) => totalPrice + link.price,
        0
      );
      let flightDataProcessed: libFd.FlightInfoProcessed = {
        segments: [],
        links: flightData.links,
        significantPriceChange:
          finalFlightPrice / indicatedFlightPrice >= c.PRICE_CHANGE_THRESHOLD,
      };

      getAirports().then(airports => {
        if (!airports) return; // already checked in flight options

        //  Calculate start dates for travel there and back
        const travelDay: Moment = getTimeLocal(requestBody.travelDate);
        const returnDay: Moment = getTimeLocal(requestBody.returnDate ?? 0);

        //  Obtain airport and overnight travel info
        flightData.segments.forEach(segment => {
          const isReturnSegment: boolean = Boolean(
            requestBody.returnDate &&
              segment.departure >= requestBody.returnDate
          );
          flightDataProcessed.segments.push({
            //  Airport names
            originAirport:
              airports.find(airport => airport.value === segment.originPlaceId)
                ?.label ?? 'Unknown airport',
            destinationAirport:
              airports.find(
                airport => airport.value === segment.destinationPlaceId
              )?.label ?? 'Unknown airport',
            //  Time of flight
            departure: getTimeLocal(segment.departure).format('HH:mm'),
            arrival: getTimeLocal(segment.arrival).format('HH:mm'),
            //  Extra days for overnight travel
            //  There is a bug related to this information.
            //  Even though I explicitely load the values as UTC,
            //  JavaScript (moment.js) always reads it as local
            //  and calculates the days based on local timezone.
            //  I need to work without timezones because the data come
            //  with date relative to its location.
            //  As of now I have no clue how to fix it
            //  because the time is already compromised when loaded...
            departureAddDays: getTimeLocal(segment.departure).diff(
              isReturnSegment ? returnDay : travelDay,
              'days'
            ),
            arrivalAddDays: getTimeLocal(segment.arrival).diff(
              isReturnSegment ? returnDay : travelDay,
              'days'
            ),
            isReturnTrip: isReturnSegment,
          });
        });

        //  Assign final object
        setFlightInfo(flightDataProcessed);
      });
    }
  }, [flightData]);

  return (
    <>
      {flightInfo ? (
        <>
          {/* //  List individual flights */}
          {flightInfo?.segments.map(segment => (
            <div
              key={
                segment.originAirport +
                segment.departure +
                segment.destinationAirport +
                segment.arrival
              }
              className={
                'flight-tile-segment' +
                (segment.isReturnTrip ? ' flight-tile-return' : '')
              }
            >
              {/* //  Departure airport and time */}
              <p className="flight-tile-segment-info">
                <span className="flight-tile-segment-airport">
                  {segment.originAirport}
                </span>
                <span className="flight-tile-segment-time">
                  {segment.departureAddDays ? (
                    <sup className="flight-tile-add-days">
                      +{segment.departureAddDays}
                    </sup>
                  ) : (
                    ''
                  )}
                  {segment.departure}
                </span>
              </p>
              {/* //  Arrival airport and time */}
              <p className="flight-tile-segment-info">
                <span className="flight-tile-segment-airport">
                  {segment.destinationAirport}
                </span>
                <span className="flight-tile-segment-time">
                  {segment.arrivalAddDays ? (
                    <sup className="flight-tile-add-days">
                      +{segment.arrivalAddDays}
                    </sup>
                  ) : (
                    ''
                  )}
                  {segment.arrival}
                </span>
              </p>
            </div>
          ))}
          {/* //  Final price and link to vendor(s) */}
          {flightInfo?.links.map((link, i) => (
            <a
              key={link.vendorLink}
              target="_blank"
              rel="noreferrer"
              href={link.vendorLink}
            >
              <div
                className={
                  'flight-tile-final-price' +
                  (flightInfo.significantPriceChange
                    ? ' flight-tile-price-change'
                    : '')
                }
              >
                {flightInfo?.links.length > 1 ? (
                  <span>{`Visit vendor ${i + 1}:`}</span>
                ) : (
                  <span>{`Visit vendor:`}</span>
                )}
                <span>
                  {link.price.toLocaleString(requestBody.localeCode, {
                    style: 'currency',
                    currency: requestBody.currencyCode,
                  })}
                </span>
              </div>
            </a>
          ))}
        </>
      ) : (
        <div className="flight-tile-segment">
          <center>Loading details...</center>
        </div>
      )}
    </>
  );
}

export default FlightDetail;
