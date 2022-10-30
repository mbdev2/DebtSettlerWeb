import styles from "../styles/HistoryItem.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faUserGroup,
  faUserAstronaut,
  faCircle,
  faTrash,
  faMoneyBillTransfer,
  faCartShopping,
  faUtensils,
  faChampagneGlasses,
  faShuttleSpace,
  // faCar,
  faCouch,
  faFilm,
  faBowlingBall,
  faFileInvoice,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { motion } from "framer-motion";

const categories = [
  <FontAwesomeIcon
    className={`fa-stack-1x ${styles.iconCategory}`}
    icon={faMoneyBillTransfer}
    fixedWidth
  />,
  <FontAwesomeIcon
    className={`fa-stack-1x ${styles.iconCategory}`}
    icon={faCartShopping}
    fixedWidth
  />,
  <FontAwesomeIcon
    className={`fa-stack-1x ${styles.iconCategory}`}
    icon={faUtensils}
    fixedWidth
  />,
  <FontAwesomeIcon
    className={`fa-stack-1x ${styles.iconCategory}`}
    icon={faChampagneGlasses}
    fixedWidth
  />,
  <FontAwesomeIcon
    className={`fa-stack-1x ${styles.iconCategory}`}
    icon={faShuttleSpace}
    fixedWidth
  />,
  <FontAwesomeIcon
    className={`fa-stack-1x ${styles.iconCategory}`}
    icon={faCouch}
    fixedWidth
  />,
  <FontAwesomeIcon
    className={`fa-stack-1x ${styles.iconCategory}`}
    icon={faFilm}
    fixedWidth
  />,
  <FontAwesomeIcon
    className={`fa-stack-1x ${styles.iconCategory}`}
    icon={faBowlingBall}
    fixedWidth
  />,
  <FontAwesomeIcon
    className={`fa-stack-1x ${styles.iconCategory}`}
    icon={faFileInvoice}
    fixedWidth
  />,
];
const HistoryListItem = ({
  userName,
  category,
  price,
  description,
  shopName,
  date,
  otherMembers,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <motion.li
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
      <div
        className={`${styles.container}`}
        onClick={() => setShowDetails((prev) => !prev)}
      >
        <div className={styles.itemGeneralInfo}>
          <div className={`fa-stack ${styles.iconCategoryContainer}`}>
            <FontAwesomeIcon
              className="fa-stack-2x iconCircle"
              icon={faCircle}
              fixedWidth
            />
            {categories[category]}
          </div>
          <div className={styles.name}>{userName}</div>
          {category === 0 ? (
            <div className={styles.shopPersonDate}>
              to {otherMembers[0]} &#183;{" "}
              <span className={styles.date}>{date}</span>
            </div>
          ) : (
            <div className={styles.shopPersonDate}>
              {shopName} &#183; <span className={styles.date}>{date}</span>
            </div>
          )}
          <div className={styles.price}>
            {(Math.round(price * 100) / 100).toFixed(2)}
          </div>
        </div>
        {showDetails && category !== 0 && (
          <div className={styles.otherDetails}>
            <div className={styles.detail}>
              <div className={styles.iconDetailContainer}>
                <FontAwesomeIcon
                  className={styles.detailInfoIcon}
                  icon={faCircleInfo}
                  fixedWidth
                />
              </div>
              <div className={styles.detailInfo}>
                <div className={styles.detailName}>Description</div>
                <div className={styles.detailContent}>{description}</div>
              </div>
            </div>
            <div className={styles.detail}>
              <div className={styles.iconDetailContainer}>
                <div className={`fa-stack `}>
                  <FontAwesomeIcon
                    className="fa-stack-2x iconCircle"
                    icon={faCircle}
                    fixedWidth
                  />
                  <FontAwesomeIcon
                    className={`fa-stack-1x ${styles.iconDetail}`}
                    icon={faUserGroup}
                    fixedWidth
                  />
                </div>
              </div>
              <div className={styles.detailInfo}>
                <div className={styles.detailName}>Other members</div>
                <div className={styles.detailContent}>
                  {otherMembers.join(", ")}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.li>
  );
};

export default HistoryListItem;
