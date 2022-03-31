import React from "react";
import ShoppingList from "../../../components/shoppingList/ShoppingList";
import ShoppingListBar from "../../../components/shoppingList/ShoppingListBar";
import { Fab } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import ButtonNav from "../../../components/BottomNav";
import { useStateValue } from "../../../StateProvider";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase";

export default function ShoppingListPage() {
  const navigate = useNavigate();
  const user = localStorage.getItem("userUid");
  const goToSendfoodListPage = function () {
    navigate("/fridge/sendfoodlist");
  };

  const [{ checkedList }] = useStateValue();

  async function addData() {
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
    //delete
    const deleteData = async function (id) {
      await deleteDoc(doc(db, "users", `${user}`, "shoppingList", id));
    };
    {
      checkedList.map((id, index) => deleteData(checkedList[index].id));
    }
    navigate("/fridge/fridgemanage");
  }

  return (
    <div>
      <ShoppingListBar />
      <div
        className="div"
        style={{
          position: "fixed",
          bottom: "100px",
          right: "40px",
          color: "#C7E3EE",
        }}
      >
        <h4>移至冰箱</h4>
        <AddCircleIcon
          onClick={addData}
          sx={{
            fontSize: "72px !important",
          }}
        />
      </div>
      <ShoppingList isButtonDisable={true} />
      <ButtonNav />
    </div>
  );
}
