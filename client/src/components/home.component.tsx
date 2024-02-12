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
  top: -5 + 'rem',
};

const transitionStyles: { [key: string]: {} } = {
  entering: { opacity: 0, top: -5 + 'rem' },
  entered: { opacity: 1, top: 0 + 'rem' },
  exiting: { opacity: 0, top: 15 + 'rem' },
  exited: { opacity: 0, top: -5 + 'rem' },
};

/**
 * @module
 * Home page before user makes selection.
 * Static module with app usage info.
 */
function Home({
  homeVisible,
  nextStep,
}: {
  homeVisible: boolean;
  nextStep: (status: boolean) => void;
}) {
  //  State hooks
  const nodeRef = useRef(null);

  return (
    <>
      <div className="welcome-container">
        <Transition
          nodeRef={nodeRef}
          in={homeVisible}
          timeout={duration}
          onExited={() => nextStep(true)}
        >
          {(state: string) => (
            <>
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
