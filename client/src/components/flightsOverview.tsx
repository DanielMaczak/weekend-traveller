/**
 * @version 1.0.0
 */

//  External dependencies
import moment from 'moment';

//  Internal dependencies
import * as libFd from '../libraries/flightData.service';
import FlightInfo from './flightInfo.component';

//  External dependencies
import { useRef } from 'react';
import { Transition } from 'react-transition-group';

const duration = 250;

const defaultStyle = {
  transition: `${duration}ms ease-in-out`,
  opacity: 0,
};

const transitionStyles: { [key: string]: {} } = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
};

/**
 * Date in ms with added weeks.
 * @param startDate date in ms
 * @param addWeeks whole number of weeks to offset from startDate
 * @return date in ms
 */
const getDateOffset = (
  startDate: number | string,
  addWeeks: number
): number => {
  if (typeof startDate === 'string') startDate = parseInt(startDate);
  return startDate + 1000 * 3600 * 24 * 7 * addWeeks;
};

/**
 * @module
 * Displays flight options in grid based on user's query.
 * @param cheapFlights object of sorted cheapest flights lists per day
 * @param requestBody request generating cheapFlights with additional info
 */
function FlightsOverview({
  cheapFlights,
  requestBody,
  flightsVisible,
  nextStep,
}: {
  cheapFlights: libFd.CheapestFlights;
  requestBody: libFd.CheapestFlightsRequest;
  flightsVisible: boolean;
  nextStep: (status: boolean) => void;
}) {
  //  State hooks
  const nodeRef = useRef(null);

  const columns: number = 4;

  //  Provide easy access to travel dates based on table column.
  const getTravelDate = (addWeeks: number): number =>
    getDateOffset(requestBody.travelDate, addWeeks);
  const getReturnDate = (addWeeks: number): number =>
    getDateOffset(requestBody.returnDate ?? 0, addWeeks);

  const moveFlightsOverview = (applyOffset: number) => {
    if (requestBody.lookAtWeeks <= columns) return;
    applyOffset = Math.min(1, Math.max(-1, applyOffset)) / columns;
    const overflowContainer: HTMLElement | null = document.getElementById(
      'flights-overview-overflow-container'
    );
    if (!overflowContainer) return;
    const minOffset: number = -(requestBody.lookAtWeeks - columns) / columns;
    const maxOffset: number = 0;
    let currentOffset: number =
      parseFloat(overflowContainer.style.left || '0') / 100;
    let newOffset: number = Math.min(
      maxOffset,
      Math.max(minOffset, currentOffset + applyOffset)
    );
    overflowContainer.style.left = newOffset * 100 + '%';
  };

  return (
    <>
      <Transition
        nodeRef={nodeRef}
        in={flightsVisible}
        timeout={duration}
        onExited={() => nextStep(true)}
      >
        {(state: string) => (
          <div
            ref={nodeRef}
            className="flights-overview-container"
            style={{
              ...defaultStyle,
              ...transitionStyles[state],
            }}
          >
            <button
              className="flights-overview-arrow arrow-left"
              onClick={() => moveFlightsOverview(1)}
            >
              <div>➤</div>
            </button>
            <button
              className="flights-overview-arrow arrow-right"
              onClick={() => moveFlightsOverview(-1)}
            >
              <div>➤</div>
            </button>
            <div className="flights-overview">
              <div
                id="flights-overview-overflow-container"
                className="flights-overview-overflow-container"
              >
                {/* Date headers */}
                <ul className="flights-overview-headers">
                  {Object.keys(cheapFlights).map((dayKey, i) => (
                    <li
                      key={`header.${dayKey}`}
                      className="flights-overview-header"
                    >
                      <h3>
                        {/* Show flight date */}
                        {moment(getTravelDate(i)).format('DD MMM YYYY')}
                        {/* Show return date if not one way */}
                        {requestBody.returnDate
                          ? ' / ' +
                            moment(getReturnDate(i)).format('DD MMM YYYY')
                          : ''}
                      </h3>
                    </li>
                  ))}
                </ul>
                {/* Flight tiles */}
                <ul className="flights-overview-tiles">
                  {Object.keys(cheapFlights).map((dayKey, i) => (
                    <ul
                      key={`list.${dayKey}`}
                      className="flights-overview-tile-column"
                    >
                      {cheapFlights[dayKey].map((flight, j) => (
                        <div
                          key={`${dayKey}.${flight.destinationPlaceId}.${flight.price}`}
                          ref={nodeRef}
                          style={{
                            ...defaultStyle,
                            transitionDelay: j * 0.1 + 's',
                            ...transitionStyles[state],
                          }}
                        >
                          <FlightInfo
                            flightInfo={flight}
                            requestBody={requestBody}
                            flightDate={getTravelDate(i)}
                            returnDate={
                              requestBody.returnDate
                                ? getReturnDate(i)
                                : undefined
                            }
                          />
                        </div>
                      ))}
                    </ul>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </Transition>
    </>
  );
}

export default FlightsOverview;
