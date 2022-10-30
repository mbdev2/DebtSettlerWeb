import { proxy } from "../../server/proxy";

import Cookies from "cookies";

export default (req, res) => {
  return new Promise((resolve, reject) => {
    // removes the api prefix from url
    // req.url = req.url.replace(/^\/api/, "");
    console.log(req.url);

    const cookies = new Cookies(req, res);
    const DStoken = cookies.get("DStoken");

    // don't forwards the cookies to the target server
    req.headers.cookie = "";

    if (DStoken) {
      req.headers["Authorization"] = "Bearer " + DStoken;
    }

    /**
     * if an error occurs in the proxy, we will reject the promise.
     * it is so important. if you don't reject the promise,
     * you're facing the stalled requests issue.
     */
    proxy.once("error", reject);

    proxy.web(req, res);
  });
};

export const config = {
  api: {
    bodyParser: false,
  },
};
