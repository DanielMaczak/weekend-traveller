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

function sleep(ms?: number) {
  return new Promise(resolve =>
    setTimeout(resolve, ms ? Math.max(0, ms) : 500)
  );
}
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

  const [homeVisible, showHome] = useState(false);
  const [loadingVisible, showLoading] = useState(false);
  const [flightsVisible, showFlights] = useState(false);

  const [dashboard, changeDashboard] = useState<JSX.Element>();

  //  Data load hooks
  useEffect(() => {
    showHome(true);
  }, []);
  useEffect(() => {
    changeDashboard(
      <Home
        homeVisible={homeVisible}
        nextStep={() => {
          showLoading(true);
          changeDashboard(
            <FlightsLoading
              loadingVisible={loadingVisible}
              nextStep={showFlights}
            />
          );
        }}
      />
    );
  }, [homeVisible]);

  useEffect(() => {
    showFlights(false);
    if (requestBody) {
      showHome(false);
    }
  }, [requestBody]);

  useEffect(() => {
    if (requestBody) {
      if (loadingVisible) {
        changeDashboard(
          <FlightsLoading loadingVisible={loadingVisible} nextStep={() => {}} />
        );
        getCheapFlights(undefined);
        postCheapestFlightsRequest(requestBody).then(data => {
          if (!data) {
            alert(
              `We couldn't load the flight information. ` +
                `Please try again later.`
            );
            composeRequest(undefined);
            return;
          }
          sleep(2000).then(() => {
            getCheapFlights(data);
          });
        });
      } else {
        // changeDashboard(
        //   <FlightsOverview
        //     cheapFlights={cheapFlights}
        //     requestBody={requestBody}
        //     flightsVisible={flightsVisible}
        //     nextStep={showLoading}
        //   />
        // );
        // showFlights(true);
        changeDashboard(
          <FlightsLoading
            loadingVisible={loadingVisible}
            nextStep={() => {
              console.log('next step2');
              changeDashboard(
                <FlightsOverview
                  cheapFlights={cheapFlights}
                  requestBody={requestBody}
                  flightsVisible={flightsVisible}
                  nextStep={showLoading}
                />
              );
              showFlights(true);
            }}
          />
        );
      }
    }
  }, [loadingVisible]);

  useEffect(() => {
    if (cheapFlights && requestBody) {
      showLoading(false);
    }
  }, [cheapFlights, flightsVisible]);

  // useEffect(() => {
  //   if (flightsVisible && cheapFlights && requestBody) {
  //   }
  // }, [flightsVisible]);

  useEffect(() => {
    if (cheapFlights && requestBody) {
      changeDashboard(
        <FlightsOverview
          cheapFlights={cheapFlights}
          requestBody={requestBody}
          flightsVisible={flightsVisible}
          nextStep={showLoading}
        />
      );
    }
  }, [flightsVisible]);

  console.log('refresh');

  return (
    <>
      <FlightOptions composeRequest={composeRequest} />
      <main role="main" style={{ flexGrow: homeVisible ? 1 : 20 }}>
        {dashboard}
        {/* {cheapFlights && requestBody ? (
          // Request made and fulfilled
          <FlightsOverview
            cheapFlights={cheapFlights}
            requestBody={requestBody}
          />
        ) : !cheapFlights && requestBody ? (
          // Request made but not yet fulfilled
          <FlightsLoading />
        ) : (
          // No request
          <Home homeVisible={homeVisible} />
        )} */}
      </main>
    </>
  );
}

export default FlightsDashboard;
