import React, {useRef} from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import classes from './ProfileForm.module.css';

const API_KEY = "AIzaSyBCkvsi5fSWBqs7cVg7aUJEJtVRGvNl0a0";

const ProfileForm = () => {
  const idToken = useSelector(state => state.auth.idToken);
  const pswd = useRef();
  const history = useHistory();

  const submitHanler = (event) => {
    event.preventDefault();
    const pwd = pswd.current.value;
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${API_KEY}`;
    const sendRequest = async() => {
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          idToken: idToken,
          password: pwd,
          returnSecureToken: false
        }),
        headers: {
          "Content-Type" : "application/json"
        }
      });
      const data = await res.json();
      console.log(data);
      history.replace("/");
    } // sendRequest
    sendRequest();
  }

  return (
    <form className={classes.form} onSubmit={submitHanler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' ref={pswd} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
