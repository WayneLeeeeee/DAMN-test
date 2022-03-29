import { React, useState, useEffect } from "react";
import { Button, Card, Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import CreateIcon from "@mui/icons-material/Create";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { useStateValue } from "../../StateProvider";
import { actionTypes } from "../../reducer";

import moment from "moment";
import { fontSize } from "@mui/system";

function FoodCard(props) {
  const [isSelected, setIsSelected] = useState(false);
  const [deleted, setDeleted] = useState(0);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [recordId, setRecordId, setRecordId2] = useState("");
  const [selectedFridge, setSelectedFridge] = useState(null);

  const userid = localStorage.getItem("userUid");

  console.log(recordId);

  return (
    <div className="foodCard">
      <div className="box">
        <div className="foodCard__img">
          <img src={props.food.imageURL} alt="" />
        </div>
        <div className="contextCard">
          <h3 style={{ color: "brown" }}>{props.food.name}</h3>
          <h4
            style={{
              position: "absolute",
              top: "0px",
              left: "0px",
              background: "green",
              padding: "5px",
              borderRadius: "20px",
              fontSize: "20px",
              color: "white",
              textShadow: "1px 1px gray",
            }}
          >
            {props.food.quantity}
            {props.food.unit}
          </h4>
          <h4 style={{ color: "lightblue" }}>{props.food.isFrozen}</h4>
          <h4>{props.food.endDate}</h4>
          <h4>{moment(props.food.endDate, "YYYYMMDD").fromNow()}</h4>
        </div>
        <div className="delete-edit-card">
          <CloseIcon />
          <CreateIcon />
        </div>
      </div>
    </div>
  );
}
export default FoodCard;
