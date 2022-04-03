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
import { doc, updateDoc } from "firebase/firestore";
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
    for (let i = 0; i < checkedList.length; i++) {
      const { quantity2 } = checkedList[i];
      dispatch({
        type: actionTypes.SET_CHECKEDLIST,
        checkedList: { ...checkedList, quantity2: e.target.value },
      });
      console.log(quantity2);
    }
  };

  return (
    <div className="FinalSendIngredient">
      <div className="FinalSendIngredient__bar">
        <ArrowBackIosIcon onClick={goToFridgePage} />
      </div>
      {checkedList?.map((item, index) => (
        <div className="FinalSendIngredient__card" key={index}>
          <h4>{item.name}</h4>
          <div className="FinalSendIngredient__selector">
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              sx={{ width: 300, marginTop: "20px", paddingBottom: "20px" }}
            >
              <DatePicker
                label="有效日期"
                value={value}
                onChange={(newValue) => {
                  setValue(newValue);
                  dispatch({
                    type: actionTypes.SET_CHECKEDLIST,
                    checkedList: { ...checkedList[index], endDate: newValue },
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
