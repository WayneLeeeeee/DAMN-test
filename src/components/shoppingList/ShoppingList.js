import { React, useState, useEffect } from "react";
import { Button } from "@mui/material";
//firebase
import { db } from "../../firebase";
import { getDocs, collection, doc } from "@firebase/firestore";
//foodCard
import ShoppingListCard from "./ShoppingListCard";
//moment
import moment from "moment";
//lodash加入array比較
import { differenceBy, union } from "lodash";
//context API
import CheckFoodList from "../../pages/fridge/shoppingList/CheckFoodListPage";
import { actionTypes } from "../../reducer";
import { useStateValue } from "../../StateProvider";

export default function ShoppingList(props) {
  const [fridge, setFridge] = useState([]);
  const user = localStorage.getItem("userUid");
  const userShoppingListRef = collection(
    db,
    "users",
    `${user}`,
    "shoppingList"
  );
  //read firebase
  useEffect(() => {
    async function readData() {
      const querySnapshot = await getDocs(userShoppingListRef);
      const temp = [];
      querySnapshot.forEach((doc) => {
        temp.push({
          name: doc.data().name,
          quantity: doc.data().quantity,
          unit: doc.data().unit,
          imageURL: doc.data().imageURL,
          notes: doc.data().notes,
          id: doc.id,
          checked: false,
        });
      });
      setFridge([...temp]);
    }
    readData();
  }, [db]);

  //點選
  const [{ checkedList }, dispatch] = useStateValue();
  const handleCheck = function (item, index) {
    let oldList = [...fridge];
    if (item.checked == false) {
      oldList[index] = { ...oldList[index], checked: true };
      setFridge(oldList);
      dispatch({
        type: actionTypes.SET_CHECKEDLIST,
        checkedList: union([...checkedList, oldList[index]]),
      });
    } else {
      oldList[index] = { ...oldList[index], checked: false };
      setFridge(oldList);
      dispatch({
        type: actionTypes.SET_CHECKEDLIST,
        checkedList: differenceBy([...checkedList], [oldList[index]], "id"),
      });
    }
    <CheckFoodList checkedList={checkedList} />;
  };

  return (
    <div>
      {fridge.map((item, index) => (
        <ShoppingListCard
          key={index}
          item={item}
          disabled={props.isButtonDisable}
          onClick={() => handleCheck(item, index)}
        />
      ))}
    </div>
  );
}
