import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/EmailListItem.module.scss";

const EmailListItem = ({ email, deleteEmail }) => {
  return (
    <li className={styles.emailItem}>
      <p>{email}</p>
      <FontAwesomeIcon
        className={styles.icon}
        icon={faXmark}
        onClick={() => deleteEmail(email)}
      />
    </li>
  );
};

export default EmailListItem;
