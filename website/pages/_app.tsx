import "../styles/globals.css";

import "../styles/Home.scss";
import "../styles/Thread.scss";
import "../styles/Login.scss";

import "../styles/Feed.scss";
import "../styles/Button.scss";
import Navbar from "../components/Navbar";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
