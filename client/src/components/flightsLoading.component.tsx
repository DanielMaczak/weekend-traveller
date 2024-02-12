/**
 * @version 1.0.0
 */

//  External dependencies
import { useRef } from 'react';
import { Transition } from 'react-transition-group';

const duration = 500;

const defaultStyle = {
  transition: `${duration}ms ease-in-out`,
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
 */
function FlightsLoading({
  loadingVisible,
  nextStep,
}: {
  loadingVisible: boolean;
  nextStep: (status: boolean) => void;
}) {
  //  State hooks
  const nodeRef = useRef(null);

  return (
    <>
      {' '}
      <Transition
        nodeRef={nodeRef}
        in={loadingVisible}
        timeout={duration}
        onExited={() => nextStep(true)}
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
