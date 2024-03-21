/**
 * @author Daniel Maczak / where not specified otherwise
 * @version 1.0.0
 * @version 1.1.0 Move context provider into separate component,
 *                move currency hook into Header to reduce rerenders
 */

//  External dependencies
import 'react-datepicker/dist/react-datepicker.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';

//  Internal dependencies
import * as libFd from './libraries/flightData.service';
import * as c from './services/const.service';
import { postLocaleInfoRequest } from './services/flightData.service';
import Header from './components/header.component';
import FlightsDashboard from './components/flightsDashboard.component';
import Footer from './components/footer.component';

//  CSS overloads
import './components/reactToastify.css';

//  Locale info is present in majority of API requests anywhere in app
const defaultLocaleInfo: libFd.LocaleInfo = {
  // Fallback values
  marketCode: 'US',
  locationName: 'United states',
  currencyCode: 'USD',
  localeCode: 'en-US',
};
export const LocaleContext = React.createContext({
  localeInfo: defaultLocaleInfo,
  setLocaleInfo: (_: libFd.LocaleInfo) => {},
});

/**
 * @module
 * Top-level app component.
 */
function App() {
  return (
    <>
      <AppContext>
        <Header />
        <FlightsDashboard />
        <Footer />
      </AppContext>
      <ToastContainer />
    </>
  );
}

/**
 * Hosts context to reduce rerenders in App.
 * Provides locale info object to components.
 * @param props React props
 */
function AppContext(props: React.PropsWithChildren) {
  //  State hooks
  const [localeInfo, setLocaleInfo] =
    useState<libFd.LocaleInfo>(defaultLocaleInfo);

  //  Data update hooks
  useEffect(() => {
    postLocaleInfoRequest().then(data => {
      if (!data) return; // will use fallback values
      setLocaleInfo({ ...data, localeCode: c.GLOBAL_LOCALE });
    });
  }, []);

  return (
    <>
      <LocaleContext.Provider
        value={{
          localeInfo: localeInfo,
          setLocaleInfo: setLocaleInfo,
        }}
      >
        {props.children}
      </LocaleContext.Provider>
    </>
  );
}

export default App;
