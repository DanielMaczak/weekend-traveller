/**
 * @version 1.0.0
 */

//  External dependencies
import { useContext, useEffect, useState } from 'react';
import Select from 'react-select';

//  Internal dependencies
import { LocaleContext } from '../App';
import * as libFd from '../libraries/flightData.service';
import { getCurrencies } from '../services/flightData.service';

/**
 * @module
 * Top part of page. Shows logo and provides currency selection.
 * Market selector is listed as disabled:
 * it was meant as bonus feature where page would show in local language.
 * This might be possible via translation API call.
 * @param selectedCurrency auto-selected from Locale info
 * @param selectCurrency state hook updated when user makes own selection
 */
function Header({
  selectedCurrency,
  selectCurrency,
}: {
  selectedCurrency: string;
  selectCurrency: (currency: string) => void;
}) {
  //  State hooks
  const [currencies, setCurrencies] = useState<libFd.Currencies>();

  //  Data load hooks
  useEffect(() => {
    getCurrencies().then(response => {
      if (!response) {
        alert(
          `We couldn't load the currency list. ` +
            `The app will not function properly. Please try again later.`
        );
        return;
      }
      setCurrencies(response);
    });
  }, []);

  return (
    <>
      <header role="header">
        {/* Locale form */}
        <form action="submit" className="locale-options" role="locale-options">
          {/* Market selector # Disabled */}
          <div className="flight-option-wrapper-disabled">
            <label className="flight-option-label">Your location:</label>
            <span className="option-value">
              {useContext(LocaleContext).locationName}
            </span>
          </div>
          {/* Currency selector */}
          <div className="flight-option-wrapper">
            <label className="flight-option-label">Currency:</label>
            <Select
              className="option-dropdown"
              classNamePrefix="option-dropdown"
              value={{
                value: selectedCurrency,
                label: selectedCurrency,
              }}
              onChange={selected => selected && selectCurrency(selected.value)}
              options={currencies}
            />
          </div>
        </form>
        {/* Site logo */}
        <div className="header-logo" role="logo">
          <h1>Weekend Traveller</h1>
        </div>
      </header>
    </>
  );
}

export default Header;
