import { useState } from "react";
import styles from "../styles/Modal.module.scss";
import fStyles from "../styles/SigniInUp.module.scss";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { object, string, ref, number, date, InferType } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faXmark } from "@fortawesome/free-solid-svg-icons";
import EmailListItem from "./EmailListItem";
// import * as Dialog from "@radix-ui/react-dialog";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import qs from "qs";
import { mutate } from "swr";
import { motion } from "framer-motion";

const Modal = ({ modalState, closeModal, mutate }) => {
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const [GStoken, setGStoken] = useState("");

  const [emailList, setEmailList] = useState([]);

  const [nextStep, setNextStep] = useState(false);

  const schema = object({
    name: string().required("Name is required"),
    password: string().required("Password is required"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data) => {
    const newData = qs.stringify({
      imeGospodinjstva: data.name,
      geslo: data.password,
    });
    console.log(newData);
    // setNextStep(true);
    try {
      // const res = await axios.post('http://89.142.196.64:3000/api/prijava', newData);
      const res = await axios.post("/api/gospodinjstvo/ustvari", newData);
      console.log("to je to", res.data);
      setGStoken(res.data.GStoken);
      mutate();
      setNextStep(true);
    } catch (error) {
      console.log(error.response.data);
      // alert("Wrong email or password");
    }
  };

  const emailSchema = object({
    //email: string().email('Email must be a valid email').required('Email is required'),
    email: string().email("Email must be a valid email"),
  });
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: errors2 },
    reset: resetEmail,
  } = useForm({
    resolver: yupResolver(emailSchema),
  });

  const onEmailSubmit = (data) => {
    if (data.email !== "") {
      const newEmailList = emailList.filter(
        (item) => item.email !== data.email
      );
      setEmailList([data, ...newEmailList]);

      resetEmail();
    }
  };

  const deleteEmail = (email) => {
    console.log(email);
    console.log(emailList);
    setEmailList(emailList.filter((item) => item.email !== email));
  };

  const handleAddingMembers = async () => {
    console.log("op", emailList);
    const promises = emailList.map(async (data) => {
      const newData = qs.stringify(data);
      try {
        const res = await axios.post("/api/gospodinjstvo/dodajClana", newData, {
          headers: {
            Authorization: "Bearer " + GStoken,
          },
        });
        console.log("to je to", res.data);
      } catch (error) {
        console.log(error.response.data);
      }
    });
    await Promise.all(promises);
    handleModalClose();
  };

  const handleSkip = () => {
    closeModal();
    setNextStep((prev) => !prev);
  };

  const handleModalClose = () => {
    setEmailList([]);
    setNextStep(false);
    reset();
    resetEmail();
    closeModal();
  };

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
              {!nextStep && (
                <div className={styles.createHousehold}>
                  <h1 className={styles.heading}>Create a household</h1>
                  <form
                    className={fStyles.form}
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div>
                      <input
                        type="text"
                        placeholder="Name"
                        {...register("name")}
                      />
                      {errors.name && <p>{errors.name.message}</p>}
                    </div>
                    <div className={fStyles.password}>
                      <input
                        type={passwordShown ? "text" : "password"}
                        placeholder="Password"
                        {...register("password")}
                      />
                      {errors.password && <p>{errors.password.message}</p>}
                      <FontAwesomeIcon
                        className={fStyles.icon}
                        icon={passwordShown ? faEyeSlash : faEye}
                        onClick={() => togglePasswordVisiblity()}
                      />
                    </div>
                    <button className={styles.btnSolid} type="submit">
                      Create a new household
                    </button>
                  </form>
                </div>
              )}
              {nextStep && (
                <div id="addMembers" className={styles.addMembers}>
                  <h1 className={styles.heading}>Add members</h1>
                  <form
                    className={fStyles.form}
                    onSubmit={handleEmailSubmit(onEmailSubmit)}
                  >
                    <div className={styles.addEmail}>
                      <input
                        type="email"
                        placeholder="Email"
                        {...registerEmail("email")}
                      />
                      <button className={styles.btnSolid} type="submit">
                        Add
                      </button>
                    </div>
                    {errors2.email && <p>{errors2.email.message}</p>}
                    <div className={styles.emailList}>
                      {emailList.map(({ email }) => {
                        return (
                          <EmailListItem
                            key={email}
                            email={email}
                            deleteEmail={deleteEmail}
                          />
                        );
                      })}
                    </div>
                  </form>
                  <button
                    className={styles.btnSolid}
                    onClick={handleAddingMembers}
                  >
                    Confirm
                  </button>
                  {/* <Link href="/secretPage"><a className={styles.skip}>Skip this step</a></Link> */}
                  <a className={styles.skip} onClick={handleModalClose}>
                    Skip this step
                  </a>
                </div>
              )}
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

export default Modal;
