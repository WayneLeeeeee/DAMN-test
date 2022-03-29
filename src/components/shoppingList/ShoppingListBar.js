import React from "react";
import { NavLink } from "react-router-dom";
import { AppBar, Button, ButtonGroup, Toolbar } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Typography from "@mui/material/Typography";
import SortButton from "../fridge/SortButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";

//跳轉頁面

import { useNavigate } from "react-router-dom";

export default function ShoppingListBar() {
  const navigate = useNavigate();
  const goToFridgePage = function () {
    navigate("/fridge");
  };

  return (
    <div className="fridgeBar">
      <div className="top__bar" position="sticky" sx={{ boxShadow: "none" }}>
        <div className="LeftButton">
          <ArrowBackIosNewIcon onClick={goToFridgePage} />
        </div>
        <h4 style={{ fontSize: "28px" }}> 購物清單</h4>
        <div className="RightButton">
          <DeleteIcon style={{ fontSize: "36px" }} />
        </div>
      </div>
    </div>
  );
}
