import { useEffect, useState } from 'react';
import * as libFd from '../libraries/flightData.service';
import { getAirports } from '../services/flightData.service';
import moment from 'moment';

interface FlightInfoProcessed {
  segments: {
    originAirport: string;
    destinationAirport: string;
    departure: string;
    arrival: string;
    departureAddDays: number;
    arrivalAddDays: number;
    isReturnTrip: boolean;
  }[];
  links: {
    vendorLink: string;
    price: number;
  }[];
}

function FlightDetail({
  flightData,
  requestBody,
}: {
  flightData: libFd.FlightInfo | undefined;
  requestBody: libFd.FlightInfoRequest;
}) {
  const [flightInfo, setFlightInfo] = useState<FlightInfoProcessed>();

  const getTimeLocal = (time: number) => {
    return moment(time).utc();
  };

  useEffect(() => {
    if (flightData) {
      let flightDataProcessed: FlightInfoProcessed = {
        segments: [],
        links: flightData.links,
      };

      getAirports().then(airports => {
        if (!airports) return; // already checked in flight options
        const travelDay: number = getTimeLocal(
          requestBody.travelDate
        ).dayOfYear();
        const returnDay: number = getTimeLocal(
          requestBody.returnDate ?? 0
        ).dayOfYear();
        flightData.segments.forEach(segment => {
          const isReturnSegment: boolean = Boolean(
            requestBody.returnDate &&
              segment.departure >= requestBody.returnDate
          );
          flightDataProcessed.segments.push({
            originAirport:
              airports.find(airport => airport.value === segment.originPlaceId)
                ?.label ?? 'Unknown airport',
            destinationAirport:
              airports.find(
                airport => airport.value === segment.destinationPlaceId
              )?.label ?? 'Unknown airport',
            departure: getTimeLocal(segment.departure).format('HH:mm'),
            arrival: getTimeLocal(segment.arrival).format('HH:mm'),
            departureAddDays:
              getTimeLocal(segment.departure).dayOfYear() -
              (isReturnSegment ? returnDay : travelDay),
            arrivalAddDays:
              getTimeLocal(segment.arrival).dayOfYear() -
              (isReturnSegment ? returnDay : travelDay),
            isReturnTrip: isReturnSegment,
          });
        });
        setFlightInfo(flightDataProcessed);
      });
    }
  }, [flightData]);

  return (
    <>
      {flightInfo ? (
        <>
          {flightInfo?.segments.map(segment => (
            <div
              className={
                'flight-tile-segment' +
                (segment.isReturnTrip ? ' flight-tile-return' : '')
              }
            >
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
