import Image from "next/image";
import leftLogo from "../assets/images/BigLeftLogo.png";
// import leftLogo from "../assets/images/House.svg"
import houseLogo from "../assets/images/HouseLogo.svg";
import styles from "../styles/BigLogoLayout.module.scss";
import axios from "axios";
import { useRouter } from "next/router";
import Navbar from "./Navbar";
import { motion } from "framer-motion";
import Household from "../pages/user/[userId]/household/[householdId]/index";
import Head from "next/head";

const BigLogoLayout = ({ page, children }) => {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <Head>
        <title>DebtSettler</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar page={page} showLogo={false} />
      <div className={styles.houseLogo}>
        <Image
          className={styles.logo}
          src={houseLogo}
          alt="DebtSettler Logo"
          height={284}
          width={370}
        />
      </div>

      <span className={styles.vertical_line}></span>
      <div className={styles.contentContainer}>{children}</div>
    </div>
  );
};

export default BigLogoLayout;

{
  /* <div className={styles.logo}>
						<Image className={styles.logo} src={leftLogo} alt="DebtSettler Logo" height={284} width={370} />
					</div> */
}
