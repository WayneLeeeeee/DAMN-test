import React from "react";
import { useNavigate } from "react-router-dom";
import FridgeBar from "../../../components/fridge/FoodBar";
import FoodList from "../../../components/fridge/FoodList";

export default function FridgeManagePage() {
 
  return (
    <div>
      <FridgeBar />
      <FoodList />
    </div>
  );
}
