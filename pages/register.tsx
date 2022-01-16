import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useContext, useEffect } from "react";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";

import AuthService from "../services/auth-service";
import Handlers from "../utils/handlers";
import Helpers from "../utils/helpers";
import { UserContext } from "../contexts/user-context";
import type { RegisterFormDataInterface as FormData } from "../interfaces/auth-interfaces";

import styles from "../styles/pages/auth.module.scss";
import NotFound from "../components/not-found";

const formDataInitialState: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: ""
};

const Register: NextPage = () => {
  const router = useRouter();
  const { token: [, setToken], user: [user] } = useContext(UserContext);

  const [formData, setFormData] = useState<FormData>(formDataInitialState);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  useEffect(() => setPasswordStrength(Helpers.checkPasswordStrength(formData.password)), [formData.password]);

  const handleFormValidity = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) return true;
    else if (!Helpers.checkEmailValidity(formData.email)) return true;
    else if (passwordStrength === "Weak") return true;
    return false;
  }

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const { data } = await AuthService.register(formData);
      setToken(data.accessToken);
      localStorage.setItem("authenticated", "true");
      router.push("/");
    } catch (error: any) {
      return alert(error.response.data.message);
    }
  }

  if (user._id) return <NotFound condition={!user._id} />

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <h1>Create an account</h1>
          <p>Let&apos;s get you all set up so you can verify your personal account and begin setting up your profile.</p>
        
          <form className={styles.form} onSubmit={handleFormSubmit} noValidate>
            <div className={styles.field}>
              <input type="text" id="firstName" name="firstName" autoComplete="off" placeholder=" "
                value={formData.firstName} onChange={event => Handlers.handleFormDataChange(event, setFormData)} />
              <label htmlFor="firstName">First name</label>
            </div>

            <div className={styles.field}>
              <input type="text" id="lastName" name="lastName" autoComplete="off" placeholder=" "
                value={formData.lastName} onChange={event => Handlers.handleFormDataChange(event, setFormData)} />
              <label htmlFor="lastName">Last name</label>
            </div>

            <div className={styles.field}>
              <input type="email" id="email" name="email" autoComplete="email" placeholder=" "
                value={formData.email} onChange={event => Handlers.handleFormDataChange(event, setFormData)} />
              <label htmlFor="email">Email</label>

              <div className={`${styles.validity}
                ${formData.email ? (Helpers.checkEmailValidity(formData.email) ? styles.true : styles.false) : ""}`} />
            </div>

            <div className={styles.field}>
              <input type={isPasswordVisible ? "text" : "password"} id="password" name="password" autoComplete="new-password" placeholder=" "
                value={formData.password} onChange={event => Handlers.handleFormDataChange(event, setFormData)} />
              <label htmlFor="password">Password {formData.password && <span className={`${formData.password ? passwordStrength === "Weak" ? styles.weak : passwordStrength === "Medium" ? styles.medium : styles.strong : ""}`}>({passwordStrength})</span>}</label>

              <div className={`${styles.validity}
                ${formData.password ? passwordStrength === "Weak" ? styles.weak : passwordStrength === "Medium" ? styles.medium : styles.strong : ""}`} />
              <div className={styles.show_button} onClick={() => setIsPasswordVisible(!isPasswordVisible)}>{isPasswordVisible ? <RiEyeOffFill /> : <RiEyeFill />}</div>
            </div>

            <button type="submit" disabled={handleFormValidity()}>Sign up</button>
          </form>

          <h3>Already have an account? <Link href="/login">Sign in</Link></h3>
          <h3>Go back <Link href="/">Home</Link></h3>
          <h4>By creating an account you agree to the <Link href="/">Terms and Conditions</Link> and <Link href="/">Privacy Policy</Link></h4>
        </div>
      </div>
    </div>
  );
}

export default Register;