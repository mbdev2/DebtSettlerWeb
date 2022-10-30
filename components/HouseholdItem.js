import styles from "../styles/HouseholdItem.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faVihara,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import randomColor from "../utility functions/randomColor";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const HouseholdItem = ({ name, moneyState, color, selected, onClick }) => {
  const [info, setInfo] = useState({});

  useEffect(() => {
    const info = {
      color: color,
      moneyState: (Math.round(moneyState * 100) / 100).toFixed(2),
    };

    setInfo(info);
  }, []);

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
        className={` ${styles.container} ${selected ? styles.selected : ""}`}
        onClick={onClick}
      >
        <div className={`fa-stack ${styles.iconHousehold}`}>
          <FontAwesomeIcon
            className="fa-stack-2x iconCircle"
            icon={faCircle}
            fixedWidth
            style={{ color: `${info.color}` }}
          />
          <FontAwesomeIcon
            className={`fa-stack-1x ${styles.iconHouse}`}
            icon={faVihara}
            fixedWidth
          />
        </div>
        <h2 className={styles.name}>{name}</h2>
        <p className={styles.status}>
          <span
            className={`${info.moneyState < 0 ? styles.debt : styles.credit}`}
          >
            {info.moneyState}
          </span>
        </p>
        <FontAwesomeIcon
          className={styles.icon}
          icon={faCircleCheck}
          size="1x"
        />
      </div>
    </motion.li>
  );
};

export default HouseholdItem;
