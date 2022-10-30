import Image from "next/image";
import logo from "../assets/images/Logo.svg";
import styles from "../styles/Navbar.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faUser,
  faHouse,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import axios from "axios";
import { useEffect, Fragment } from "react";
import { Menu } from "@headlessui/react";

const Navbar = ({ page, showLogo }) => {
  const router = useRouter();
  const idUporabnika = router.query.userId;

  async function handleLogout() {
    // console.log("yo");
    const data = await axios.get("/api/auth/logout");
    if (data.status === 200) {
      router.push("/login");
    }
  }

  function viewProfile() {
    router.push(`/user/${idUporabnika}/profile`);
  }
  function viewHouseholdList() {
    router.push(`/user/${idUporabnika}`);
  }

  // useEffect(() => {
  //   console.log("change");
  // }, [page]);
  return (
    <nav className={styles.nav}>
      <div
        className={`${styles.logo} ${!showLogo ? styles.special : ""}`}
        onClick={() => router.push(`/user/${idUporabnika}/`)}
      >
        <Image src={logo} alt="DebtSettler Logo" height={37} width={166} />
      </div>
      <div className={styles.menuContainer}>
        <Menu>
          <Menu.Button
            className={`${styles.accountButton} ${
              page === "login" ? styles.special : ""
            }`}
          >
            <span>My Account</span>
            <FontAwesomeIcon className={`${styles.icon}`} icon={faCircleUser} />
          </Menu.Button>
          <Menu.Items className={styles.accountContent} as={"div"}>
            <Menu.Item>
              {({ active }) => (
                <div
                  className={` ${styles.contentItem} ${
                    active ? styles.menuItemActive : ""
                  }`}
                  onClick={viewProfile}
                >
                  <FontAwesomeIcon icon={faUser} fixedWidth />
                  View profile
                </div>
              )}
            </Menu.Item>
            {page !== "householdList" && (
              <Menu.Item>
                {({ active }) => (
                  <div
                    className={` ${styles.contentItem} ${
                      active ? styles.menuItemActive : ""
                    }`}
                    onClick={viewHouseholdList}
                  >
                    <FontAwesomeIcon icon={faHouse} fixedWidth />
                    Switch household
                  </div>
                )}
              </Menu.Item>
            )}
            {/* <div className={styles.separator} />
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
            </Menu.Item> */}
            <div className={styles.separator} />
            <Menu.Item>
              {({ active }) => (
                <div
                  className={`${styles.logout} ${styles.contentItem} ${
                    active ? styles.logoutActive : ""
                  }`}
                  onClick={handleLogout}
                >
                  <FontAwesomeIcon icon={faArrowRightFromBracket} fixedWidth />
                  Logout
                </div>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
    </nav>
  );
};

export default Navbar;
