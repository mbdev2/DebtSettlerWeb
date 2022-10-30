import Image from "next/image";
// import leftLogo from "../assets/images/BigLeftLogo.png";
import houseLogo from "../assets/images/HouseLogo.svg";
import styles from "../styles/BigLogoLayout.module.scss";
import Navbar from "./Navbar";
import axios from "axios";
import { useRouter } from "next/router";
import Head from "next/head";

const HouseholdListLayout = ({ children }) => {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <Head>
        <title>Households</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar page={"householdList"} />

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

export default HouseholdListLayout;

{
  /* <div className={styles.logo}>
						<Image className={styles.logo} src={leftLogo} alt="DebtSettler Logo" height={284} width={370} />
					</div> */
}
