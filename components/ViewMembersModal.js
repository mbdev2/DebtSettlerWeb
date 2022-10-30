import React from "react";
//import styles from "../styles/ItemsJustBoughtModal.module.scss";
import styles from "../styles/ViewMembersModal.module.scss";
import { useForm } from "react-hook-form";
import { object, string, ref, number, date, InferType } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserAstronaut,
  faCircle,
  faCircleCheck,
  faBasketShopping,
  faXmark,
  faCaretDown,
  faChevronDown,
  faChevronUp,
  faEllipsis,
  faUserSlash,
  faUserGear,
} from "@fortawesome/free-solid-svg-icons";
import { Dialog } from "@headlessui/react";
import { Menu } from "@headlessui/react";
import { Disclosure } from "@headlessui/react";
import { Float } from "@headlessui-float/react";
import { Popover } from "@headlessui/react";
import { useRouter } from "next/router";
import {
  useUser,
  useHousholdUsers,
  useUserHousholdInfo,
} from "../utils/helper";
import { BeatLoader } from "react-spinners";
import sStyles from "../styles/Spinner.module.scss";
import axios from "axios";
import qs from "qs";
import { motion, AnimatePresence} from "framer-motion";

// const uporabniki = [
//   {
//     imeUporabnika: "Mark",
//     barvaUporabnika: "FFE347",
//     idUporabnika: "628a55e0114b6b460b33ddbd",
//     upVGosID: "628a860c114b6b460b53de03",
//     stanjeDenarja: -5.02,
//     porabljenDenar: 0,
//     zamrznjenStatus: false,
//     deleteStatus: false,
//   },
//   {
//     imeUporabnika: "Raul",
//     barvaUporabnika: "5BC0EB",
//     idUporabnika: "628a55e0114bf4460b53ddbd",
//     upVGosID: "628a860c114b6b460b53de03",
//     stanjeDenarja: 120.0,
//     porabljenDenar: 0,
//     zamrznjenStatus: false,
//     deleteStatus: false,
//   },
//   {
//     imeUporabnika: "Dorde",
//     barvaUporabnika: "BCE784",
//     idUporabnika: "628a32f5114b6b460b53ddca",
//     upVGosID: "628a860c114b6b460b53de03",
//     stanjeDenarja: 13.54,
//     porabljenDenar: 0,
//     zamrznjenStatus: false,
//     deleteStatus: false,
//   },
//   {
//     imeUporabnika: "Blaz",
//     barvaUporabnika: "FFC914",
//     idUporabnika: "628a829511ds6b460b53ddca",
//     upVGosID: "628a860c114b6b460b53de03",
//     stanjeDenarja: 13.54,
//     porabljenDenar: 0,
//     zamrznjenStatus: false,
//     deleteStatus: false,
//   },
// ];
const ViewMembersModal = ({ open, onClose }) => {
  const router = useRouter();
  const idUporabnika = router.query.userId;
  const idGospodinjstva = router.query.householdId;
  const { user, isUserLoading } = useUser(idUporabnika);
  const { uporabniki, isHousholdUsersLoading, mutateUporabniki } =
    useHousholdUsers(idUporabnika, idGospodinjstva);
  const {
    userHouseholdInfo,
    isUserHousheholdInfoLoading,
    mutateUserHouseholdInfo,
  } = useUserHousholdInfo(idUporabnika, idGospodinjstva);

  const schema = object({
    email: string()
      .required("Email is required")
      .email("Email must be a valid email"),
  });
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const { GStoken } = userHouseholdInfo;
    const newData = qs.stringify(data);
    try {
      const res = await axios.post("/api/gospodinjstvo/dodajClana", newData, {
        headers: {
          Authorization: "Bearer " + GStoken,
        },
      });
      console.log("to je to", res.data);
      mutateUporabniki();
      reset();
    } catch (error) {
      console.log(error.response.data);
      setError("email", {
        type: "focus",
        message: "Email doesn't exist",
      });
    }
  };
  const handleRemoveMember = async (upVGosID) => {
    const { GStoken } = userHouseholdInfo;
    console.log(GStoken);
    const data = qs.stringify({
      upVGosID: upVGosID,
    });
    console.log(data);
    try {
      const res = await axios.post("/api/gospodinjstvo/odstraniClana", data, {
        headers: {
          Authorization: "Bearer " + GStoken,
        },
      });
      console.log(res.data);
      mutateUporabniki();
    } catch (error) {
      console.log(error.response.data);
    }
  };
  const handlePassAdminRights = async (idUporabnika) => {
    const { GStoken } = userHouseholdInfo;
    console.log(GStoken);
    const data = qs.stringify({
      idUporabnika: idUporabnika,
    });
    console.log(data);
    try {
      const res = await axios.post("/api/gospodinjstvo/adminPredaja", data, {
        headers: {
          Authorization: "Bearer " + GStoken,
        },
      });
      console.log(res.data);
      mutateUserHouseholdInfo();
    } catch (error) {
      console.log(error.response.data);
    }
  };
  const handleModalClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleModalClose}>
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
            <Dialog.Title className={styles.heading}>
              Household members
            </Dialog.Title>
            {isHousholdUsersLoading || isUserHousheholdInfoLoading ? (
              <div className={sStyles.container}>
                <BeatLoader color="#65c8bc" />
              </div>
            ) : (
              <>
                {userHouseholdInfo.isAdmin && (
                  <form
                    className={styles.form}
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div>
                      <input
                        type="email"
                        placeholder="Email"
                        {...register("email")}
                      />
                      {errors.email && <p>{errors.email.message}</p>}
                    </div>
                    <button className={styles.btnSolid} type="submit">
                      Add
                    </button>
                  </form>
                )}
                <ul className={styles.selectMemebersList}>
                  <AnimatePresence initial={false}>
                    {[
                      uporabniki.find(
                        ({ idUporabnika }) => idUporabnika === user.idUporabnika
                      ),
                      ...uporabniki.filter(
                        (uporabnik) =>
                          uporabnik.idUporabnika !== user.idUporabnika &&
                          uporabnik.deleteStatus === false
                      ),
                    ].map((person, index) => (
                      <motion.li
                       
                          key={person.idUporabnika}
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
                        <div className={` ${styles.selectMemberContainer} `}>
                          <div className={`fa-stack ${styles.iconUserFull}`}>
                            <FontAwesomeIcon
                              className="fa-stack-2x iconCircle"
                              icon={faCircle}
                              fixedWidth
                              style={{ color: `#${person.barvaUporabnika}` }}
                            />
                            <FontAwesomeIcon
                              className={`fa-stack-1x ${styles.iconUser}`}
                              icon={faUserAstronaut}
                              fixedWidth
                            />
                          </div>
                          <div className={styles.name}>
                            {person.imeUporabnika}
                          </div>
                          {userHouseholdInfo.isAdmin &&
                            person.idUporabnika !== user.idUporabnika && (
                              <Popover>
                                <Float
                                  placement="bottom-start"
                                  shift={16}
                                  portal
                                >
                                  <Popover.Button className={styles.icon}>
                                    <FontAwesomeIcon icon={faEllipsis} />
                                  </Popover.Button>
                                  <Popover.Panel className={styles.menuContent}>
                                    <Disclosure>
                                      <Disclosure.Button
                                        className={` ${styles.contentItem} `}
                                        as={"div"}
                                      >
                                        <FontAwesomeIcon
                                          icon={faUserSlash}
                                          fixedWidth
                                        />
                                        Remove member
                                      </Disclosure.Button>
                                      <Disclosure.Panel className="text-gray-500">
                                        <div className={styles.separator} />
                                        <div className={styles.buttonArea}>
                                          <Disclosure.Button
                                            className={styles.btnSolid}
                                          >
                                            Cancel
                                          </Disclosure.Button>
                                          <Disclosure.Button
                                            className={styles.btnLight}
                                            onClick={() =>
                                              handleRemoveMember(
                                                person.upVGosID
                                              )
                                            }
                                          >
                                            Confirm
                                          </Disclosure.Button>
                                        </div>
                                      </Disclosure.Panel>
                                    </Disclosure>
                                    <Disclosure>
                                      <Disclosure.Button
                                        className={` ${styles.contentItem} `}
                                        as={"div"}
                                      >
                                        <FontAwesomeIcon
                                          icon={faUserGear}
                                          fixedWidth
                                        />
                                        Pass admin rights
                                      </Disclosure.Button>
                                      <Disclosure.Panel className="text-gray-500">
                                        <div className={styles.separator} />
                                        <div className={styles.buttonArea}>
                                          <Disclosure.Button
                                            className={styles.btnSolid}
                                          >
                                            Cancel
                                          </Disclosure.Button>
                                          <Disclosure.Button
                                            className={styles.btnLight}
                                            onClick={() =>
                                              handlePassAdminRights(
                                                person.idUporabnika
                                              )
                                            }
                                          >
                                            Confirm
                                          </Disclosure.Button>
                                        </div>
                                      </Disclosure.Panel>
                                    </Disclosure>
                                    {/* <div className={styles.separator} />
                            <div className={styles.buttonArea}>
                              <button className={styles.btnSolid}>Cancel</button>
                              <button className={styles.btnLight}>Confirm</button>
                            </div> */}
                                  </Popover.Panel>
                                </Float>
                              </Popover>
                            )}
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </>
            )}

            <button
              onClick={handleModalClose}
              className={styles.closeModalButton}
            >
              <FontAwesomeIcon icon={faXmark} fixedWidth />
            </button>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default ViewMembersModal;
