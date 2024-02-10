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
  }[];
  vendorLink: string;
  price: string;
}

function FlightDetail({
  flightData,
  requestBody,
}: {
  flightData: libFd.FlightInfo;
  requestBody: libFd.CheapestFlightsRequest;
}) {
  const [flightInfo, setFlightInfo] = useState<FlightInfoProcessed>();

  useEffect(() => {
    let flightDataProcessed: FlightInfoProcessed = {
      segments: [],
      vendorLink: flightData.vendorLink,
      price: flightData.price.toLocaleString(requestBody.localeCode, {
        style: 'currency',
        currency: requestBody.currencyCode,
      }),
    };

    getAirports().then(airports => {
      if (!airports) return; // already checked in flight options
      flightData.segments.forEach(segment => {
        flightDataProcessed.segments.push({
          originAirport:
            airports.find(airport => airport.value === segment.originPlaceId)
              ?.label ?? 'Unknown airport',
          destinationAirport:
            airports.find(
              airport => airport.value === segment.destinationPlaceId
            )?.label ?? 'Unknown airport',
          departure: moment(segment.departure).format('HH:mm'),
          arrival: moment(segment.arrival).format('HH:mm'),
        });
      });
      setFlightInfo(flightDataProcessed);
    });
  }, []);

  return (
    <>
      {flightInfo?.segments.map(segment => (
        <div className="flight-tile-segment">
          <p className="flight-tile-segment-info">
            <span className="flight-tile-segment-airport">
              {segment.originAirport}
            </span>
            <span className="flight-tile-segment-time">
              {segment.departure}
            </span>
          </p>
          <p className="flight-tile-segment-info">
            <span className="flight-tile-segment-airport">
              {segment.destinationAirport}
            </span>
            <span className="flight-tile-segment-time">{segment.arrival}</span>
          </p>
        </div>
      ))}
      <a href={flightInfo?.vendorLink}>
        <div className="flight-tile-final-price">
          <span>Exact price:</span>
          <span>{flightInfo?.price}</span>
        </div>
      </a>
    </>
  );
}

export default FlightDetail;
