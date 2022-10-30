import { requireAuthentication } from "../../../hoc/requireAuthentication";
import ContainerLayout from "../../../components/ContainerLayout";
import HouseholdListLayout from "../../../components/HouseholdListLayout";
import styles from "../../../styles/Households.module.scss";
import sStyles from "../../../styles/Spinner.module.scss";
import HouseholdItem from "../../../components/HouseholdItem";
import Modal from "../../../components/Modal";
import { useState } from "react";
import axios from "axios";
import Cookies from "cookies";
// import BigLogoLayout from "../../../components/BigLogoLayout";
import {
  useUser,
  useGStokens,
  useHouseholdUsers,
  useHouseholds,
} from "../../../utils/helper";
import { BeatLoader, PuffLoader } from "react-spinners";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { AnimatePresence } from "framer-motion";
import { Head } from "next/head";

const colors = [
  "#F84F4F",
  "#FFE347",
  "#5BC0EB",
  "#6457A6",
  "#BCE784",
  "#FF715B",
  "#5BC0EB",
  "#FFC914",
  "#FB62F6",
  "#CCFF66",
];

const Households = () => {
  const router = useRouter();
  const idUporabnika = router.query.userId;

  const { user, isUserLoading } = useUser(idUporabnika);
  const { households, householdsMutate, isHouseholdsLoading } =
    useHouseholds(idUporabnika);

  const [selected, setSelected] = useState(0);
  const [modalState, setModalState] = useState(false);

  const handleEnterHouseholdClick = () => {
    if (households.length === 0) {
      return;
    }
    const { idGospodinjstva } = households[selected];
    // const { GStoken } = households[selected];
    router.push({
      pathname: `${router.asPath}/household/${idGospodinjstva}`,
      query: { householdColor: colors[selected] },
    });
  };
  const testRequest2 = async () => {
    console.log(selected);
    console.log("starting");
    try {
      const res = await axios.get("/api/proxy/users/podatkiUporabnika");
      console.log(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };
  const testRequest = async () => {
    //console.log(householdTokens);
    console.log("starting");
    try {
      const res = await axios.get(
        "/api/gospodinjstvo/tokeniUporabnikGospodinjstev"
      );
      console.log(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  if (isUserLoading || isHouseholdsLoading)
    return (
      <div className={sStyles.container}>
        <BeatLoader color="#65c8bc" />
      </div>
    );

  return (
    <>
      <h1 className={styles.heading}>
        Hello {user.imeUporabnika}, <span>Select your household</span>
        {/* {JSON.stringify(userInfo)} */}
      </h1>
      <ul className={styles.householdList}>
        <AnimatePresence initial={false}>
          {households.map(
            ({ imeGospodinjstva, stanjeDenarja, idGospodinjstva }, index) => {
              return (
                <HouseholdItem
                  key={idGospodinjstva}
                  name={imeGospodinjstva}
                  moneyState={stanjeDenarja}
                  color={colors[index]}
                  selected={selected === index ? true : false}
                  onClick={() => setSelected(index)}
                />
              );
            }
          )}
        </AnimatePresence>
      </ul>

      <div className={styles.buttonSpace}>
        <button className={styles.btnSolid} onClick={handleEnterHouseholdClick}>
          {/* <button className={styles.btnSolid} onClick={testRequest}> */}
          Enter Household
        </button>
        <button onClick={() => setModalState(true)} className={styles.btnLight}>
          Create new
        </button>

        <AnimatePresence>
          {modalState && (
            <Modal
              modalState={modalState}
              closeModal={() => setModalState(false)}
              mutate={householdsMutate}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Households;

Households.getLayout = function getLayout(page) {
  return (
    <ContainerLayout>
      <HouseholdListLayout page="householdList">{page}</HouseholdListLayout>
    </ContainerLayout>
  );
};

export const getServerSideProps = requireAuthentication(async (context) => {
  return {
    props: {},
  };
});

// localhost:3000/user/121323243/household/e232324
// localhost:3000/user

// user/[userId]/household/[householdId]/ShoppingList
