import Image from "next/image";
import leftLogo from "../assets/images/BigLeftLogo.png";
import logo from "../assets/images/logo.svg";
import styles from "../styles/HouseholdListLayout.module.scss";
import Navbar from "./Navbar";
import axios from "axios";
import { useRouter } from "next/router";

const ProfileLayout = ({ children }) => {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <Navbar page={"householdList"} />

      <div className={styles.houseLogo}>
        <Image
          className={styles.logo}
          src={leftLogo}
          alt="DebtSettler Logo"
          height={284}
          width={370}
        />
      </div>

      <span className={styles.vertical_line}></span>

      <div className={styles.contentContainer}>{children}</div>

      {/* <div className={styles.logo}>
        <Image src={logo} alt="DebtSettler Logo" height={37} width={166} />
        <button
          onClick={async () => {
            const data = await axios.post("/api/logout");
            if (data.status === 200) {
              router.push("/login");
            }
          }}
        >
          Logout
        </button>
      </div> */}
    </div>
  );
};

export default ProfileLayout;

{
  /* <div className={styles.logo}>
						<Image className={styles.logo} src={leftLogo} alt="DebtSettler Logo" height={284} width={370} />
					</div> */
}
