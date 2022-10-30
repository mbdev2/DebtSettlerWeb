import Head from "next/head";
import styles from "../../../../../styles/History.module.scss";
import sStyles from "../../../../../styles/Spinner.module.scss";
import { useRouter } from "next/router";
import ContainerLayout from "../../../../../components/ContainerLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Dialog from "@radix-ui/react-dialog";
import {
  faEye,
  faEyeSlash,
  faUserAstronaut,
  faCircle,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { object, string, ref, number, date, InferType } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import axios from "axios";
import qs from "qs";
import { requireAuthentication } from "../../../../../hoc/requireAuthentication";
import HouseholdLayout from "../../../../../components/HouseholdLayout";
import HistoryListItem from "../../../../../components/HistoryListItem";
import {
  useHistory,
  useUser,
  useHousholdUsers,
} from "../../../../../utils/helper";
import { BeatLoader, PuffLoader } from "react-spinners";
import { AnimatePresence, motion } from "framer-motion";
// const nakupi = [
//   {
//     kategorijaNakupa: 0,
//     imeTrgovine: "",
//     opisNakupa: "Poravnava",
//     znesekNakupa: 45.67,
//     upVGosID: "628a831e114b6b460b53ddd3",
//     tabelaUpVGos: ["628a8342114b6b460b53ddd9", "628a8347114b6b460b53dddd"],
//     _id: "628a8488114b6b460b53ddf0",
//     datumNakupa: "2022-05-22T18:44:24.313Z",
//   },
//   {
//     kategorijaNakupa: 1,
//     imeTrgovine: "Hofer",
//     opisNakupa: "Goveji golaz",
//     znesekNakupa: 1.99,
//     upVGosID: "628a831e114b6b460b53ddd3",
//     tabelaUpVGos: ["628a8342114b6b460b53ddd9", "628a8347114b6b460b53dddd"],
//     _id: "628a8488114b6b460b53ddf0",
//     datumNakupa: "2022-05-15T18:44:24.313Z",
//   },
//   {
//     kategorijaNakupa: 2,
//     imeTrgovine: "Subway",
//     opisNakupa: "Teriyaki chicken, double chocolate-chip",
//     znesekNakupa: 23.45,
//     upVGosID: "628a834a114b6b460b53dde1",
//     tabelaUpVGos: [
//       "628a834a114b6b460b53dde1",
//       "628a831e114b6b460b53ddd3",
//       "628a8342114b6b460b53ddd9",
//       "628a8347114b6b460b53dddd",
//     ],
//     _id: "62f8df0d0a2f8d1a6956857e",
//     datumNakupa: "2022-08-14T11:39:57.787Z",
//   },
//   {
//     kategorijaNakupa: 3,
//     imeTrgovine: "Neboticnik",
//     opisNakupa: "Pivo s frendi",
//     znesekNakupa: 12.5,
//     upVGosID: "628a831e114b6b460b53ddd3",
//     tabelaUpVGos: ["628a8342114b6b460b53ddd9"],
//     _id: "628a8576114b6b460b53ddf7",
//     datumNakupa: "2022-04-14T18:48:22.121Z",
//   },
//   {
//     kategorijaNakupa: 4,
//     imeTrgovine: "Go opti",
//     opisNakupa: "Prevoz do letalisca",
//     znesekNakupa: 50.0,
//     upVGosID: "628a834a114b6b460b53dde1",
//     tabelaUpVGos: [
//       "628a834a114b6b460b53dde1",
//       "628a831e114b6b460b53ddd3",
//       "628a8342114b6b460b53ddd9",
//       "628a8347114b6b460b53dddd",
//     ],
//     _id: "62fa32dfc8e11f49c2af97cb",
//     datumNakupa: "2022-04-02T11:49:51.682Z",
//   },
//   {
//     kategorijaNakupa: 5,
//     imeTrgovine: "Najemnina",
//     opisNakupa: "Najemnina za marec",
//     znesekNakupa: 540.0,
//     upVGosID: "628a834a114b6b460b53dde1",
//     tabelaUpVGos: [
//       "628a834a114b6b460b53dde1",
//       "628a831e114b6b460b53ddd3",
//       "628a8342114b6b460b53ddd9",
//       "628a8347114b6b460b53dddd",
//     ],
//     _id: "62fa32dfc8e11f49c2af97cb",
//     datumNakupa: "2021-03-25T11:49:51.682Z",
//   },
//   {
//     kategorijaNakupa: 6,
//     imeTrgovine: "Bilijardna",
//     opisNakupa: "Bilijard z boisi",
//     znesekNakupa: 22.4,
//     upVGosID: "628a834a114b6b460b53dde1",
//     tabelaUpVGos: [
//       "628a834a114b6b460b53dde1",
//       "628a831e114b6b460b53ddd3",
//       "628a8342114b6b460b53ddd9",
//       "628a8347114b6b460b53dddd",
//     ],
//     _id: "62fa32dfc8e11f49c2af97cb",
//     datumNakupa: "2021-10-15T11:49:51.682Z",
//   },
//   {
//     kategorijaNakupa: 7,
//     imeTrgovine: "Balvania",
//     opisNakupa: "Plezanje teambuilding",
//     znesekNakupa: 41.0,
//     upVGosID: "628a834a114b6b460b53dde1",
//     tabelaUpVGos: [
//       "628a834a114b6b460b53dde1",
//       "628a831e114b6b460b53ddd3",
//       "628a8342114b6b460b53ddd9",
//       "628a8347114b6b460b53dddd",
//     ],
//     _id: "62fa32dfc8e11f49c2af97cb",
//     datumNakupa: "2021-08-22T11:49:51.682Z",
//   },
//   {
//     kategorijaNakupa: 8,
//     imeTrgovine: "Internet",
//     opisNakupa: "T2, Bob, A1",
//     znesekNakupa: 32.9,
//     upVGosID: "628a834a114b6b460b53dde1",
//     tabelaUpVGos: [
//       "628a834a114b6b460b53dde1",
//       "628a831e114b6b460b53ddd3",
//       "628a8342114b6b460b53ddd9",
//       "628a8347114b6b460b53dddd",
//     ],
//     _id: "62fa32dfc8e11f49c2af97cb",
//     datumNakupa: "2021-08-01T11:49:51.682Z",
//   },
// ];
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

const History = () => {
  const router = useRouter();
  const idUporabnika = router.query.userId;
  const idGospodinjstva = router.query.householdId;
  const { user, isUserLoading } = useUser(idUporabnika);
  const { nakupi, isNakupiLoading } = useHistory(idUporabnika, idGospodinjstva);
  const { uporabniki, isHousholdUsersLoading } = useHousholdUsers(
    idUporabnika,
    idGospodinjstva
  );

  const idToNames = (tabelaUpVGos) => {
    const otherMembers = tabelaUpVGos.map((id) => {
      return uporabniki.find((uporabnik) => uporabnik.upVGosID === id)
        ?.imeUporabnika;
    });
    // console.log("members", otherMembers);
    return otherMembers;
  };

  const idToName = (id) => {
    return uporabniki.find((uporabnik) => uporabnik.upVGosID === id)
      .imeUporabnika;
  };

  if (isNakupiLoading || isHousholdUsersLoading) {
    return (
      <div className={sStyles.container}>
        <BeatLoader color="#65c8bc" />
      </div>
    );
  }
  return (
    <div className={styles.contentContainer}>
      <h1 className={styles.heading}>History</h1>
      <div className={styles.historyList}>
        <AnimatePresence initial={false}>
          {nakupi.map((date) => {
            return (
              <motion.ul
                key={date.monthYear}
                className={styles.monthYearContainer}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{
                  type: "spring",
                  bounce: 0.3,
                  duration: 1,
                  opacity: { duration: 0.2 },
                }}
              >
                <h2 className={styles.monthYearHeading}>
                  {date.monthYear.includes(new Date().getFullYear())
                    ? date.monthYear.split(" ")[0]
                    : date.monthYear}
                </h2>
                <div className={styles.monthYearContainer}>
                <AnimatePresence initial={false}>
                  {date.info
                    .slice()
                    .reverse()
                    .map(
                      (
                        {
                          kategorijaNakupa,
                          imeTrgovine,
                          opisNakupa,
                          znesekNakupa,
                          datumNakupa,
                          _id,
                          tabelaUpVGos,
                          upVGosID,
                        },
                        index
                      ) => {
                        return (
                          <HistoryListItem
                            key={_id}
                            userName={idToName(upVGosID)}
                            category={kategorijaNakupa}
                            price={znesekNakupa}
                            description={opisNakupa}
                            shopName={imeTrgovine}
                            date={convertDate(datumNakupa)}
                            otherMembers={
                              tabelaUpVGos ? idToNames(tabelaUpVGos) : ["Nigga"]
                            }
                          />
                        );
                      }
                    )}
                    </AnimatePresence>
                </div>
              </motion.ul>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default History;

History.getLayout = function getLayout(page) {
  return (
    <ContainerLayout>
      <HouseholdLayout page="household">{page}</HouseholdLayout>
    </ContainerLayout>
  );
};

export const getServerSideProps = requireAuthentication(async (context) => {
  return {
    props: {},
  };
});
