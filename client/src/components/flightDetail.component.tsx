/**
 * @version 1.0.0
 */

//  External dependencies
import { useEffect, useState } from 'react';
import moment, { Moment } from 'moment';

//  Internal dependencies
import * as libFd from '../libraries/flightData.service';
import { getAirports } from '../services/flightData.service';

/**
 * Converts datetime from API to user's local.
 * @param time datetime to convert
 * @returns converted datetime
 */
const getTimeLocal = (time: number): Moment => {
  return moment(time).utc();
};

/**
 * Returns days since begining of time in JS.
 * @param time time object from moment lib
 * @returns number of days
 */
const getDayOfEpoch = (time: Moment): number => {
  return Math.floor(time.valueOf() / 86400000);
};

/**
 * @module
 * Table containing single flight details with accurate price.
 * Provides link to vendor page.
 * @param flightData destination, price etc.
 * @param requestBody request generating flightInfo with additional info
 */
function FlightDetail({
  flightData,
  requestBody,
}: {
  flightData: libFd.FlightInfo | undefined;
  requestBody: libFd.FlightInfoRequest;
}) {
  //  State hooks
  const [flightInfo, setFlightInfo] = useState<libFd.FlightInfoProcessed>();

  //  Data load hooks
  useEffect(() => {
    if (flightData) {
      //  Initialize processed data object
      let flightDataProcessed: libFd.FlightInfoProcessed = {
        segments: [],
        links: flightData.links,
      };
      getAirports().then(airports => {
        if (!airports) return; // already checked in flight options

        //  Calculate start dates for travel there and back
        const travelDay: number = getDayOfEpoch(
          getTimeLocal(requestBody.travelDate)
        );
        const returnDay: number = getDayOfEpoch(
          getTimeLocal(requestBody.returnDate ?? 0)
        );

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
            departureAddDays:
              getDayOfEpoch(getTimeLocal(segment.departure)) -
              (isReturnSegment ? returnDay : travelDay),
            arrivalAddDays:
              getDayOfEpoch(getTimeLocal(segment.arrival)) -
              (isReturnSegment ? returnDay : travelDay),
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
            <a target="_blank" rel="noreferrer" href={link.vendorLink}>
              <div className="flight-tile-final-price">
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
