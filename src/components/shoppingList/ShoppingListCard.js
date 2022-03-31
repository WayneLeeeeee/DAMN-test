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

import { collection, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { useStateValue } from "../../StateProvider";
import { actionTypes } from "../../reducer";
import { update } from "lodash";
import { useNavigate } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import ShoppingList from "./ShoppingList";

export default function ShoppingListCard(props) {
  const [isSelected, setIsSelected] = useState(false);
  const [deleted, setDeleted] = useState(0);
  const [open, setOpen] = useState(false);
  const [recordId, setRecordId] = useState("");
  const [selectedFridge, setSelectedFridge] = useState(null);
  const navigate = useNavigate();

  // console.log(recordId);

  const handleClickOpen = (id) => {
    setOpen(true);
    setRecordId(id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //刪除功能
  const deleteData = async function (id) {
    try {
      await deleteDoc(
        doc(db, "users", "3HuEsCE9jUlCm68eBQf4", "shoppingList", id)
      );
      setOpen(false);
      setDeleted(deleted + 1);
      //   console.log();
    } catch (error) {
      //   console.log(error);
    }
  };
  console.log(recordId);

  const user = localStorage.getItem("userUid");
  // const [checked, setChecked] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  //   console.log(user);

  useEffect(() => {
    async function readData() {
      const querySnapshot = await getDocs(
        collection(db, "users", `${user}`, "shoppingList")
      );
      const temp = [];
      querySnapshot.forEach((doc) => {
        temp.push(doc.data());
        console.log(doc.id, "=>", doc.data());
      });
      console.log(temp);
      setShoppingList([...temp]);
    }
    readData();
  }, [db]);

  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  return (
    <div className="foodCard">
      <div className="box" sx={{ width: "80%" }}>
        <div className="foodCard__img">
          <img src={props.item.imageURL} alt="" />
        </div>
        <div className="contextCard">
          <h3 style={{ color: "brown" }}>{props.item.name}</h3>
          <h4
            style={{
              position: "absolute",
              top: "0px",
              left: "0px",
              background: "#ffff99",
              padding: "5px",
              borderRadius: "20px",
              fontSize: "20px",
              color: "#444545",
              textShadow: "1px 1px gray",
            }}
          >
            {props.item.quantity}
            {props.item.unit}
          </h4>
        </div>
        <div className="delete-edit-card">
          <CloseIcon />
          <CreateIcon />
        </div>
      </div>
    </div>
  );
}
