/**
 * @version 1.0.0
 * @version 1.1.0 Remove creator footer entry
 */

/**
 * @module
 * Bottom part of page.
 * Static module crediting contributors.
 */
function Footer() {
  return (
    <>
      <footer role="footer">
        <div className="footer-notes">
          {/* API credit # mandatory */}
          <div className="footer-note">
            <a href="http://www.skyscanner.net/">
              <img src="src/assets/inline--black.svg"></img>
            </a>
          </div>
          {/* Background image credit # mandatory */}
          <div className="footer-note">
            <a href="https://www.pexels.com/@apasaric/">
              Image by Aleksandar Pasaric
            </a>
            <span>on pexels.com</span>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
