/**
 * @version 1.0.0
 * @version 1.1.0 Implement transitions between all dashboards
 */

//  External dependencies
import { useEffect, useState } from 'react';

//  Internal dependencies
import FlightsOverview from './flightsOverview';
import FlightOptions from './flightOptions.component';
import FlightsLoading from './flightsLoading.component';
import Home from './home.component';
import * as libFd from '../libraries/flightData.service';
import * as c from '../services/const.service';
import { postCheapestFlightsRequest } from '../services/flightData.service';

/**
 * @module
 * Section dedicated to searching flights.
 * Contains quite complex logic of swapping and transitioning between views.
 * I can safely confess that I shot myself in foot with this one:
 * I though this website was too small to necesitate router,
 * but in hindsight it would have saved me a lot of time with those transitions...
 * #lessonLearnt
 */
function FlightsDashboard() {
  //  State hooks
  const [homeVisible, showHome] = useState(false);
  const [loadingVisible, showLoading] = useState(false);
  const [flightsVisible, showFlights] = useState(false);
  const [dashboard, changeDashboard] = useState<JSX.Element>();
  const [cheapFlights, getCheapFlights] = useState<
    libFd.CheapestFlights | undefined
  >();
  const [requestBody, composeRequest] =
    useState<libFd.CheapestFlightsRequest>();

  //  Dashboard generators
  const generateHome = (nextDashboard: () => void = () => {}) => {
    changeDashboard(
      <Home homeVisible={homeVisible} nextDashboard={nextDashboard} />
    );
  };
  const generateLoading = (nextDashboard: () => void = () => {}) => {
    changeDashboard(
      <FlightsLoading
        loadingVisible={loadingVisible}
        nextDashboard={nextDashboard}
      />
    );
  };
  const generateFlights = (nextDashboard: () => void = () => {}) => {
    if (cheapFlights && requestBody) {
      changeDashboard(
        <FlightsOverview
          cheapFlights={cheapFlights}
          requestBody={requestBody}
          flightsVisible={flightsVisible}
          nextDashboard={nextDashboard}
        />
      );
    }
  };

  //  1.  This trigger ensures homepage is
  //      loaded and animated on first page load.
  useEffect(() => {
    showHome(true);
  }, []);

  //  2.  Is triggered by previous hook and loads the homepage.
  //      They cannot go in the same step
  //      because state management in React is asynchronous.
  //      This step also assigns loading dashboard as next step after homepage.
  useEffect(() => {
    generateHome(() => {
      showLoading(true);
      generateLoading();
    });
  }, [homeVisible]);

  //  3.  User made flight search, we need to show loading.
  //      We trigger nextDashboard function in flights and homepage dashboards,
  //      both of which have loading assigned.
  useEffect(() => {
    showFlights(false);
    requestBody && showHome(false);
  }, [requestBody]);

  //  4.  Loading state was triggered via step #3.
  //      We show loading and initiate data load.
  //      I was super proud of the loading animation
  //      so I set it to stay for at least 2 seconds on purpose.
  useEffect(() => {
    if (requestBody) {
      //  Update loading dashboard
      generateLoading(() => {
        showFlights(true);
        generateFlights(() => showLoading(true));
      });
      //  If loading was requested, perform flight search
      if (loadingVisible) {
        getCheapFlights(undefined); // throw away old data
        const finishLoading: number = Date.now() + c.CSS_MIN_LOADING_DURATION;
        postCheapestFlightsRequest(requestBody).then(data => {
          if (!data) {
            alert(
              `We couldn't load the flight information. ` +
                `Please try again later.`
            );
            composeRequest(undefined);
            showHome(true);
            return;
          }
          setTimeout(
            () => getCheapFlights(data),
            Math.max(finishLoading - Date.now())
          );
        });
      }
    }
  }, [loadingVisible]);

  //  5.  Triggers when flights are loaded.
  //      At this point we can turn off loading dashboard
  //      which in turn switches to flights.
  useEffect(() => {
    cheapFlights && requestBody && showLoading(false);
  }, [cheapFlights]);

  //  6.  Displays flights overview and is set to switch back to loading
  //      if given instruction to exit via step #3 (new flight search).
  useEffect(() => {
    generateFlights(() => {
      showLoading(true);
      generateLoading();
    });
  }, [flightsVisible]);

  return (
    <>
      <FlightOptions composeRequest={composeRequest} />
      <main role="main" style={{ flexGrow: homeVisible ? 1 : 20 }}>
        {dashboard}
      </main>
    </>
  );
}

export default FlightsDashboard;
