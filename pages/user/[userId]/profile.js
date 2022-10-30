import Head from "next/head";
import styles from "../../../styles/Profile.module.scss";
import formStyles from "../../../styles/SigniInUp.module.scss";
import sStyles from "../../../styles/Spinner.module.scss";
import Navbar from "../../../components/Navbar";
import { useRouter } from "next/router";
import ContainerLayout from "../../../components/ContainerLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog } from "@headlessui/react";
import { HexColorPicker, HexColorInput } from "react-colorful";
import {
  faEye,
  faEyeSlash,
  faUserAstronaut,
  faCircle,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { object, string, ref, number, date, InferType } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import qs from "qs";
import { requireAuthentication } from "../../../hoc/requireAuthentication";
import { BeatLoader, PuffLoader } from "react-spinners";
import { useUser } from "../../../utils/helper";
import useSWR, { useSWRConfig } from "swr";
import { motion, AnimatePresence } from "framer-motion";

const registerUser = async (data) => {
  const newData = qs.stringify({
    ime: data.name,
    email: data.email,
    barvaUporabnika: "333444",
    geslo: data.password,
  });
  // console.log(newData);

  // try {
  //   //const res = await axios.post('http://89.142.196.64:3000/api/registracija', newData);
  //   const res = await axios.post("api/proxy/registracija", newData);
    console.log(res.data);
  // } catch (err) {
    console.log(`Error: ${err.message}`);
  // }
};

const Profile = () => {
  const router = useRouter();
  const idUporabnika = router.query.userId;
  const { user, isUserLoading, mutateUser } = useUser(idUporabnika);

  const usePasswordToggle = () => {
    const [show, setShow] = useState(false);
    const togglePasswordVisiblity = () => {
      setShow((prev) => !prev);
    };
    return [show, togglePasswordVisiblity];
  };

  const [oldPasswordShown, toggleOldPasswordVisiblity] = usePasswordToggle();
  const [newPasswordShown, toggleNewPasswordVisiblity] = usePasswordToggle();
  const [
    newPasswordConfirmationShown,
    toggleNewPasswordConfirmationVisibility,
  ] = usePasswordToggle();

  const schema = object({
    imeUp: string().required("Name is required"),
    emailUp: string()
      .email("Email must be a valid email")
      .required("Email is required"),
  });
  const {
    reset,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: useMemo(() => {
      return {
        imeUp: user?.imeUporabnika,
        emailUp: user?.emailUporabnika,
      };
    }, [user]),
  });
  const onSubmit = async (data) => {
    if (data.imeUp !== user.imeUporabnika) {
      const newData = qs.stringify({ ...data, barvaUp: user.barvaUporabnika });
      // console.log(newData);
      try {
        const res = await axios.post("/api/users/posodobiUporabnika", newData);
        // console.log(res);
        mutateUser();
      } catch (error) {
        
      }
    }
    // console.log("op", data);
  };

  const passwordSchema = object({
    oldPassword: string().required("Old password is required"),
    newPassword: string().required("New password is required"),
    cNewPassword: string()
      .oneOf([ref("newPassword")], "Passwords do not match")
      .required("Confirm the new password"),
  });
  const {
    register: registerNewPassword,
    handleSubmit: handleNewPasswordSubmit,
    formState: { errors: errors2 },
    reset: resetPassowrdField,
    setError: setNewPasswordError,
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const onNewPasswordSubmit = async (data) => {
    // console.log(data);
    const newData = qs.stringify({
      geslo: data.oldPassword,
      novoGeslo: data.newPassword,
    });
    // console.log(newData);
    try {
      const res = await axios.post("/api/users/menjavaGesla", newData);
      // console.log(res);
      resetPassowrdField();
    } catch (error) {
      // console.log(error.response.data);
      if ((error.response.data = "Napačno geslo"))
        setNewPasswordError("oldPassword", {
          type: "focus",
          message: "Incorrect password",
        });
    }
    // resetPassowrdField();
  };

  const [avatarColor, setAvatarColor] = useState(() => {
    isUserLoading ? "#65c8bc" : `#${user.barvaUporabnika}`;
  });
  const [openColorModal, setOpenColorModal] = useState(false);

  async function handleNewColorSubmit(e) {
    e.preventDefault();
    mutateUser({ ...user, barvaUporabnika: avatarColor.substring(1) });
    // console.log(avatarColor);
    setOpenColorModal(false);
    const newData = qs.stringify({
      imeUp: user.imeUporabnika,
      emailUp: user.emailUporabnika,
      barvaUp: avatarColor.substring(1),
    });
    // console.log(newData);
    try {
      const res = await axios.post("/api/users/posodobiUporabnika", newData);
      mutateUser();
    } catch (error) {
    }
  }

  // useEffect(() => {
  //   if (user) {
  //     reset({
  //       imeUp: user.imeUporabnika,
  //       emailUp: user.emailUporabnika,
  //     });
  //   }
  // }, [user]);
  useEffect(() => {
      setValue("imeUp", user?.imeUporabnika);
      setValue("emailUp", user?.emailUporabnika);
  }, [user]);

  /** */
  if (isUserLoading) {
    return (
      <div className={sStyles.container}>
        <BeatLoader color="#65c8bc" />
      </div>
    );
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Profile</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar page={"profil"} showLogo={true} />
      <div className={styles.infoSection}>
        <div className={styles.avatarSection}>
          <div className={`fa-stack ${styles.avatar}`}>
            <FontAwesomeIcon
              className="fa-stack-2x iconCircle"
              icon={faCircle}
              style={{ color: `#${user.barvaUporabnika}` }}
            />
            <FontAwesomeIcon
              className={`fa-stack-1x ${styles.avatarIcon}`}
              icon={faUserAstronaut}
            />
          </div>
          <button
            onClick={() => {
              setOpenColorModal(true);
            }}
          >
            Change color
          </button>
          <AnimatePresence>
            {openColorModal && (
              <Dialog
                open={openColorModal}
                onClose={() => setOpenColorModal(false)}
              >
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
                      <h1 className={styles.subHeading}>Pick a color</h1>
                      <form
                        id="newColorForm"
                        className={styles.pickColorSection}
                        onSubmit={handleNewColorSubmit}
                      >
                        <div className={`fa-stack ${styles.avatar}`}>
                          <FontAwesomeIcon
                            className="fa-stack-2x"
                            icon={faCircle}
                            style={{ color: `${avatarColor}` }}
                          />
                          <FontAwesomeIcon
                            className={`fa-stack-1x ${styles.avatarIcon}`}
                            icon={faUserAstronaut}
                          />
                        </div>
                        <HexColorPicker
                          color={avatarColor}
                          onChange={setAvatarColor}
                        />
                      </form>
                      <button
                        type="submit"
                        form="newColorForm"
                        className={styles.btnSolid}
                      >
                        Change color
                      </button>
                      <button
                        onClick={() => setOpenColorModal(false)}
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
        </div>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>Name</label>
            <input type="text" placeholder="Name" {...register("imeUp")} />
            {errors.imeUp && <p>{errors.imeUp.message}</p>}
          </div>
          <div>
            <label>Email</label>
            <input
              className={styles.restrictedInput}
              type="email"
              placeholder="Email"
              readOnly
              {...register("emailUp")}
            />
            {errors.emailUp && <p>{errors.emailUp.message}</p>}
          </div>
          <button className={styles.btnSolid} type="submit">
            Save
          </button>
        </form>
      </div>
      <span className={styles.vertical_line}></span>
      <div className={styles.passworChangeSection}>
        <form
          className={styles.form}
          onSubmit={handleNewPasswordSubmit(onNewPasswordSubmit)}
        >
          <div className={styles.password}>
            <label>Old password</label>
            <input
              type={oldPasswordShown ? "text" : "password"}
              {...registerNewPassword("oldPassword")}
            />
            {errors2.oldPassword && <p>{errors2.oldPassword.message}</p>}
            <FontAwesomeIcon
              className={styles.icon}
              icon={oldPasswordShown ? faEyeSlash : faEye}
              onClick={() => toggleOldPasswordVisiblity()}
            />
          </div>
          <div className={styles.password}>
            <label>New password</label>
            <input
              type={newPasswordShown ? "text" : "password"}
              {...registerNewPassword("newPassword")}
            />
            {errors2.newPassword && <p>{errors2.newPassword.message}</p>}
            <FontAwesomeIcon
              className={styles.icon}
              icon={newPasswordShown ? faEyeSlash : faEye}
              onClick={() => toggleNewPasswordVisiblity()}
            />
          </div>
          <div className={styles.password}>
            <label>Confirm new password</label>
            <input
              type={newPasswordConfirmationShown ? "text" : "password"}
              {...registerNewPassword("cNewPassword")}
            />
            {errors2.cNewPassword && <p>{errors2.cNewPassword.message}</p>}
            <FontAwesomeIcon
              className={styles.icon}
              icon={newPasswordConfirmationShown ? faEyeSlash : faEye}
              onClick={() => toggleNewPasswordConfirmationVisibility()}
            />
          </div>
          <button className={styles.btnSolid} type="submit">
            Change password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;

Profile.getLayout = function getLayout(page) {
  return <ContainerLayout>{page}</ContainerLayout>;
};

export const getServerSideProps = requireAuthentication(async (context) => {
  return {
    props: {},
  };
});
