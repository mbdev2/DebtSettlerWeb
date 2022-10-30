import React from "react";
import { Dialog } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { object, string, ref, number, date, InferType } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import qs from "qs";
import styles from "../styles/AddItemModal.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useShoppingList, useUser, useUserHousholdInfo } from "../utils/helper";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { motion } from "framer-motion";

const EditItemModal = ({
  modalState,
  closeModal,
  name,
  description,
  quantity,
  id,
  selected,
}) => {
  const router = useRouter();
  const idUporabnika = router.query.userId;
  const idGospodinjstva = router.query.householdId;
  const { user, isUserLoading } = useUser(idUporabnika);
  const { seznam, isSeznamLoading, mutateSeznam } =
    useShoppingList(idGospodinjstva);
  const {
    userHouseholdInfo,
    isUserHousheholdInfoLoading,
    mutateUserHouseholdInfo,
  } = useUserHousholdInfo(idUporabnika, idGospodinjstva);

  const schema = object({
    naslov: string().required("Item is required"),
    kolicina: number().positive("Invalid").typeError("Amount is required"),
    opis: string().required("Description is required"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      naslov: name,
      kolicina: quantity,
      opis: description,
      idArtikla: id,
    },
  });

  const editItem = async (data) => {
    console.log(data);
    const { GStoken } = userHouseholdInfo;
    console.log(GStoken);
    const newData = qs.stringify({ ...data, aquired: selected });
    console.log(newData);
    try {
      const res = await axios.post("/api/seznam/posodobi", newData, {
        headers: {
          Authorization: "Bearer " + GStoken,
        },
      });
      console.log(res.data);
      mutateSeznam();
    } catch (error) {
      console.log(error.response.data);
    }
    handleModalClose();
  };

  const handleModalClose = () => {
    reset();
    closeModal();
  };

  useEffect(() => {
    if (quantity) {
      setValue("naslov", name);
      setValue("kolicina", quantity);
      setValue("opis", description);
    }
  }, [name, quantity, description]);

  if (modalState) {
    return (
      <Dialog open={modalState} onClose={handleModalClose}>
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
              <h2 className={styles.heading}>Edit an item</h2>
              <form className={styles.form} onSubmit={handleSubmit(editItem)}>
                <div className={styles.data}>
                  <div>
                    <input
                      type="text"
                      placeholder="Item name"
                      {...register("naslov")}
                    />
                    {errors.naslov && <p>{errors.naslov.message}</p>}
                  </div>
                  <div>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      {...register("kolicina")}
                    />
                    {errors.kolicina && <p>{errors.kolicina.message}</p>}
                  </div>
                  <div className={styles.description}>
                    <input
                      type="text"
                      placeholder="Description"
                      {...register("opis")}
                    />
                    {errors.opis && <p>{errors.opis.message}</p>}
                  </div>
                </div>
                <button type="submit" className={styles.btnSolid}>
                  Confirm
                </button>
              </form>
              <button onClick={closeModal} className={styles.closeModalButton}>
                <FontAwesomeIcon icon={faXmark} fixedWidth />
              </button>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    );
  } else {
    return;
  }
};

export default EditItemModal;
