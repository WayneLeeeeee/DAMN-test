import React, { useEffect, useState } from "react";
import ButtonNav from "../../../components/BottomNav";

//mui
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Search } from "semantic-ui-react";
import useSearch from "../../../hooks/useSearch";
import SearchIcon from "@mui/icons-material/Search";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useStateValue } from "../../../StateProvider";
import moment from "moment";
import Checkbox from "@mui/material/Checkbox";
import { actionTypes } from "../../../reducer";
import { differenceBy, union } from "lodash";
import AddTaskIcon from "@mui/icons-material/AddTask";

function ShoppingListPage() {
  const navigate = useNavigate();
  const goToFridgePage = function () {
    navigate("/fridge");
  };
  const user = localStorage.getItem("userUid");
  const [query, setQuery] = useState("");
  const [fridgeResults, setFridgeResults] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const results = useSearch("fridge", query, `${user}`);
  const [ingredient2, setIngredient2] = useState([]);
  const [recordId, setRecordId] = React.useState("");
  const [deleted, setDeleted] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [{ isUpdated, ingredient, checkedList }, dispatch] = useStateValue();
  const [choice, setChoice] = useState([]);
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  function onResultSelect(e, { result }) {
    setSearchParams(query);
    navigate(`/fridge/search/?query=${query}`);
  }

  const handleClose = () => {
    setOpen(false);
    setOpen2(false);
  };

  const handleClickOpen = (id) => {
    setOpen(true);
    setRecordId(id);
  };

  const handleClickOpen2 = (data) => {
    setOpen2(true);
    setSelectedIngredient(data);
  };

  const deleteData = async function (id) {
    try {
      await deleteDoc(doc(db, "users", `${user}`, "shoppingList", id));
      console.log(id);
      setOpen(false);
      setDeleted(deleted + 1);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(recordId);
  console.log(selectedIngredient);

  const handleSwitchUpdate = () => {
    setOpen2(false);
    dispatch({
      type: actionTypes.SET_ISUPDATED,
      isUpdated: true,
    });
    dispatch({
      type: actionTypes.SET_INGREDIENT,
      ingredient: selectedIngredient,
    });
    navigate("/fridge/add2");
  };

  const handlesendtofridge = () => {
    navigate("/fridge/finalsendingredient");
  };

  useEffect(() => {
    async function readData() {
      const querySnapshot = await getDocs(
        collection(db, "users", `${user}`, "shoppingList")
      );
      const temp = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        temp.push({ id: doc.id, ...doc.data(), checked: false });
      });
      console.log(temp);
      setIngredient2([...temp]);
    }

    readData();
  }, [db, deleted]);

  //多選

  const multipleChoose = (item, index) => {
    let oldList = [...ingredient2];
    if (item.checked == false) {
      oldList[index] = { ...oldList[index], checked: true };
      setIngredient2(oldList);
      dispatch({
        type: actionTypes.SET_CHECKEDLIST,
        checkedList: union([...checkedList, oldList[index]]),
      });
    } else {
      oldList[index] = { ...oldList[index], checked: false };
      setIngredient2(oldList);
      dispatch({
        type: actionTypes.SET_CHECKEDLIST,
        checkedList: differenceBy([...checkedList], [oldList[index]], "id"),
      });
    }
    // <CheckFoodList checkedList={checkedList} />;
  };

  console.log(ingredient2);
  console.log("已選上", checkedList);

  return (
    <div>
      <div className="shoppingListPage">
        <div className="shoppingListPage__bar">
          <ArrowBackIosIcon onClick={goToFridgePage} />
          <Search
            value={query}
            onSearchChange={(e) => setQuery(e.target.value)}
            results={fridgeResults}
            noResultsMessage="找不到相關食材"
            onResultSelect={onResultSelect}
          />
          <SearchIcon onClick={onResultSelect} />
        </div>
        {ingredient2?.map((item, index) => (
          <div className="shoppingListPage__item" key={index}>
            <Checkbox {...label} onClick={() => multipleChoose(item, index)} />
            <div className="shoppingListPage__item__img">
              <img src={item.imageURL?.url} alt="" />
            </div>
            <div className="shoppingListPage__item__content">
              <h4>{item.name}</h4>
              <h5>
                數量：
                {item.quantity}
                {item.unit}
              </h5>
              <h5>{item.isFrozen}</h5>
              <h5>
                {item.endDate === null
                  ? null
                  : moment(item.endDate.seconds * 1000).format("YYYY/MM/DD")}
              </h5>
              {/* <h6>
                距離到期日：剩
                {
                  -moment(new Date()).diff(
                    moment(item.endDate.seconds * 1000).format("YYYY/MM/DD"),
                    "days"
                  )
                }
                日
              </h6> */}
            </div>
            <div className="shoppingListPage__item__edit">
              <CloseIcon onClick={() => handleClickOpen(item?.id)} />
              <EditIcon onClick={() => handleClickOpen2(item)} />
            </div>
          </div>
        ))}
        <div
          className="shoppingListPage__item__addtoFridge"
          onClick={handlesendtofridge}
        >
          <AddTaskIcon />
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"確定刪除？"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              一經刪除將無法復原!!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>否</Button>
            <Button onClick={() => deleteData(recordId)} autoFocus>
              是
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={open2}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"確定修改？"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              將跳轉至修改頁面
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>否</Button>
            <Button onClick={() => handleSwitchUpdate(ingredient)} autoFocus>
              是
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <ButtonNav />
    </div>
  );
}

export default ShoppingListPage;
