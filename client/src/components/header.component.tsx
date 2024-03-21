/**
 * @version 1.0.0
 * @version 1.1.0 Optimize hook calls to reduce rerenders
 */

//  External dependencies
import { useContext, useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';

//  Internal dependencies
import { LocaleContext } from '../App';
import * as libFd from '../libraries/flightData.service';
import { getCurrencies } from '../services/flightData.service';
import { notifyError } from '../services/notification.service';

/**
 * @module
 * Top part of page. Shows logo and provides currency selection.
 * Market selector is listed as disabled:
 * it was meant as bonus feature where page would show in local language.
 * This might be possible via translation API call.
 */
function Header() {
  //  State hooks
  const { localeInfo, setLocaleInfo } = useContext(LocaleContext);
  const [currencies, setCurrencies] = useState<libFd.Currencies>();

  //  Data load hooks
  useEffect(() => {
    getCurrencies().then(response => {
      if (!response) {
        notifyError(
          `We couldn't load the currency list. ` +
            `The app will not function properly. Please try again later.`
        );
        return;
      }
      setCurrencies(response);
    });
  }, []);

  /**
   * Updates global context with currency selected by user.
   * @param selected value user selected
   */
  const updateCurrency = (selected: SingleValue<libFd.Option>) => {
    if (!selected) return;
    setLocaleInfo({
      ...localeInfo,
      currencyCode: selected.value,
    });
  };

  return (
    <>
      <header role="header">
        {/* Site logo */}
        <div className="header-logo" role="logo">
          <h1>Weekend Traveller</h1>
        </div>
        {/* Locale form */}
        <form action="submit" className="locale-options" role="locale-options">
          {/* Market selector # Disabled */}
          <div className="flight-option-wrapper-disabled">
            <label className="flight-option-label">Your location:</label>
            <span className="option-value">{localeInfo.locationName}</span>
          </div>
          {/* Currency selector */}
          <div className="flight-option-wrapper">
            <label className="flight-option-label">Currency:</label>
            <Select
              className="option-dropdown"
              classNamePrefix="option-dropdown"
              value={{
                value: localeInfo.currencyCode,
                label: localeInfo.currencyCode,
              }}
              onChange={selected => updateCurrency(selected)}
              options={currencies}
            />
          </div>
        </form>
      </header>
    </>
  );
}

export default Header;
