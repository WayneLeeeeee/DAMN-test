import React from "react";
import { NavLink } from "react-router-dom";
import { AppBar, Button, ButtonGroup, Toolbar } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
import ShoppingList from "../../shoppingList/ShoppingList";

export default function CheckFoodListBar(props) {
  const navigate = useNavigate();
  const goToShoppingList = function () {
    navigate("/fridge/shoppinglist");
  };
  const goToSendCheckedList = function () {
    navigate("/fridge/sendfoodlist");
  };

  return (
    <div className="fridgeBar">
      <div className="top__bar" position="sticky" sx={{ boxShadow: "none" }}>
        <div className="LeftButton">
          <ArrowBackIosNewIcon onClick={goToShoppingList} />
        </div>
        <h4 style={{ fontSize: "28px" }}> 點選放入冰箱</h4>
        <div className="RightButton">
          <Button onClick={goToSendCheckedList} sx={{ color: "#444545" }}>
            下一步
          </Button>
        </div>
      </div>
    </div>
  );
}
