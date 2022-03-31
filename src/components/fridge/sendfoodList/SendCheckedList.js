import React from "react";
//firebase
import { db, storage } from "../../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
//context
import { useStateValue } from "../../../StateProvider";
//跳轉頁面
import { useNavigate } from "react-router-dom";
//delete
import { doc, deleteDoc } from "firebase/firestore";

import { Button } from "@mui/material";

export default function SendCheckedList() {
  const navigate = useNavigate();
  //add to firebase
  const [{ checkedList }] = useStateValue();
  const user = localStorage.getItem("userUid");

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

  console.log(checkedList);

  return (
    <div>
      <Button
        sx={{
          color: "#FFFFFF",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        onClick={addData}
      >
        送出
      </Button>
    </div>
  );
}
