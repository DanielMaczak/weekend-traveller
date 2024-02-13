/**
 * @version 1.0.0
 */

//  External dependencies
import { useEffect, useState } from 'react';

//  Internal dependencies
import * as libFd from '../libraries/flightData.service';
import {
  getAirports,
  postFlightInfoRequest,
} from '../services/flightData.service';
import FlightDetail from './flightDetail.component';

//  External dependencies
import { useRef } from 'react';
import { Transition } from 'react-transition-group';

const duration = 500;

const defaultStyle = {
  transition: `${duration}ms ease-in-out`,
  maxHeight: 0,
};

const transitionStyles: { [key: string]: {} } = {
  entering: { maxHeight: 0 },
  entered: { maxHeight: '1000px' },
  exiting: { maxHeight: 0 },
  exited: { maxHeight: 0 },
};

/**
 * @module
 * Single flight tile with flight info.
 * On click it should query API for flight details.
 * The query code is in place on both ends but this feature
 * probably won't make it due to time constraints.
 * @param flightInfo destination, price etc.
 * @param requestBody request generating flightInfo with additional info
 * @param flightDate date of flight
 * @param returnDate date of return if not selected one way
 */
function FlightInfo({
  flightInfo,
  requestBody,
  flightDate,
  returnDate,
}: {
  flightInfo: libFd.CheapFlight;
  requestBody: libFd.CheapestFlightsRequest;
  flightDate: number;
  returnDate: number | undefined;
}) {
  //  State hooks
  const nodeRef = useRef(null);

  //  State hooks
  const [flightData, setFlightData] = useState<libFd.FlightInfo>();
  const [destination, setDestination] = useState<libFd.Option>();

  const [detailsVisible, showDetails] = useState(false);

  //  Data load hooks
  useEffect(() => {
    getAirports().then(airports => {
      if (!airports) return; // already checked in flight options
      const foundAirport: libFd.Option | undefined = airports.find(
        airport => airport.value === flightInfo.destinationPlaceId
      );
      if (!foundAirport) return;
      setDestination(foundAirport);
    });
  }, []);

  /**
   * Composes body of individual flight info request.
   * Uses input for flight list search so no validation needed.
   */
  const flightInfoRequest: libFd.FlightInfoRequest = {
    currencyCode: requestBody.currencyCode,
    localeCode: requestBody.localeCode,
    marketCode: requestBody.marketCode,
    originPlaceId: requestBody.originPlaceId,
    destinationPlaceId: flightInfo.destinationPlaceId,
    travelDate: flightDate,
  };
  const getFlightDetail = () => {
    showDetails(!detailsVisible);
    if (flightData) return;
    if (returnDate) {
      flightInfoRequest.returnDate = returnDate;
    }
    postFlightInfoRequest(flightInfoRequest).then(data => {
      if (!data) {
        alert(`Couldn't load data for this flight. Please try again later.`);
        if (detailsVisible) showDetails(!detailsVisible);
        return;
      }
      setFlightData(data);
    });
  };

  return (
    <>
      {destination ? (
        <li className="flight-tile" onClick={getFlightDetail}>
          <div className="flight-tile-header">{destination.label}</div>
          <div className="flight-tile-info">
            {/* Vendor pictures */}
            <div className="flight-tile-info-vendors">
              <img src={flightInfo.vendorTherePic} alt="" />
              {flightInfo.vendorBackPic ? (
                <img src={flightInfo.vendorBackPic} alt="" />
              ) : (
                ''
              )}
            </div>
            {/* Transfer / Price */}
            <div className="flight-tile-price-transfer">
              {flightInfo.hasTransfers && (
                <span className="flight-tile-transfer">Transfer</span>
              )}
              <span className="flight-tile-price">
                ~{' '}
                {flightInfo.price.toLocaleString(requestBody.localeCode, {
                  style: 'currency',
                  currency: requestBody.currencyCode,
                })}
              </span>
            </div>
          </div>

          <Transition nodeRef={nodeRef} in={detailsVisible} timeout={duration}>
            {(state: string) => (
              <div
                ref={nodeRef}
                className="flight-tile-detail"
                style={{
                  ...defaultStyle,
                  ...transitionStyles[state],
                }}
              >
                <FlightDetail
                  flightData={flightData}
                  requestBody={flightInfoRequest}
                />
              </div>
            )}
          </Transition>
        </li>
      ) : (
        ''
      )}
    </>
  );
}

export default FlightInfo;
