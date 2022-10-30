// import * as Dialog from "@radix-ui/react-dialog";
import styles from "../styles/ItemsJustBoughtModal.module.scss";
import iconStyles from "../styles/HouseholdLayout.module.scss";
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
} from "@fortawesome/free-solid-svg-icons";
import { useForm, Controller } from "react-hook-form";
import { Listbox } from "@headlessui/react";
import { Dialog } from "@headlessui/react";
import { useState, Fragment } from "react";
import { object, string, ref, number, date, InferType } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useHousholdUsers,
  useUser,
  useHistory,
  useUserHousholdInfo,
} from "../utils/helper";
import { useRouter } from "next/router";
import { BeatLoader, PropagateLoader } from "react-spinners";
import qs from "qs";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const categories = [
  "Debt",
  "Groceries",
  "Restaurants & Cafes",
  "Drinks",
  "Transport",
  "Rent",
  "Enterteinemnt",
  "Activities",
  "Bills",
];
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

const ItemsJustBoughtModal = ({
  itemsJustBoughtModalOpen,
  setItemsJustBoughtModalOpen,
}) => {
  const router = useRouter();
  // console.log(router.query);
  const idGospodinjstva = router.query.householdId;
  const idUporabnika = router.query.userId;
  const { uporabniki, isHousholdUsersLoading, mutateUporabniki } =
    useHousholdUsers(idUporabnika, idGospodinjstva);
  const { nakupi, isNakupiLoading, mutateHistory } = useHistory(
    idUporabnika,
    idGospodinjstva
  );
  const {
    userHouseholdInfo,
    isUserHousheholdInfoLoading,
    mutateUserHouseholdInfo,
  } = useUserHousholdInfo(idUporabnika, idGospodinjstva);

  const [selectedCategory, setSelectedCategory] = useState(categories[1]);
  const schema = object({
    kategorijaNakupa: number().required("Category is required"),
    imeTrgovine: string().required("Shop is required"),
    opisNakupa: string().required("Description is required"),
    znesekNakupa: number()
      .positive("Amount can't be negative")
      .required("Price is required"),
  });
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [selectedPeople, setSelectedPeople] = useState([]);
  const [membersEmpty, setMembersEmpty] = useState(false);

  function isPersonSelected(person) {
    return selectedPeople.some((p) => p.idUporabnika === person.idUporabnika);
  }
  function toggleSelectedPerson(selectedPerson) {
    isPersonSelected(selectedPerson)
      ? setSelectedPeople(
          selectedPeople.filter(
            (item) => item.idUporabnika !== selectedPerson.idUporabnika
          )
        )
      : setSelectedPeople((prev) => [...prev, selectedPerson]);
  }
  function selectAllPeople() {
    setSelectedPeople((prev) =>
      prev.length === uporabniki.length - 1
        ? []
        : uporabniki.filter(
            (uporabnik) => uporabnik.idUporabnika !== idUporabnika
          )
    );
  }

  const handleItemsJustBoughtClose = () => {
    setSelectedCategory(categories[1]);
    setSelectedPeople([]);
    setMembersEmpty(false);
    reset();
    setItemsJustBoughtModalOpen(false);
  };
  const handleItemsJustBoughtSubmit = async (data) => {
    if (selectedPeople.length === 0) {
      setMembersEmpty(true);
    } else {
      const { GStoken } = userHouseholdInfo;
      console.log(GStoken);
      const addedData = {
        ...data,
        tabelaUpVGos: selectedPeople.map((person) => person.upVGosID),
      };
      console.log(addedData);
      const newData = qs.stringify(addedData, { arrayFormat: "comma" });
      console.log(newData);

      try {
        const res = await axios.post("/api/nakupi/dodajNakup", newData, {
          headers: {
            Authorization: "Bearer " + GStoken,
          },
        });
        console.log(res.data);
        mutateUporabniki();
        mutateHistory();
      } catch (error) {
        console.log(error.response.data);
      }

      handleItemsJustBoughtClose();
    }
  };

  return (
    <Dialog
      open={itemsJustBoughtModalOpen}
      onClose={handleItemsJustBoughtClose}
      // as={motion.div}
      // initial={{ opacity: 0 }}
      // animate={{ opacity: 1 }}
      // exit={{ opacity: 0 }}
      // key="itemsJustBoughtModal"
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
            <Dialog.Title className={styles.heading}>
              Items just bought
            </Dialog.Title>
            <form
              className={styles.form}
              onSubmit={handleSubmit(handleItemsJustBoughtSubmit)}
            >
              <div className={styles.inputWrapper}>
                <div className={styles.shopName}>
                  <input
                    type="text"
                    placeholder="Shop"
                    {...register("imeTrgovine")}
                  />
                  {errors.imeTrgovine && <p>{errors.imeTrgovine.message}</p>}
                </div>
                <div className={styles.price}>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Price"
                    {...register("znesekNakupa")}
                  />
                  {errors.znesekNakupa && <p>{errors.znesekNakupa.message}</p>}
                </div>
                <div className={styles.description}>
                  <input
                    type="text"
                    placeholder="Description"
                    {...register("opisNakupa")}
                  />
                  {errors.opisNakupa && <p>{errors.opisNakupa.message}</p>}
                </div>
                <Controller
                  control={control}
                  defaultValue={1}
                  name="kategorijaNakupa"
                  render={({ field: { onChange } }) => (
                    <Listbox
                      value={selectedCategory}
                      onChange={(e) => {
                        onChange(categories.indexOf(e));
                        console.log(categories.indexOf(e));
                        // setSelectedCategory(categories[e]);
                        setSelectedCategory(e);
                      }}
                    >
                      <div className={styles.selectContainer}>
                        <Listbox.Button className={styles.selectButton}>
                          <span>{selectedCategory}</span>
                          <FontAwesomeIcon
                            className={styles.caretIcon}
                            icon={faCaretDown}
                            aria-hidden="true"
                          />
                        </Listbox.Button>
                        <Listbox.Options className={styles.selectOptions}>
                          {categories.slice(1).map((category, index) => (
                            <Listbox.Option
                              className={styles.selectOption}
                              key={category}
                              value={category}
                              // value={index}
                            >
                              {({ selected }) => (
                                <span
                                  className={`${
                                    selected ? styles.selected : ""
                                  }`}
                                >
                                  {category}
                                </span>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </div>
                    </Listbox>
                  )}
                />
              </div>
              <div className={styles.membersSelectAll}>
                <h2 className={styles.selectMembersHeading}>Members</h2>
                <button
                  className={styles.btnLight}
                  type="button"
                  onClick={() => selectAllPeople()}
                >
                  Select all
                </button>
              </div>

              {isHousholdUsersLoading ? (
                <></>
              ) : (
                <div>
                  <ul className={styles.selectMemebersList}>
                    {uporabniki
                      .filter(
                        (uporabnik) =>
                          uporabnik.idUporabnika !== idUporabnika &&
                          uporabnik.deleteStatus === false
                      )
                      .map((person, index) => (
                        <li
                          key={person.idUporabnika}
                          className={` ${styles.selectMemberContainer} ${
                            isPersonSelected(person) ? styles.hola : ""
                          }`}
                          onClick={() => toggleSelectedPerson(person)}
                        >
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
                          <FontAwesomeIcon
                            className={styles.icon}
                            icon={faCircleCheck}
                            size="1x"
                          />
                        </li>
                      ))}
                  </ul>
                  {membersEmpty && <p>Select members</p>}
                </div>
              )}

              <button type="submit" className={styles.btnSolid}>
                Add items
              </button>
            </form>
            <button
              onClick={() => setItemsJustBoughtModalOpen(false)}
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

export default ItemsJustBoughtModal;
