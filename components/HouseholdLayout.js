import Image from "next/image";
import leftLogo from "../assets/images/BigLeftLogo.png";
import styles from "../styles/HouseholdLayout.module.scss";
import iconStyles from "../styles/HouseholdLayout.module.scss";
import axios from "axios";
import { useRouter } from "next/router";
import Navbar from "./Navbar";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVihara,
  faCircle,
  faGear,
  faBasketShopping,
  faListCheck,
  faClockRotateLeft,
  faSquare,
} from "@fortawesome/free-solid-svg-icons";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import ItemsJustBoughtModal from "./ItemsJustBoughtModal";
import SettingsMenu from "./SettingsMenu";
import { useHouseholdName, useHouseholds } from "../utils/helper";
import { AnimatePresence } from "framer-motion";

const data = {
  householdName: "Plum hood",
};
const HouseholdLayout = ({ page, children }) => {
  const router = useRouter();
  const idUporabnika = router.query.userId;
  const idGospodinjstva = router.query.householdId;
  const householdColor = router.query.householdColor;
  // console.log(householdColor);
  const { imeGospodinjstva } = useHouseholdName(idGospodinjstva);

  // console.log("url", router.asPath);
  const [itemsJustBoughtModalOpen, setItemsJustBoughtModalOpen] =
    useState(false);
  return (
    <div className={styles.container}>
      <Head>
        <title>Household</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar page={"profil"} showLogo={true} />
      <div className={styles.actionSection}>
        <div className={styles.householdMain}>
          <div
            className={`fa-stack ${styles.householdAvatar}`}
            onClick={() =>
              router.push({
                pathname: `/user/${idUporabnika}/household/${idGospodinjstva}`,
                query: { householdColor: householdColor },
              })
            }
          >
            <FontAwesomeIcon
              className="fa-stack-2x iconCircle"
              icon={faCircle}
              style={{ color: `${householdColor}` }}
            />
            <FontAwesomeIcon
              className={`fa-stack-1x ${styles.householdIcon}`}
              icon={faVihara}
            />
          </div>
          <div className={styles.householdInfo}>
            {imeGospodinjstva ? (
              <h1 className={`${styles.heading}`}>{imeGospodinjstva}</h1>
            ) : (
              <h1 className={`${styles.heading}`}>Household...</h1>
            )}

            <SettingsMenu />
          </div>
        </div>
        <div className={styles.navigation}>
          <button
            onClick={() => setItemsJustBoughtModalOpen(true)}
            className={`fa-stack ${iconStyles.actionIconContainer}`}
          >
            <FontAwesomeIcon className="fa-stack-2x" icon={faCircle} />
            <FontAwesomeIcon
              className={`fa-stack-1x ${iconStyles.actionIcon}`}
              icon={faBasketShopping}
            />
          </button>
          <AnimatePresence>
            {itemsJustBoughtModalOpen && (
              <ItemsJustBoughtModal
                itemsJustBoughtModalOpen={itemsJustBoughtModalOpen}
                setItemsJustBoughtModalOpen={setItemsJustBoughtModalOpen}
              />
            )}
          </AnimatePresence>
          <button
            className={`fa-stack ${styles.actionIconContainer}`}
            onClick={() =>
              router.push({
                pathname: `/user/${idUporabnika}/household/${idGospodinjstva}/shoppingList`,
                query: { householdColor: householdColor },
              })
            }
          >
            <FontAwesomeIcon className="fa-stack-2x" icon={faCircle} />
            <FontAwesomeIcon
              className={`fa-stack-1x ${styles.actionIcon}`}
              icon={faListCheck}
            />
          </button>
          <button
            className={`fa-stack ${styles.actionIconContainer}`}
            onClick={() =>
              router.push({
                pathname: `/user/${idUporabnika}/household/${idGospodinjstva}/history`,
                query: { householdColor: householdColor },
              })
            }
          >
            <FontAwesomeIcon className="fa-stack-2x" icon={faCircle} />
            <FontAwesomeIcon
              className={`fa-stack-1x ${styles.actionIcon}`}
              icon={faClockRotateLeft}
            />
          </button>
        </div>
      </div>
      <span className={styles.vertical_line}></span>
      <>{children}</>
    </div>
  );
};

export default HouseholdLayout;
