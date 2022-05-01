import React, { useState } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import googleIcon from "../../src/images/googleIcon.png";
import { ArrowBack } from "@material-ui/icons";
import { ArrowBackIos } from "@material-ui/icons";
import { useNavigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import { Link } from "react-router-dom";

import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { actionTypes } from '../reducer';
import { useStateValue } from '../StateProvider';
import { Alert } from "@mui/material";


const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const goToLoginPage =  () => {
    navigate("LoginPage");
  } 
  const [account, setAccount] = useState({
    email: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = function (e) {
    setAccount({ ...account, [e.target.name]: e.target.value });
  };

  const[state,dispatch]=useStateValue();

  const handleSubmit = async function () {

    try {
      const res = await sendPasswordResetEmail(
        auth,
        account.email,
      );

      if (res) {
        dispatch({
          type:actionTypes.SET_USER,
          user:auth.currentUser,
      })
        console.log(auth.currentUser.displayName);
      }



      setMessage("");
      setMessage("請到信箱確認重設密碼信件")
    } catch (error) {
      setMessage("你並沒有使用這個Mail註冊喔!!!請再次確認");
    }
  };


  return (
    <div className="login-signup-Page">
      <Button href="/" sx={{
        color: "black"
      }} >
        <ArrowBackIos/>
      </Button>
      <Grid className="box">
        <Card className="inputTextbox">
          
          <input
            name="email"
            onChange={handleChange}
            value={account.email}
            type="email"
            placeholder="Email"
          ></input>
          <br />
          {message}
          <br />
        </Card>

        <Card className="login-sugnup-Button">
          <Button fullWidth onClick={handleSubmit}>
            送出
          </Button>

        </Card>

      </Grid>
    </div>
  );
};

export default ForgotPasswordPage;

