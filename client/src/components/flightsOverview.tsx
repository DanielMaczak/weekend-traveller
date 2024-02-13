/**
 * @version 1.0.0
 * @version 1.1.0 Add buttons to move view when more weeks are loaded,
 *                add transition
 */

//  External dependencies
import { useRef } from 'react';
import { Transition } from 'react-transition-group';
import moment from 'moment';

//  Internal dependencies
import * as c from '../services/const.service';
import * as libFd from '../libraries/flightData.service';
import FlightInfo from './flightInfo.component';

//  Transition setup
const transitionDuration = 250; // ms
const defaultStyle = {
  transition: `${transitionDuration}ms ease-in-out`,
  opacity: 0,
};
const transitionStyles: { [key: string]: {} } = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
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
 * @param flightsVisible change of this triggers transition on-off
 * @param nextDashboard trigger for next dashboard to show up
 */
function FlightsOverview({
  cheapFlights,
  requestBody,
  flightsVisible,
  nextDashboard,
}: {
  cheapFlights: libFd.CheapestFlights;
  requestBody: libFd.CheapestFlightsRequest;
  flightsVisible: boolean;
  nextDashboard: () => void;
}) {
  //  State hooks
  const nodeRef = useRef(null);

  //  Provide easy access to travel dates based on table column.
  const getTravelDate = (addWeeks: number): number =>
    getDateOffset(requestBody.travelDate, addWeeks);
  const getReturnDate = (addWeeks: number): number =>
    getDateOffset(requestBody.returnDate ?? 0, addWeeks);

  //  Calculate number of displayed columns
  const screenWidth: number =
    document.body.clientWidth * window.devicePixelRatio;
  const columns: number =
    screenWidth <= c.CSS_SCREEN_WIDTH_MOBILE
      ? 1 // show single column for mobile
      : screenWidth <= c.CSS_SCREEN_WIDTH_TABLET
      ? 2 // columns for mid-size devices
      : 4; // columns for anything bigger

  /**
   * Applies offset to flights overview to scroll to next / previous week.
   * Positive offset moves to the left.
   * @param applyOffset 1 or -1 to move left or right by one tile
   */
  const moveFlightsOverview = (applyOffset: -1 | 1) => {
    if (requestBody.lookAtWeeks <= columns) return;

    //  Locate flights tile container to offset
    const overflowContainer: HTMLElement | null = document.getElementById(
      c.ID_FLIGHTS_CONTAINER
    );
    if (!overflowContainer) return;

    //  Calculate new offset to apply:

    //  1. Offset % based on tile width
    applyOffset /= columns;
    //  2. Count hidden columns to determine maximum offset distance in %
    const hiddenColumns: number = Math.max(
      requestBody.lookAtWeeks - columns,
      0
    );
    const minOffset: number = -hiddenColumns / columns;
    const maxOffset: number = 0;
    //  3. Determine current applied offset as % (can be empty string)
    let currentOffset: number =
      parseFloat(overflowContainer.style.left || '0') / 100;
    //  4. Apply custom offset while staying within limits
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
        timeout={transitionDuration}
        onExited={nextDashboard}
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
            {/* Show previous week */}
            <button
              className="flights-overview-arrow arrow-left"
              onClick={() => moveFlightsOverview(1)}
            >
              <div>➤</div>
            </button>
            {/* Show next week */}
            <button
              className="flights-overview-arrow arrow-right"
              onClick={() => moveFlightsOverview(-1)}
            >
              <div>➤</div>
            </button>
            {/* Flights overview */}
            <div className="flights-overview">
              <div
                id={c.ID_FLIGHTS_CONTAINER}
                className="flights-overview-overflow-container"
              >
                {/*
                Date headers
                */}
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
                {/*
                Flight tiles
                */}
                <ul className="flights-overview-tiles">
                  {Object.keys(cheapFlights).map((dayKey, i) => (
                    <ul
                      key={`list.${dayKey}`}
                      className="flights-overview-tile-column"
                    >
                      {/* When no flights were found for the date */}
                      {!cheapFlights[dayKey].length && (
                        <div className="flights-overview-no-flights">
                          No flight options found for this date
                        </div>
                      )}
                      {/* Generate flight info tile */}
                      {cheapFlights[dayKey].map((flight, flightIt) => (
                        <div
                          key={`${dayKey}.${flight.destinationPlaceId}.${flight.price}`}
                          ref={nodeRef}
                          style={{
                            ...defaultStyle,
                            transitionDelay: flightIt * 0.1 + 's',
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
