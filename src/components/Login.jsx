import React, { useState } from "react";
import { signUpFormValidation } from "../utils/validation";
import GoogleLogo from "../assets/images/google.png";
import { Link } from "react-router-dom";
import { showMessage } from "../utils/showMessage";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";
import {
  auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "../services/config";

const Login = () => {
  const navigate = useNavigate();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loader, setLoader] = useState(false);
  const [googleBtnLoader, setGoogleBtnLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('')

  const handleLogin = async () => {
    const data = { email, password };
    const fields = ["email", "password"];
    const valid = signUpFormValidation(data, fields)

    if (valid.isValid === true) {
      await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          if (user) {
            showMessage("Login successful", false);
            localStorage.setItem("userEmail", user.email);
            localStorage.setItem("userToken", user.uid);
            navigate("/dashboard");
          }
        })
        .catch((error) => {
          showMessage("Invalid Email & Password", true);
        })
        .finally(()=>{
          setLoader(false);
          setpassword("");
          setemail("");
        })
    }else {
      setLoader(false);
      setErrors(valid.error);
    }
  };

  const loginWithGoogle = async (e) => {
    e.preventDefault();
    setGoogleBtnLoader(true);
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        setGoogleBtnLoader(false);
        if (user) {
          showMessage("Login successful", false);
          localStorage.setItem("userEmail", user.email);
          localStorage.setItem("userToken", user.uid);
          localStorage.setItem("token", token);
          navigate("/dashboard");
        }
      })
      .catch((error) => {
        setGoogleBtnLoader(false);
        showMessage("Invalid Email & Password", true);
      });
  };

  const handleResetEmail = (resetEmail) => {
    sendPasswordResetEmail(auth, resetEmail)
    .then((a) => {
      showMessage("Password reset email sent", false)
      setResetEmail("")
    })
    .catch((error)=>{
      showMessage("User not exist", true)
      setResetEmail("")
    })
  };

  return (
    <>
      <div className="signup_container">
        <h2 className="signup_title">Welcome back!</h2>
        <p className="signup_heading">Log in to access your account.</p>
        <form className="signup_form">
          <input
            id="email"
            value={email}
            onChange={(e) => {
              setemail(e.target.value);
            }}
            onFocus={() => {
              setErrors({ ...errors, email: "" });
            }}
            placeholder="Email"
          />
          <label className="field_error" id="emaillbl">
            {errors.email}{" "}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setpassword(e.target.value);
            }}
            onFocus={() => {
              setErrors({ ...errors, password: "" });
            }}
            placeholder="Password"
          />
          <label className="field_error" id="passwordlbl">
            {errors.password}
          </label>
          <div
            className="forgot"
            onClick={() => {
              setOpen(true);
            }}
          >
            <p>Forgot Password?</p>
          </div>

          <button
            id="submit"
            onClick={(e) => {
              e.preventDefault();
              setLoader(true);
              handleLogin();
            }}
            className="button"
          >
            {loader === true && <div className="loader"></div>}
            Login
          </button>
        </form>

        <div className="divider">
          <p>Login using</p>
        </div>
        <div
          className="google"
          onClick={(e) => {
            loginWithGoogle(e);
          }}
        >
          {googleBtnLoader === true && <div className="loader"></div>}
          <img src={GoogleLogo} alt="google_logo" />
        </div>
        <p className="login_link">
          Not a member? <Link to={"/signup"}>Signup Here</Link>
        </p>
      </div>
      <Modal
        centered
        title="Reset Password"
        open={open}
        onOk={()=>{
          if(resetEmail === ""){
            setErrors({...errors,resetEmail: "Field Required."})
          }else{
            setOpen(false)
            handleResetEmail(resetEmail);
          }
        }}
        onCancel={()=>{
          setResetEmail("")
          setOpen(false)
        }}
      >
        <div>
        <input type="text" placeholder="Enter Email" onFocus={()=>{setErrors({...errors,resetEmail:""})}} value={resetEmail} onChange={(e)=>{setResetEmail(e.target.value)}} style={{width:"100%"}} />
        <label className="field_error" id="passwordlbl">
            {errors.resetEmail}
          </label>
        </div>
      </Modal>
    </>
  );
};

export default Login;
