import "../styles/globals.scss";

import "../styles/HomePage.scss";
import "../styles/ThreadPage.scss";
import "../styles/LoginPage.scss";
import "../styles/ThreadPostPage.scss";

import "../styles/Feed.scss";
import "../styles/Button.scss";
import "../styles/Comment.scss";
import "../styles/Spinner.scss";

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
