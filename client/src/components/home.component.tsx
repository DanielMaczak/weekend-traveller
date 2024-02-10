/**
 * @version 1.0.0
 */

/**
 * @module
 * Home page before user makes selection.
 * Static module with app usage info.
 */
function Home() {
  return (
    <>
      <div className="welcome-container">
        <h2 className="welcome-headline">
          Your Journey
          <br />
          Starts Here!
        </h2>
        <p className="welcome-textline">
          We believe everyone deserves the thrill of exploration without
          breaking the bank.
        </p>
        <p className="welcome-textline">
          Let's make every weekend an opportunity to discover something
          extraordinary together!
        </p>
      </div>
    </>
  );
}

export default Home;
