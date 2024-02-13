/**
 * @version 1.0.0
 * @version 1.1.0 Rework contents, add transition
 */

//  External dependencies
import { useRef } from 'react';
import { Transition } from 'react-transition-group';

//  Transition setup
const transitionDuration = 500; // ms
const defaultStyle = {
  transition: `${transitionDuration}ms ease-in-out`,
  opacity: 0,
  top: -5 + 'rem',
};
const transitionStyles: { [key: string]: {} } = {
  entering: { opacity: 0, top: -5 + 'rem' },
  entered: { opacity: 1, top: 0 + 'rem' },
  exiting: { opacity: 0, top: 15 + 'rem' },
};

/**
 * @module
 * Home page before user makes selection.
 * Static module with app usage info.
 * Not shown on tablet and mobile.
 * @param homeVisible change of this triggers transition on-off
 * @param nextDashboard trigger for next dashboard to show up
 */
function Home({
  homeVisible,
  nextDashboard,
}: {
  homeVisible: boolean;
  nextDashboard: () => void;
}) {
  //  State hooks
  const nodeRef = useRef(null);

  return (
    <>
      <div className="welcome-container">
        <Transition
          nodeRef={nodeRef}
          in={homeVisible}
          timeout={transitionDuration}
          onExited={nextDashboard}
        >
          {(state: string) => (
            <>
              {/* Header */}
              <h2
                ref={nodeRef}
                className="welcome-headline"
                style={{
                  ...defaultStyle,
                  transitionDelay: '0.2s',
                  ...transitionStyles[state],
                }}
              >
                Your Journey
                <br />
                Starts Here!
              </h2>
              {/* First catch line */}
              <p
                ref={nodeRef}
                className="welcome-textline"
                style={{
                  ...defaultStyle,
                  transitionDelay: '0.1s',
                  ...transitionStyles[state],
                }}
              >
                We believe everyone deserves the thrill of exploration without
                breaking the bank.
              </p>
              {/* Second catch line */}
              <p
                ref={nodeRef}
                className="welcome-textline"
                style={{
                  ...defaultStyle,
                  transitionDelay: '0.0s',
                  ...transitionStyles[state],
                }}
              >
                Let's make every weekend an opportunity to discover something
                extraordinary together!
              </p>
            </>
          )}
        </Transition>
      </div>
    </>
  );
}

export default Home;
