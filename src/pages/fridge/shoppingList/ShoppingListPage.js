import React from "react";
import ShoppingList from "../../../components/shoppingList/ShoppingList";
import ShoppingListBar from "../../../components/shoppingList/ShoppingListBar";
import { Fab } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import ButtonNav from "../../../components/BottomNav"

export default function ShoppingListPage() {
  const navigate = useNavigate();
  const goToCheckfoodListPage = function () {
    navigate("/fridge/checkfoodlist");
  };

  return (
    <div>
      <ShoppingListBar />
      <AddCircleIcon
        onClick={goToCheckfoodListPage}
        sx={{
          position: "fixed",
          bottom: "100px",
          right: "40px",
          fontSize: "72px",
          color: "rgb(226, 195, 154)",
        }}
      />
      <ShoppingList isButtonDisable={true} />
      <ButtonNav/>
    </div>
  );
}
