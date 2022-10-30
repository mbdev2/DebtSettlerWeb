import cookie from "cookie";
import { redirect } from "next/dist/server/api-utils";
import { jwt_decode } from "jwt-decode";

export function requireAuthentication(getServerSidePropsFunction) {
  return async (context) => {
    const { req } = context;
    //const { DStoken } = cookie.parse(req.headers.cookie);
    //const { DStoken } = cookie.parse(req.headers.cookie);
    //console.log(req.headers.cookie);
    const { DStoken } = req.headers.cookie
      ? cookie.parse(req.headers.cookie)
      : false;

    if (DStoken) {
      const base64Url = DStoken.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const buff = new Buffer.from(base64, "base64");
      const payloadinit = buff.toString("utf8");
      const payload = JSON.parse(payloadinit);
      const { idUporabnika } = payload;
      // const { idUporabnika } = jwt_decode(DStoken);

      if (
        req.url.includes("/login") ||
        req.url.includes("/register") ||
        req.url === "/"
      ) {
        return {
          redirect: {
            permanent: false,
            destination: `user/${idUporabnika}`,
          },
        };
      }
      // const res = await fetch(
      //   "http://89.142.196.64:3000/api/users/podatkiUporabnika",
      //   {
      //     headers: {
      //       Authorization: "Bearer " + DStoken,
      //     },
      //   }
      // );
      // const userData = await res.json();
      // return await getServerSidePropsFunction(context, userData, DStoken);
    } else {
      if (!req.url.includes("/register") && !req.url.includes("/login")) {
        return {
          redirect: {
            permanent: false,
            destination: "/login",
          },
        };
      }
    }

    return await getServerSidePropsFunction(context);
  };
}
