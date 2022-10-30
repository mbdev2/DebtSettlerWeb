import useSWR from "swr";

const convertDate = (d) => {
  const date = new Date(d);
  const newDate = date.toDateString().split(" ");
  return newDate[1] + " " + newDate[2];
};
const monthName = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const fetchUser = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

export const useUser = (idUporabnika) => {
  const { data, error, mutate } = useSWR(
    ["/api/users/podatkiUporabnika", idUporabnika],
    fetchUser
  );
  return {
    user: data,
    isUserLoading: !error && !data,
    isError: error,
    mutateUser: mutate,
  };
};

// const fetchHouseholds = async (url, userDataId) => {
//   const GStokens = await fetchHouseholdsTokens(
//     "/api/gospodinjstvo/tokeniUporabnikGospodinjstev"
//   );
//   // console.log("fh", GStokens);
//   const gospodinjstva = await Promise.all(
//     GStokens.map(
//       async ({ imeGospodinjstva, idGospodinjstva, GStoken, isAdmin }) => {
//         const uporabniki = await fetchHouseholdUsersWithToken(
//           "/api/gospodinjstvo/claniGospodinjstva",
//           GStoken
//         );
//         // console.log("fh uporabniki", uporabniki);
//         const [uporabnik] = uporabniki.filter(
//           (member) => member.idUporabnika === userDataId
//         );
//         return {
//           imeGospodinjstva,
//           idGospodinjstva,
//           stanjeDenarja: uporabnik.stanjeDenarja,
//           GStoken,
//           isAdmin,
//         };
//       }
//     )
//   );
//   // console.log("gospodinjstva", gospodinjstva);
//   return gospodinjstva;
// };

// export const useHouseholds = (idUporabnika) => {
//   const { data, error, mutate } = useSWR(
//     ["households", idUporabnika],
//     fetchHouseholds
//   );
//   return {
//     households: data,
//     householdsMutate: mutate,
//     isHouseholdsLoading: !error && !data,
//     isError: error,
//   };
// };

const fetchHouseholds = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  const { tokens } = data;
  // console.log(tokens);
  return tokens;
};
export const useHouseholds = (idUporabnika) => {
  const { data, error, mutate } = useSWR(
    ["/api/gospodinjstvo/tokeniUporabnikGospodinjstev", idUporabnika],
    fetchHouseholds
  );
  return {
    households: data,
    householdsMutate: mutate,
    isHouseholdsLoading: !error && !data,
    isError: error,
  };
};

const fetchUserHouseholdInfo = async (url, idUporabnika, idGospodinjstva) => {
  const tokens = await fetchHouseholds(
    "/api/gospodinjstvo/tokeniUporabnikGospodinjstev"
  );
  const userInfo = tokens.find(
    (gospodinjstvo) => gospodinjstvo.idGospodinjstva === idGospodinjstva
  );
  return userInfo;
};
export const useUserHousholdInfo = (idUporabnika, idGospodinjstva) => {
  const { data, error, mutate } = useSWR(
    ["userHouseholdInfo", idUporabnika, idGospodinjstva],
    fetchUserHouseholdInfo
  );
  return {
    userHouseholdInfo: data,
    isUserHousheholdInfoLoading: !error && !data,
    mutateUserHouseholdInfo: mutate,
    isError: error,
  };
};

const fetchHouseholdUsers = async (url, idGospodinjstva) => {
  const tokens = await fetchHouseholds(
    "/api/gospodinjstvo/tokeniUporabnikGospodinjstev"
  );
  const GStoken = tokens.find(
    (gospodinjstvo) => gospodinjstvo.idGospodinjstva === idGospodinjstva
  ).GStoken;

  const res = await fetch(url, {
    headers: {
      Authorization: "Bearer " + GStoken,
    },
  });
  const data = await res.json();
  // console.log(data);
  const { uporabniki } = data;
  // console.log(
  //   "Mutationnn",
  //   uporabniki.filter((uporabnik) => uporabnik.deleteStatus === false)
  // );
  // return uporabniki.filter((uporabnik) => uporabnik.deleteStatus === false);
  return uporabniki;
};
const fetchHouseholdUsersWithToken = async (url, GStoken) => {
  const res = await fetch(url, {
    headers: {
      Authorization: "Bearer " + GStoken,
    },
  });
  const data = await res.json();
  // console.log(data);
  const { uporabniki } = data;
  return uporabniki;
};

export const useHousholdUsers = (idUporabnika, idGospodinjstva) => {
  const { data, error, mutate } = useSWR(
    ["/api/gospodinjstvo/claniGospodinjstva", idGospodinjstva],
    fetchHouseholdUsers
  );
  return {
    uporabniki: data,
    isHousholdUsersLoading: !error && !data,
    mutateUporabniki: mutate,
    isError: error,
  };
};
// export const useHousholdUsers = (idUporabnika, idGospodinjstva) => {
//   const { tokens } = useHouseholdsTokens(idUporabnika);
//   const { data, error } = useSWR(() => {
//     if (tokens) {
//       const GStoken = tokens.find(
//         (gospodinjstvo) => gospodinjstvo.idGospodinjstva === idGospodinjstva
//       ).GStoken;
//       return ["/api/gospodinjstvo/claniGospodinjstva", GStoken];
//     }
//     return null;
//   }, fetchHouseholdUsers);
//   return {
//     uporabniki: data,
//     isHousholdUsersLoading: !error && !data,
//     isError: error,
//   };
// };

///////////NAKUPOVALLNI SEZNAM////////////////

const fetchHistory = async (url, idGospodinjstva) => {
  const tokens = await fetchHouseholds(
    "/api/gospodinjstvo/tokeniUporabnikGospodinjstev"
  );
  const GStoken = tokens.find(
    (gospodinjstvo) => gospodinjstvo.idGospodinjstva === idGospodinjstva
  ).GStoken;

  const res = await fetch(url, {
    headers: {
      Authorization: "Bearer " + GStoken,
    },
  });
  const data = await res.json();

  // console.log("first", data);
  let groups = data.reduce((acc, o) => {
    const monthYear = `${
      monthName[new Date(o.datumNakupa).getMonth()]
    } ${new Date(o.datumNakupa).getFullYear()}`;
    acc[monthYear] = acc[monthYear] || [];
    acc[monthYear].push(o);
    return acc;
  }, {});

  const razvrsceniNakupi = Object.keys(groups)
    .sort(function (a, b) {
      const firstMonthYear = a.split(" "),
        secondMonthYear = b.split(" ");
      return (
        firstMonthYear[1] - secondMonthYear[1] ||
        monthName.indexOf(firstMonthYear[0]) -
          monthName.indexOf(secondMonthYear[0])
      );
    })
    .map(function (key) {
      const o = {};
      o["monthYear"] = key;
      o["info"] = groups[key];
      return o;
    })
    .reverse();
  // console.log("second", razvrsceniNakupi);
  return razvrsceniNakupi;
};

export const useHistory = (idUporabnika, idGospodinjstva) => {
  const { data, error, mutate } = useSWR(
    ["/api/nakupi/gospodinjstvo", idGospodinjstva],
    fetchHistory
  );
  return {
    nakupi: data,
    isNakupiLoading: !error && !data,
    mutateHistory: mutate,
    isError: error,
  };
};

const fetchHouseholdName = async (url, idGospodinjstva) => {
  const tokens = await fetchHouseholds(
    "/api/gospodinjstvo/tokeniUporabnikGospodinjstev"
  );
  const { imeGospodinjstva } = tokens.find(
    (gospodinjstvo) => gospodinjstvo.idGospodinjstva === idGospodinjstva
  );
  return imeGospodinjstva;
};
export const useHouseholdName = (idGospodinjstva) => {
  const { data, error } = useSWR(
    ["householdName", idGospodinjstva],
    fetchHouseholdName
  );
  return {
    imeGospodinjstva: data,
    isimeGospodinjstvaLoading: !error && !data,
    isError: error,
  };
};

const fetchShoppingList = async (url, idGospodinjstva) => {
  // console.log("Hoj");
  const tokens = await fetchHouseholds(
    "/api/gospodinjstvo/tokeniUporabnikGospodinjstev"
  );
  const GStoken = tokens.find(
    (gospodinjstvo) => gospodinjstvo.idGospodinjstva === idGospodinjstva
  ).GStoken;

  const res = await fetch(url, {
    headers: {
      Authorization: "Bearer " + GStoken,
    },
  });
  const data = await res.json();
  return data.reverse();
};

export const useShoppingList = (idGospodinjstva) => {
  const { data, error, mutate } = useSWR(
    ["/api/seznam/gospodinjstvo", idGospodinjstva],
    fetchShoppingList
  );
  return {
    seznam: data,
    isSeznamLoading: !error && !data,
    mutateSeznam: mutate,
    isError: error,
  };
};
// export const useHouseholdUsers = (idUporabnika, idGospodinjstva) => {
//   const { tokens } = useHouseholdTokens(idUporabnika);
//   const { data, error } = useSWR(
//     ["/api/gospodinjstvo/claniGospodinjstva", GStoken],
//     fetchHouseholdUsers
//   );
//   return {
//     uporabniki: data,
//     isUporabniki: !error && !data,
//     isError: error,
//   };
// };

// const useHousholdUsers = (idGospodinjstva) => {
//   const { tokens } = useGStokens();
//   const { data, error } = useSWR(() => {
//     if (tokens) {
//       const GStoken = tokens.find(
//         (gospodinjstvo) => gospodinjstvo.idGospodinjstva === idGospodinjstva
//       ).GStoken;
//       return ["/api/proxy/gospodinjstvo/claniGospodinjstva", GStoken];
//     }
//     return null;
//   }, fetchHouseholdUsers);
//   return {
//     uporabniki: data,
//     isHousholdUsersLoading: !error && !data,
//     isError: error,
//   };
// };

// const useUsersHouseholds = () => {
//   const { user: userData } = useUser();
//   const { data, error } = useSWR(() => {
//     if (userData)
//       return [
//         "/api/proxy/gospodinjstvo/tokeniUporabnikGospodinjstev",
//         userData.idUporabnika,
//       ];
//     return null;
//   }, fetchHouseholds);
//   return {
//     households: data,
//     isHouseholdsLoading: !error && !data,
//     isError: error,
//   };
// };

// const fetchHouseholdUsers = async (url, GStoken) => {
//   const res = await fetch(url, {
//     headers: {
//       Authorization: "Bearer " + GStoken,
//     },
//   });
//   const { uporabniki } = await res.json();
//   console.log(uporabniki);
//   return uporabniki;
// };

// const useHousholdUsers = (idGospodinjstva) => {
//   const { tokens } = useGStokens();
//   const { data, error } = useSWR(() => {
//     if (tokens) {
//       const GStoken = tokens.find(
//         (gospodinjstvo) => gospodinjstvo.idGospodinjstva === idGospodinjstva
//       ).GStoken;
//       return ["/api/proxy/gospodinjstvo/claniGospodinjstva", GStoken];
//     }
//     return null;
//   }, fetchHouseholdUsers);
//   return {
//     uporabniki: data,
//     isHousholdUsersLoading: !error && !data,
//     isError: error,
//   };
// };

// const fetchUser = async (url, id) => {
//   const res = fetch(url);
//   const data = await res.json();
//   return data;
// };
// export const useUser = (idUporabnika) => {
//   const { data, error } = useSWR(
//     ["/api/users/podatkiUporabnika", idUporabnika],
//     fetchUser
//   );
//   return {
//     user: data,
//     isUserLoading: !error && !data,
//     isUserError: error,
//   };
// };

// "/user/12349348759/household/32434353535353/"
// "12349348759/32434353535353/";
