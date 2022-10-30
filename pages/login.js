import ContainerLayout from "../components/ContainerLayout";
import BigLogoLayout from "../components/BigLogoLayout";
import styles from "../styles/SigniInUp.module.scss";
import { useForm } from "react-hook-form";
import { object, string, number, date, InferType } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import axios from "axios";
import qs from "qs";
import { useRouter } from "next/router";
import { requireAuthentication } from "../hoc/requireAuthentication";

const Login = () => {
  const router = useRouter();

  const schema = object({
    email: string()
      .email("Email must be a valid email")
      .required("Email is required"),
    password: string().required("Password is required"),
  });

  const onSubmit = (data) => {
    loginFunction(data);
  };

  const loginFunction = async (data) => {
    const newData = qs.stringify({
      email: data.email,
      geslo: data.password,
    });
    console.log(newData);

    // try {
    //   const res = await fetch("/api/auth/login", {
    //     method: "post",
    //     body: JSON.stringify({
    //       email: data.email,
    //       geslo: data.password,
    //     }),
    //   });
    //   const data = await res.json();
    //   console.log("to je to iz fetcha", data);
    // } catch (error) {
    //   console.log(error);
    // }

    try {
      // const res = await axios.post('http://89.142.196.64:3000/api/prijava', newData);
      const res = await axios.post("/api/auth/login", newData);
      console.log("to je to", res.data);
      router.push(`/user/${res.data.idUporabnika}`);
    } catch (error) {
      console.log(error.response.data);
      if (error.response.data?.sporočilo === "Napačno uporabniško ime.") {
        setError("email", {
          type: "focus",
          message: "Email doesn't exist",
        });
      } else if (error.response.data?.sporočilo === "Napačno geslo.") {
        setError("password", {
          type: "focus",
          message: "Incorrect password",
        });
      }
      // alert("Wrong email or password");
    }
  };

  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
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
      <h1 className={styles.heading}>Login to your account</h1>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
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
        <button className={styles.btnSolid} type="submit">
          Login
        </button>
      </form>
      <p className={styles.member}>
        Not a member yet?{" "}
        <span>
          <Link href="/register">Register now</Link>
        </span>
      </p>
    </>
  );
};

export default Login;

Login.getLayout = function getLayout(page) {
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
