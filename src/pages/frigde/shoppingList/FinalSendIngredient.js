import React, { useState } from "react";
import { useStateValue } from "../../../StateProvider";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import { InputAdornment, OutlinedInput } from "@material-ui/core";
import moment from "moment";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";
import { actionTypes } from "../../../reducer";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../firebase";

function FinalSendIngredient() {
  const [{ isUpdated, ingredient, checkedList }, dispatch] = useStateValue();
  const [value, setValue] = React.useState(null);

  const navigate = useNavigate();
  const goToFridgePage = function () {
    navigate("/fridge/shoppingListPage");
    dispatch({
      type: actionTypes.SET_CHECKEDLIST,
      checkedList: [],
    });
  };

  const user = localStorage.getItem("userUid");

  const handleChangeQuantity = (e) => {
    let oldList = [...checkedList];
    for (let i = 0; i < checkedList.length; i++) {
      oldList[i] = {
        ...oldList[i],
        [e.target.name]: e.target.value,
      };
    }
    dispatch({
      type: actionTypes.SET_CHECKEDLIST,
      checkedList: [...oldList],
    });
  };

  const handleChangeDate = (value) => {
    let oldList = [...checkedList];
    for (let i = 0; i < checkedList.length; i++) {
      oldList[i] = {
        ...oldList[i],
        endDate: value,
      };
    }
    dispatch({
      type: actionTypes.SET_CHECKEDLIST,
      checkedList: [...oldList],
    });
  };

  async function addDatatoF() {
    for (var i = 0; i < checkedList.length; i++) {
      const docRef = await addDoc(
        collection(db, "users", `${user}`, "fridge"),
        {
          name: checkedList[i].name,
          quantity: checkedList[i].quantity,
          unit: checkedList[i].unit,
          notes: checkedList[i].notes,
          endDate: checkedList[i].endDate,
          isFrozen: checkedList[i].isFrozen,
          imageURL: checkedList[i].imageURL,
        }
      );
    }

    dispatch({
      type: actionTypes.SET_CHECKEDLIST,
      checkedList: [],
    });

    //delete
    const deleteData = async function (id) {
      await deleteDoc(doc(db, "users", `${user}`, "shoppingList", id));
    };
    {
      checkedList.map((id, index) => deleteData(checkedList[index].id));
    }
    navigate("/fridge");
  }

  console.log(checkedList);

  return (
    <div className="FinalSendIngredient">
      <div className="FinalSendIngredient__bar">
        <ArrowBackIosIcon onClick={goToFridgePage} />
        <h4 onClick={addDatatoF}>加至冰箱</h4>
      </div>
      {checkedList?.map((item, index) => (
        <div className="FinalSendIngredient__card" key={index}>
          <h4>{item.name}</h4>
          <div className="FinalSendIngredient__selector">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="有效期限"
                value={item.endDate}
                onChange={(newValue) => {
                  setValue(newValue);
                  let oldList = [...checkedList];
                  oldList[index] = {
                    ...oldList[index],
                    endDate: newValue,
                  };
                  dispatch({
                    type: actionTypes.SET_CHECKEDLIST,
                    checkedList: [...oldList],
                  });
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </div>
          <div className="FinalSendIngredient__input">
            <OutlinedInput
              sx={{
                width: 300,
                marginTop: "20px",
                paddingBottom: "20px!important",
              }}
              name="quantity"
              type="number"
              id="outlined-adornment-amount"
              defaultValue={item.quantity}
              onChange={handleChangeQuantity}
              label="數量"
              endAdornment={
                <InputAdornment position="start">{item.unit}</InputAdornment>
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default FinalSendIngredient;
