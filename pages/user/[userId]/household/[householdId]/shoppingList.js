import Head from "next/head";
import styles from "../../../../../styles/HouseholdShoppingList.module.scss";
import Router, { useRouter } from "next/router";
import ContainerLayout from "../../../../../components/ContainerLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import sStyles from "../../../../../styles/Spinner.module.scss";

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { object, string, ref, number, date, InferType, array } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import axios from "axios";
import qs from "qs";
import { requireAuthentication } from "../../../../../hoc/requireAuthentication";
import HouseholdLayout from "../../../../../components/HouseholdLayout";
import ShoppingItem from "../../../../../components/ShoppingItem";
import AddItemModal from "../../../../../components/AddItemModal";
import {
  useShoppingList,
  useUser,
  useUserHousholdInfo,
} from "../../../../../utils/helper";
import { BeatLoader, PuffLoader } from "react-spinners";
import { AnimatePresence, motion } from "framer-motion";

const initalData = ["Toast bread", "Chicken breast"];
// const seznam = [
//   {
//     naslov: "Toast",
//     opis: "beli",
//     kolicina: 1,
//     upVGosID: "628a834a114b6b460b53dde1",
//     aquired: false,
//     _id: "62f420510a2f8d1a69568470",
//   },
//   {
//     naslov: "omaka za cips",
//     opis: "salsa",
//     kolicina: 1,
//     upVGosID: "628a834a114b6b460b53dde1",
//     aquired: false,
//     _id: "62f420780a2f8d1a69568479",
//   },
//   {
//     naslov: "Coca-Cola",
//     opis: "Zero prosim",
//     kolicina: 3,
//     upVGosID: "628a834a114b6b460b53dde1",
//     aquired: false,
//     _id: "62f8dfc00a2f8d1a69568585",
//   },
//   {
//     naslov: "Pivo",
//     opis: "Samo ne uniona",
//     kolicina: 6,
//     upVGosID: "628a834a114b6b460b53dde1",
//     aquired: false,
//     _id: "62fa333cc8e11f49c2af97d3",
//   },
//   {
//     naslov: "makaroni",
//     opis: "/",
//     kolicina: 1,
//     upVGosID: "628a834a114b6b460b53dde1",
//     aquired: false,
//     _id: "6307e461c8e11f49c2af9def",
//   },
// ];
const ShoppingList = ({ children }) => {
  const router = useRouter();
  const idUporabnika = router.query.userId;
  const idGospodinjstva = router.query.householdId;
  const { user, isUserLoading } = useUser(idUporabnika);
  const { seznam, isSeznamLoading, mutateSeznam } =
    useShoppingList(idGospodinjstva);
  const {
    userHouseholdInfo,
    isUserHousheholdInfoLoading,
    mutateUserHouseholdInfo,
  } = useUserHousholdInfo(idUporabnika, idGospodinjstva);

  // const [shoppingItems, setShoppingItems] = useState(seznam);
  const [modalState, setModalState] = useState(false);

  const toggleItem = async (naslov, opis, kolicina, aquired, id) => {
    mutateSeznam((seznam) =>
      seznam.map((item) => {
        if (item._id === id) {
          return { ...item, aquired: !item.aquired };
        } else {
          return item;
        }
      })
    );
    const { GStoken } = userHouseholdInfo;
    console.log(GStoken);
    const newData = qs.stringify({
      naslov,
      opis,
      kolicina,
      aquired: !aquired,
      idArtikla: id,
    });
    console.log(newData);
    try {
      const res = await axios.post("/api/seznam/posodobi", newData, {
        headers: {
          Authorization: "Bearer " + GStoken,
        },
      });
      console.log(res.data);
      mutateSeznam();
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const removeItem = async (id) => {
    mutateSeznam((seznam) => seznam.filter((item) => item._id !== id));
    const { GStoken } = userHouseholdInfo;
    console.log(GStoken);
    const newData = qs.stringify({
      idArtikla: id,
    });
    console.log(newData);
    try {
      const res = await axios.delete("/api/seznam", {
        headers: {
          Authorization: "Bearer " + GStoken,
        },
        data: { idArtikla: id },
      });
      console.log(res.data);
      mutateSeznam();
    } catch (error) {
      console.log(error.response.data);
    }
  };
  const removeItems = async () => {
    mutateSeznam((seznam) => seznam.filter((item) => item.aquired !== true));
    const { GStoken } = userHouseholdInfo;
    console.log(GStoken);
    const toBeRemoved = seznam.filter((item) => item.aquired === true);
    const promises = toBeRemoved.map(async (data) => {
      try {
        const res = await axios.delete("/api/seznam", {
          headers: {
            Authorization: "Bearer " + GStoken,
          },
          data: { idArtikla: data._id },
        });
        console.log("to je to", res.data);
      } catch (error) {
        console.log(error.response.data);
      }
    });
    await Promise.all(promises);
    mutateSeznam();
  };

  const selectAll = async () => {
    const { GStoken } = userHouseholdInfo;
    console.log(GStoken);
    const toggle =
      seznam.filter((item) => item.aquired === true).length === seznam.length;
    console.log(toggle);

    mutateSeznam((seznam) =>
      seznam.map((item) => {
        return { ...item, aquired: !toggle };
      })
    );

    if (!toggle) {
      const promises = seznam.map(
        async ({ naslov, opis, kolicina, aquired, _id }) => {
          const newData = qs.stringify({
            naslov,
            opis,
            kolicina,
            aquired: true,
            idArtikla: _id,
          });
          console.log(newData);
          try {
            const res = await axios.post("/api/seznam/posodobi", newData, {
              headers: {
                Authorization: "Bearer " + GStoken,
              },
            });
            console.log(res.data);
          } catch (error) {
            console.log(error.response.data);
          }
        }
      );
      await Promise.all(promises);
      mutateSeznam();
    } else {
      const promises = seznam.map(
        async ({ naslov, opis, kolicina, aquired, _id }) => {
          const newData = qs.stringify({
            naslov,
            opis,
            kolicina,
            aquired: false,
            idArtikla: _id,
          });
          console.log(newData);

          try {
            const res = await axios.post("/api/seznam/posodobi", newData, {
              headers: {
                Authorization: "Bearer " + GStoken,
              },
            });
            console.log(res.data);
          } catch (error) {
            console.log(error.response.data);
          }
        }
      );
      await Promise.all(promises);
      mutateSeznam();
    }
  };

  if (isUserLoading || isSeznamLoading) {
    return (
      <div className={sStyles.container}>
        <BeatLoader color="#65c8bc" />
      </div>
    );
  }

  return (
    <div className={styles.contentContainer}>
      <h1 className={styles.heading}>Shopping list</h1>
      <div className={styles.addItem} onClick={() => setModalState(true)}>
        <input type="text" placeholder="Add an item" readOnly />
        <button type="submit" className={styles.addIcon}>
          <FontAwesomeIcon icon={faPlus} size="lg" />
        </button>
      </div>
      <AnimatePresence>
        {modalState && (
          <AddItemModal
            modalState={modalState}
            closeModal={() => setModalState(false)}
          />
        )}
      </AnimatePresence>
      <ul className={styles.shoppingList}>
        <AnimatePresence initial={false}>
          {seznam.map(({ naslov, opis, kolicina, aquired, _id }) => {
            return (
              <ShoppingItem
                key={_id}
                name={naslov}
                description={opis}
                selected={aquired}
                quantity={kolicina}
                id={_id}
                onClick={() => toggleItem(naslov, opis, kolicina, aquired, _id)}
                removeItem={() => removeItem(_id)}
              />
            );
          })}
        </AnimatePresence>
      </ul>
      <div className={styles.buttonSpace}>
        <button className={styles.btnSolid} onClick={removeItems}>
          Remove
        </button>
        <button className={styles.btnLight} onClick={selectAll}>
          Select all
        </button>
      </div>
    </div>
  );
};

export default ShoppingList;

ShoppingList.getLayout = function getLayout(page) {
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
