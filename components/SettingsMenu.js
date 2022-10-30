import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faUser,
  faArrowRightFromBracket,
  faTrash,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/SettingsMenu.module.scss";
import { Menu } from "@headlessui/react";
import { Float } from "@headlessui-float/react";
import ViewMembersModal from "./ViewMembersModal";
import { useUserHousholdInfo } from "../utils/helper";
import { useRouter } from "next/router";
import axios from "axios";
import { AnimatePresence } from "framer-motion";

const SettingsMenu = () => {
  const router = useRouter();
  const idUporabnika = router.query.userId;
  const idGospodinjstva = router.query.householdId;
  const {
    userHouseholdInfo,
    isUserHousheholdInfoLoading,
    mutateUserHouseholdInfo,
  } = useUserHousholdInfo(idUporabnika, idGospodinjstva);

  const [modalState, setModalState] = useState(false);

  const handleDeleteHousehold = async () => {
    const { GStoken } = userHouseholdInfo;
    console.log(GStoken);
    try {
      const res = await axios.delete("/api/gospodinjstvo/izbrisi", {
        headers: {
          Authorization: "Bearer " + GStoken,
        },
      });
      console.log(res.data);
      router.push(`/user/${idUporabnika}/`);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  if (isUserHousheholdInfoLoading) {
    return <></>;
  }
  return (
    <div className={styles.settings}>
      <AnimatePresence>
        {modalState && (
          <ViewMembersModal
            open={modalState}
            onClose={() => setModalState(false)}
          />
        )}
      </AnimatePresence>
      <Menu>
        <Float placement="bottom-start" shift={16}>
          <Menu.Button className={styles.gear}>
            <FontAwesomeIcon icon={faGear} />
          </Menu.Button>
          <Menu.Items className={styles.menuContent}>
            <Menu.Item>
              {({ active }) => (
                <div
                  className={` ${styles.contentItem} ${
                    active ? styles.menuItemActive : ""
                  }`}
                  onClick={() => setModalState(true)}
                >
                  <FontAwesomeIcon icon={faUserGroup} fixedWidth />
                  View members
                </div>
              )}
            </Menu.Item>
            {userHouseholdInfo.isAdmin && (
              <Menu.Item>
                {({ active }) => (
                  <div
                    className={` ${styles.contentItem} ${
                      active ? styles.menuItemActive : ""
                    }`}
                    onClick={handleDeleteHousehold}
                  >
                    <FontAwesomeIcon icon={faTrash} fixedWidth />
                    Delete household
                  </div>
                )}
              </Menu.Item>
            )}
            <div className={styles.separator} />
            <Menu.Item>
              {({ active }) => (
                <div
                  className={`${styles.logout} ${styles.contentItem} ${
                    active ? styles.logoutActive : ""
                  }`}
                >
                  <FontAwesomeIcon icon={faArrowRightFromBracket} fixedWidth />
                  Leave household
                </div>
              )}
            </Menu.Item>
          </Menu.Items>
        </Float>
      </Menu>
      <span>Settings</span>
    </div>
  );
};

export default SettingsMenu;
