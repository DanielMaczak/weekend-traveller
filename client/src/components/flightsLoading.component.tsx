/**
 * @version 1.0.0
 */

/**
 * @module
 * Animated loading text while app searches for flights.
 */
function FlightsLoading() {
  return (
    <>
      <div className="flights-loading-container">
        <span className="flights-loading-airplane">✈</span>
        <span className="flights-loading-airplane">✈</span>
        <span className="flights-loading-airplane">✈</span>
        <span className="flights-loading-airplane">✈</span>
        <span className="flights-loading-airplane">✈</span>
        <span className="flights-loading-airplane">✈</span>
        <span className="flights-loading-airplane">✈</span>
        <span className="flights-loading-airplane">✈</span>
        <span className="flights-loading-airplane">✈</span>
        <span className="flights-loading-airplane">✈</span>
        <span className="flights-loading">
          We are loading your weekend travels...
        </span>
      </div>
    </>
  );
}

export default FlightsLoading;
