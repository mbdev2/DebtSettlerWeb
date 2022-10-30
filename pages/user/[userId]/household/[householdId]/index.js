import Head from "next/head";
import styles from "../../../../../styles/HouseholdBalance.module.scss";
import sStyles from "../../../../../styles/Spinner.module.scss";
import ContainerLayout from "../../../../../components/ContainerLayout";
import { useRouter } from "next/router";
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
import HouseholdBalanceItem from "../../../../../components/HouseholdBalanceItem";
import {
  useHousholdUsers,
  useUser,
  useShoppingList,
} from "../../../../../utils/helper";
import { BeatLoader, PropagateLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";

const Household = () => {
  const router = useRouter();
  // console.log(router.query);
  const idGospodinjstva = router.query.householdId;
  const idUporabnika = router.query.userId;
  const { user, isUserLoading } = useUser(idUporabnika);
  // const { user, isUserLoading } = useUser();
  const { uporabniki, isHousholdUsersLoading, mutateUporabniki } =
    useHousholdUsers(idUporabnika, idGospodinjstva);

  const roundMoneyState = (moneyState) =>
    (Math.round(moneyState * 100) / 100).toFixed(2);

  if (isUserLoading || isHousholdUsersLoading) {
    return (
      <div className={sStyles.container}>
        <BeatLoader color="#65c8bc" />
      </div>
    );
  }

  return (
    <div className={styles.contentContainer}>
      <h1 className={styles.heading}>Balance</h1>
      <ul className={styles.balanceList}>
        <AnimatePresence initial={false}>
          {/* Da logiranega userja na prvo mesto */}
          {[
            uporabniki.find(
              ({ idUporabnika }) => idUporabnika === user.idUporabnika
            ),
            ...uporabniki.filter(
              (uporabnik) =>
                uporabnik.idUporabnika !== user.idUporabnika &&
                uporabnik.deleteStatus === false
            ),
          ].map(
            ({
              imeUporabnika,
              barvaUporabnika,
              idUporabnika,
              stanjeDenarja,
              upVGosID,
            }) => {
              return (
                <HouseholdBalanceItem
                  key={idUporabnika}
                  name={imeUporabnika}
                  moneyState={roundMoneyState(stanjeDenarja)}
                  color={`#${barvaUporabnika}`}
                  id={idUporabnika}
                  upVGosID={upVGosID}
                  mutate={mutateUporabniki}
                />
              );
            }
          )}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default Household;

Household.getLayout = function getLayout(page) {
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
