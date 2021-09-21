import { useState, useRef } from 'react';
import {useDispatch} from "react-redux";
import { useHistory } from 'react-router';
import {authActions} from "../../store/authReducer";
import classes from './AuthForm.module.css';

const API_KEY = "AIzaSyBCkvsi5fSWBqs7cVg7aUJEJtVRGvNl0a0";

const AuthForm = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const emailRef = useRef();
  const passwordRef = useRef();

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    let url;
    setIsLoading(true);

    if (isLogin) {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
    } else {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
    }
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        returnSecuredToken: true
      }),
      Headers: {
        "Content-Type": "application/json"
      }
    }).then(res => {
      if (res.ok) {
        return res.json();
      } else {
        return res.json().then(data =>{
          let message = "Authentication Failed.";
          /*if (data && data.error && data.error.message)
            message = data.error.message; */
          throw new Error(message);
        });
      }
    }).then(data => {
      const expIn = new Date(new Date().getTime() + (+data.expiresIn * 1000));
      dispatch(authActions.login({
        isLoggedIn: true,
        localId: data.localId,
        idToken: data.idToken,
        refreshToken: data.refreshToken,
        kind: data.kind,
        expiresIn: expIn.toISOString()
      }));
      history.replace("/");

    }).catch(err => {
      alert(err.message);
    });
    setIsLoading(false);
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' ref={emailRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' ref={passwordRef} required />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <p>Sending request.</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
