import styles from "../styles/HouseholdBalanceItem.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faUserAstronaut,
  faCircle,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import randomColor from "../utility functions/randomColor";
import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { object, string, ref, number, date, InferType } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/router";
import {
  useUser,
  useHousholdUsers,
  useUserHousholdInfo,
} from "../utils/helper";
import qs from "qs";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const HouseholdBalanceItem = ({
  name,
  moneyState,
  color,
  selected,
  id,
  upVGosID,
  mutate,
}) => {
  const router = useRouter();
  const idUporabnika = router.query.userId;
  const idGospodinjstva = router.query.householdId;
  const {
    userHouseholdInfo,
    isUserHousheholdInfoLoading,
    mutateUserHouseholdInfo,
  } = useUserHousholdInfo(idUporabnika, idGospodinjstva);

  const [modalState, setModalState] = useState(false);

  const schema = object({
    znesek: number()
      .positive("Amount can't be negative")
      .typeError("Amount is required"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const closeModal = () => {
    reset();
    setModalState(false);
  };

  const settleDebt = async (data) => {
    const { GStoken } = userHouseholdInfo;
    console.log(GStoken);
    const newData = qs.stringify({
      prejemnikIdUpvGos: upVGosID,
      znesek: data.znesek,
    });

    console.log(newData);
    try {
      const res = await axios.post("/api/nakupi/poravnavaDolga", newData, {
        headers: {
          Authorization: "Bearer " + GStoken,
        },
      });
      console.log(res.data);
      mutate();
    } catch (error) {
      console.log(error.response.data);
    }
    closeModal();
  };
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
      <AnimatePresence>
        {modalState && (
          <Dialog open={modalState} onClose={closeModal}>
            <motion.div
              className={styles.backdrop}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,

                transition: { duration: 0.1, ease: "easeOut" },
              }}
              exit={{
                opacity: 0,

                transition: { duration: 0.1, ease: "easeIn" },
              }}
            />
            <div className={styles.modalWrapper}>
              <div className={styles.anotherWrapper}>
                <Dialog.Panel
                  className={styles.modal}
                  as={motion.div}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.1, ease: "easeOut" },
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.95,
                    transition: { duration: 0.1, ease: "easeIn" },
                  }}
                >
                  <h2 className={styles.modalHeading}><span>Send money to</span> {name}</h2>
                  <form
                    className={styles.form}
                    onSubmit={handleSubmit(settleDebt)}
                  >
                    <div className={styles.price}>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Amount"
                        {...register("znesek")}
                      />
                      {errors.znesek && <p>{errors.znesek.message}</p>}
                    </div>
                    <button type="submit" className={styles.btnSolid}>
                      Confirm
                    </button>
                  </form>
                  <button
                    onClick={closeModal}
                    className={styles.closeModalButton}
                  >
                    <FontAwesomeIcon icon={faXmark} fixedWidth />
                  </button>
                </Dialog.Panel>
              </div>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
      <div
        className={` ${styles.container} ${selected ? styles.selected : ""}`}
        onClick={idUporabnika === id ? undefined : () => setModalState(true)}
      >
        <div className={`fa-stack ${styles.iconUserFull}`}>
          <FontAwesomeIcon
            className="fa-stack-2x iconCircle"
            icon={faCircle}
            fixedWidth
            style={{ color: `${color}` }}
          />
          <FontAwesomeIcon
            className={`fa-stack-1x ${styles.iconUser}`}
            icon={faUserAstronaut}
            fixedWidth
          />
        </div>
        <h2 className={styles.name}>{name}</h2>
        <p className={styles.status}>
          <span className={`${moneyState < 0 ? styles.debt : styles.credit}`}>
            {moneyState}
          </span>
        </p>
      </div>
    </motion.li>
  );
};

export default HouseholdBalanceItem;
