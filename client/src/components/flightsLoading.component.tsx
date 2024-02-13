/**
 * @version 1.0.0
 * @version 1.1.0 Create new animation, add transition
 */

//  External dependencies
import { useRef } from 'react';
import { Transition } from 'react-transition-group';

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
  exited: { opacity: 0 },
};

/**
 * @module
 * Animated loading text while app searches for flights.
 * @param loadingVisible change of this triggers transition on-off
 * @param nextDashboard trigger for next dashboard to show up
 */
function FlightsLoading({
  loadingVisible,
  nextDashboard,
}: {
  loadingVisible: boolean;
  nextDashboard: () => void;
}) {
  //  State hooks
  const nodeRef = useRef(null);

  return (
    <>
      {' '}
      <Transition
        nodeRef={nodeRef}
        in={loadingVisible}
        timeout={transitionDuration}
        onExited={nextDashboard}
      >
        {(state: string) => (
          <div
            ref={nodeRef}
            style={{
              ...defaultStyle,
              ...transitionStyles[state],
            }}
            className="flights-loading-container"
          >
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
        )}
      </Transition>
    </>
  );
}

export default FlightsLoading;
