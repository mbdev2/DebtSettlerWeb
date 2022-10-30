import React from "react";

import styles from "../styles/ShoppingItem.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faUserAstronaut,
  faCircle,
  faTrash,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import randomColor from "../utility functions/randomColor";
import { useEffect, useState } from "react";
import EditItemModal from "./EditItemModal";
import { motion, AnimatePresence } from "framer-motion";

const ShoppingItem = ({
  name,
  description,
  quantity,
  selected,
  id,
  onClick,
  removeItem,
}) => {
  const [modalState, setModalState] = useState(false);

  return (
    <motion.li
      // className={` ${styles.container} ${selected ? styles.selected : ""}`}
      key={id}
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
      <AnimatePresence>
        {modalState && (
          <EditItemModal
            modalState={modalState}
            closeModal={() => setModalState(false)}
            name={name}
            description={description}
            quantity={quantity}
            id={id}
            selected={selected}
            key={id + "modal"}
          />
        )}
      </AnimatePresence>
      <div
        className={` ${styles.container} ${selected ? styles.selected : ""}`}
      >
        <FontAwesomeIcon
          className={styles.icon}
          icon={faCircleCheck}
          size="1x"
        />
        <div className={styles.item} onClick={onClick}>
          <h2 className={styles.name}>{`${quantity}x ${name}`}</h2>
          <p className={styles.description}>{description}</p>
        </div>
        <FontAwesomeIcon
          className={styles.penIcon}
          icon={faPenToSquare}
          size="1x"
          onClick={() => setModalState(true)}
        />
        <FontAwesomeIcon
          className={styles.trashIcon}
          icon={faTrash}
          size="1x"
          onClick={removeItem}
        />
      </div>
    </motion.li>
  );
};

export default ShoppingItem;
