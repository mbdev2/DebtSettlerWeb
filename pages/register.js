import { requireAuthentication } from "../hoc/requireAuthentication";
import ContainerLayout from "../components/ContainerLayout";
import BigLogoLayout from "../components/BigLogoLayout";
import styles from "../styles/SigniInUp.module.scss";
import { useForm } from "react-hook-form";
import { object, string, ref, number, date, InferType } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import axios from "axios";
import qs from "qs";
import { useRouter } from "next/router";

const Register = () => {
  const router = useRouter();

  const schema = object({
    name: string().required("Name is required"),
    email: string()
      .email("Email must be a valid email")
      .required("Email is required"),
    password: string().required("Password is required"),
    cpassword: string()
      .oneOf([ref("password")], "Passwords do not match")
      .required("Confirm the password"),
  });

  const onSubmit = (data) => {
    //alert(JSON.stringify(data));
    console.log(data);
    registerUser(data);
  };

  const registerUser = async (data) => {
    const newData = qs.stringify({
      ime: data.name,
      email: data.email,
      barvaUporabnika: "333444",
      geslo: data.password,
    });
    console.log(newData);

    try {
      //const res = await axios.post('http://89.142.196.64:3000/api/registracija', newData);
      const res = await axios.post("/api/auth/register", newData);
      console.log("to je to", res.data);
      router.push(`/user/${res.data.idUporabnika}`);
    } catch (error) {
      console.log(error.response?.data);
      if (error.response.data?.sporočilo === "Uporabnik s tem elektronskim naslovom je že registriran") {
        setError("email", {
          type: "focus",
          message: "Email is alreday registered",
        });
      }
    }
  };

  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const [passwordConfitmarionShown, setPasswordConfirmationShown] =
    useState(false);
  const togglePasswordConfirmationVisiblity = () => {
    setPasswordConfirmationShown(passwordConfitmarionShown ? false : true);
  };

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <>
      <h1 className={`${styles.heading} ${styles.reg}`}>
        Sign up to DebtSettler
      </h1>
      <p className={`${styles.member} ${styles.reg}`}>
        Already a member?{" "}
        <span>
          <Link href="/login">Login</Link>
        </span>
      </p>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input type="text" placeholder="Name" {...register("name")} />
          {errors.name && <p>{errors.name.message}</p>}
        </div>
        <div>
          <input type="email" placeholder="Email" {...register("email")} />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div className={styles.password}>
          <input
            type={passwordShown ? "text" : "password"}
            placeholder="Password"
            {...register("password")}
          />
          {errors.password && <p>{errors.password.message}</p>}
          <FontAwesomeIcon
            className={styles.icon}
            icon={passwordShown ? faEyeSlash : faEye}
            onClick={() => togglePasswordVisiblity()}
          />
        </div>
        <div className={styles.password}>
          <input
            type={passwordConfitmarionShown ? "text" : "password"}
            placeholder="Confirm Password"
            {...register("cpassword")}
          />
          {errors.cpassword && <p>{errors.cpassword.message}</p>}
          <FontAwesomeIcon
            className={styles.icon}
            icon={passwordConfitmarionShown ? faEyeSlash : faEye}
            onClick={() => togglePasswordConfirmationVisiblity()}
          />
        </div>
        <button className={styles.btnSolid} type="submit">
          Sign up
        </button>
      </form>
    </>
  );
};

export default Register;

Register.getLayout = function getLayout(page) {
  return (
    <ContainerLayout>
      <BigLogoLayout page="login">{page}</BigLogoLayout>
    </ContainerLayout>
  );
};

export const getServerSideProps = requireAuthentication(async (context) => {
  return {
    props: {},
  };
});
