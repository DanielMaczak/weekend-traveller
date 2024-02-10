/**
 * @version 1.0.0
 */

//  External dependencies
import { useEffect, useState } from 'react';

//  Internal dependencies
import FlightsOverview from './flightsOverview';
import FlightOptions from './flightOptions.component';
import Home from './home.component';
import * as libFd from '../libraries/flightData.service';
import { postCheapestFlightsRequest } from '../services/flightData.service';
import FlightsLoading from './flightsLoading.component';

/**
 * @module
 * Section dedicated to searching flights.
 * Can be one of many if purpose of app grows.
 */
function FlightsDashboard() {
  //  State hooks
  const [cheapFlights, getCheapFlights] = useState<
    libFd.CheapestFlights | undefined
  >();
  const [requestBody, composeRequest] =
    useState<libFd.CheapestFlightsRequest>();

  //  Data load hooks
  useEffect(() => {
    if (requestBody) {
      getCheapFlights(undefined); // trigger loading page
      postCheapestFlightsRequest(requestBody).then(data => {
        if (!data) {
          alert(
            `We couldn't load the flight information. ` +
              `Please try again later.`
          );
          composeRequest(undefined);
          return;
        }
        getCheapFlights(data);
      });
    }
  }, [requestBody]);

  return (
    <>
      <FlightOptions composeRequest={composeRequest} />
      {cheapFlights && requestBody ? (
        // Request made and fulfilled
        <main role="main" style={{ flexGrow: 100 }}>
          <FlightsOverview
            cheapFlights={cheapFlights}
            requestBody={requestBody}
          />
        </main>
      ) : !cheapFlights && requestBody ? (
        // Request made but not yet fulfilled
        <main role="main" style={{ flexGrow: 100 }}>
          <FlightsLoading />
        </main>
      ) : (
        // No request
        <main role="main" style={{ flexGrow: 1 }}>
          <Home />
        </main>
      )}
    </>
  );
}

export default FlightsDashboard;
