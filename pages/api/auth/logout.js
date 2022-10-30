import Cookies from "cookies";

export default (req, res) => {
  const cookies = new Cookies(req, res);

  cookies.set("DStoken", "", {});

  res.end();
};
