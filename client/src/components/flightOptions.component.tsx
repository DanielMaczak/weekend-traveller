/**
 * @version 1.0.0
 */

//  External dependencies
import { useContext, useState } from 'react';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { AsyncPaginate } from 'react-select-async-paginate';

//  Internal dependencies
import { LocaleContext } from '../App';
import * as libFd from '../libraries/flightData.service';
import * as c from '../services/const.service';
import { getAirports } from '../services/flightData.service';

//  CSS overloads
import './reactDatePicker.css';
import './reactSelect.css';

/**
 * Filters list of airports to limited number of entries.
 * Is intended for progressive loading of react-select-async-paginate
 * which solves performance issues when full list was loaded at once.
 * Applies search criteria if specified; ignores case.
 * @param limit number of entries to load
 * @param offset number of entries already loaded
 * @param search string to search in airport names
 * @returns filtered list of airports
 */
export const getAirportsPartition = async (
  limit: number,
  offset: number,
  search: string
): Promise<libFd.Airports | null> => {
  try {
    let partition = await getAirports();
    if (!partition) return null;
    if (search) {
      search = search.toLowerCase();
      partition = partition.filter(airport =>
        airport.label.toLowerCase().includes(search)
      );
    }
    return partition.slice(offset, limit + offset);
  } catch (err) {
    return null;
  }
};

/**
 * Triggers progressive loading of airports dropdown.
 * Overrides internal function of react-select-async-paginate.
 * Number of loaded options is capped at 100 for performance reasons.
 * @param search query from dropdown's searchbar
 * @param loadedOptions collection of options already loaded
 * @returns additional airports in requested format
 */
//  TODO resolve any
async function loadOptions(search: string, loadedOptions: any) {
  const partition = await getAirportsPartition(
    100,
    loadedOptions.length,
    search
  );
  if (!partition) {
    alert(
      `We couldn't load the airports list. ` +
        `The app will not function properly. Please try again later.`
    );
    return {
      options: [],
      hasMore: false,
    };
  }
  return {
    options: partition,
    hasMore: true,
  };
}

/**
 * @module
 * Top part of flights dashboard. Shows flight search properties and button.
 * Uses async dropdown for airport selection which never loads full list.
 * Full list has 4000+ airports and was causing frame drops.
 * User is expected to utilize search to select airport of their choice.
 * @param composeRequest hook action to update query request for flights
 */
function FlightOptions({
  composeRequest,
}: {
  composeRequest: (requestBody: libFd.CheapestFlightsRequest) => void;
}) {
  //  State hooks
  const [pickedAirport, pickAirport] = useState<libFd.Option>();
  const [tripLength, setTripLength] = useState<libFd.Option>(c.OPTION_ONE_WAY);
  const [showWeeks, setShowWeeks] = useState<libFd.Option>(
    c.OPTION_SHOW_WEEKS_DEF
  );
  const [startDate, setStartDate] = useState<Date | null>(
    c.OPTION_START_DATE_DEF
  );

  //  Context hooks
  const localeInfo: libFd.LocaleInfo = useContext(LocaleContext);

  /**
   * Composes body of cheapest flights search from controls in this view.
   * Checks inputs for validity before search.
   * @param e event to prevent default form submit behavior
   */
  const searchFlights = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();

    //  Check request inputs
    if (!pickedAirport) {
      alert(`Please select an airport.`);
      return;
    }
    if (!localeInfo.currencyCode) {
      alert('Please select one of valid Currency options.');
      return;
    }
    if (!startDate || startDate.valueOf() < c.OPTION_START_DATE_DEF.valueOf()) {
      alert(`Please select a valid future date.`);
      return;
    }
    if (
      !c.OPTIONS_TRIP_LENGTH.find(option => option.value === tripLength.value)
    ) {
      alert(`Please select one of valid Return options.`);
      return;
    }
    if (
      !c.OPTIONS_SHOW_WEEKS.find(option => option.value === showWeeks.value)
    ) {
      alert(`Please select one of valid Show options.`);
      return;
    }

    //  Componse request body
    const requestBody: libFd.CheapestFlightsRequest = {
      currencyCode: localeInfo.currencyCode,
      localeCode: localeInfo.localeCode,
      marketCode: localeInfo.marketCode,
      originPlaceId: pickedAirport.value,
      lookAtWeeks: Number(showWeeks.value),
      travelDate: startDate.valueOf(),
    };
    if (tripLength.value !== c.OPTION_ONE_WAY.value) {
      requestBody.returnDate = startDate.valueOf();
      requestBody.returnDate += 1000 * 3600 * 24 * Number(tripLength.value);
    }
    composeRequest(requestBody);
  };

  return (
    <>
      <nav className="flight-options-container">
        <form action="submit" className="flight-options" role="flight-options">
          {/* Origin selector */}
          <div className="flight-option-wrapper">
            <label className="flight-option-label">From:</label>
            <AsyncPaginate
              className="option-dropdown flight-options-from"
              classNamePrefix="option-dropdown"
              onChange={selected => selected && pickAirport(selected)}
              loadOptions={loadOptions}
              required
            />
          </div>
          {/* Start date picker */}
          <div className="flight-option-wrapper">
            <label
              htmlFor="flight-options-start-date"
              className="flight-option-label"
            >
              Start date:
            </label>
            <DatePicker
              id="flight-options-start-date"
              className="option-calendar flight-options-start-date"
              selected={startDate}
              onChange={date => setStartDate(date)}
              minDate={c.OPTION_START_DATE_DEF}
              required
            />
          </div>
          {/* Trip length selector */}
          <div className="flight-option-wrapper">
            <label className="flight-option-label">Return:</label>
            <Select
              className="option-dropdown"
              classNamePrefix="option-dropdown"
              defaultValue={c.OPTION_ONE_WAY}
              onChange={selected => selected && setTripLength(selected)}
              options={c.OPTIONS_TRIP_LENGTH}
              required
            />
            {tripLength.value !== c.OPTION_ONE_WAY.value ? (
              <label className="flight-option-label">
                {tripLength.value === '1' ? 'day' : 'days'}
              </label>
            ) : (
              ''
            )}
          </div>
          {/* Weeks to show selector */}
          <div className="flight-option-wrapper">
            <label className="flight-option-label">Show:</label>
            <Select
              className="option-dropdown"
              classNamePrefix="option-dropdown"
              defaultValue={c.OPTION_SHOW_WEEKS_DEF}
              onChange={selected => selected && setShowWeeks(selected)}
              options={c.OPTIONS_SHOW_WEEKS}
              required
            />
            <label className="flight-option-label">weeks</label>
          </div>
          {/* Search button */}
          <button
            className="flight-options-search"
            onClick={e => searchFlights(e)}
          >
            &#x1F50E;&#xFE0E;
          </button>
        </form>
      </nav>
    </>
  );
}

export default FlightOptions;
