import "../styles/globals.scss";
import { AuthContextProvider } from "../store/AuthContext";
import { AnimatePresence } from "framer-motion";

function MyApp({ Component, pageProps, router }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(
  <AnimatePresence mode="wait">
    <Component {...pageProps} />
  </AnimatePresence>);
}

export default MyApp;
