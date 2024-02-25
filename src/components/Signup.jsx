import React, { useState, useEffect } from "react";
import { signUpFormValidation } from "../utils/validation";
import GoogleLogo from "../assets/images/google.png";
import { Link } from "react-router-dom";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
} from "../services/config";
import { showMessage } from "../utils/showMessage";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState();
  const [loader, setLoader] = useState(false);
  const [googleBtnLoader, setGoogleBtnLoader] = useState(false);

  const fieldEmpty = () => {
    setname("");
    setpassword("");
    setemail("");
    setTerms(false);
  };

  const Signup = async () => {
    const data = { name, email, password, terms };
    const fields = ["name", "email", "password", "terms"];
    let valid = signUpFormValidation(data, fields);

    if (valid.isValid === true) {
      await createUserWithEmailAndPassword(auth, email, password, name)
        .then((userCredential) => {
          const user = userCredential.user;
          if (user) {
            showMessage("Signup successfully.", false);
            navigate("/");
          }
        })
        .catch((error) => {
          const errorCode = error.code;
          if (errorCode === "auth/email-already-in-use") {
            showMessage("Email already exist", true);
          } else {
            showMessage("Something went wrong try again later!", true);
          }
        })
        .finally(() => {
          setLoader(false);
          fieldEmpty()
        })
    } else {
      setLoader(false);
      setErrors(valid.error);
    }
  };

  const loginWithGoogle = async (e) => {
    e.preventDefault();
    setGoogleBtnLoader(true);
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        setGoogleBtnLoader(false);
        if (user) {
          showMessage("Signup successfully.", false);
          navigate("/");
        }
      })
      .catch((error) => {
        setGoogleBtnLoader(false);
        showMessage("Signup Failed", true);
      });
  };

  return (
    <div className="signup_container">
      <h2 className="signup_title">Join us today!</h2>
      <p className="signup_heading">Sign up now to become a member.</p>
      <form className="signup_form">
        <input
          id="name"
          value={name}
          onFocus={() => {
            setErrors({ ...errors, name: "" });
          }}
          onChange={(e) => {
            setname(e.target.value);
          }}
          placeholder="Name"
        />
        <p className="field_error" id="namelbl">
          {errors?.name}
        </p>
        <input
          id="email"
          value={email}
          onFocus={() => {
            setErrors({ ...errors, email: "" });
          }}
          onChange={(e) => {
            setemail(e.target.value);
          }}
          placeholder="Email"
        />
        <p className="field_error" id="emaillbl">
          {errors?.email}{" "}
        </p>
        <input
          id="password"
          type="password"
          value={password}
          onFocus={() => {
            setErrors({ ...errors, password: "" });
          }}
          onChange={(e) => {
            setpassword(e.target.value);
          }}
          placeholder="Password"
        />
        <p className="field_error" id="passwordlbl">
          {errors?.password}
        </p>
        <div className="term_condition">
          <input
            className="checkbox"
            type="checkbox"
            checked={terms}
            onClick={() => {
              setErrors({ ...errors, terms: "" });
              setTerms(!terms);
            }}
          />
          <p>
            I agree to the <span>Privacy Policy</span> and{" "}
            <span>Terms and Conditions</span>
          </p>
        </div>
        <p className="field_error" id="termslbl">
          {errors?.terms}{" "}
        </p>

        <button
          id="submit"
          onClick={(e) => {
            e.preventDefault();
            setLoader(true);
            Signup();
          }}
          className="button"
        >
          {loader === true && <div className="loader"></div>}
          Create Account
        </button>
      </form>

      <div className="divider">
        <p>Sign up using</p>
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
        Already a member? <Link to={"/"}>Login Here</Link>
      </p>
    </div>
  );
};

export default Signup;
