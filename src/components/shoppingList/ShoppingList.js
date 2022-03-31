import { React, useState, useEffect } from "react";
//firebase
import { db } from "../../firebase";
import { getDocs, collection, doc, deleteDoc } from "@firebase/firestore";
//context API
import CheckFoodList from "../../pages/fridge/shoppingList/CheckFoodListPage";
import { actionTypes } from "../../reducer";
import { useStateValue } from "../../StateProvider";
import Checkbox from "@mui/material/Checkbox";
import CloseIcon from "@mui/icons-material/Close";
import CreateIcon from "@mui/icons-material/Create";
import { differenceBy, union } from "lodash";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Button } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

export default function ShoppingList() {
  const [shoppingList, setShoppingList] = useState([]);
  const user = localStorage.getItem("userUid");

  const [{ ingredient, checkedList, isUpdated }, dispatch] = useStateValue();
  const userShoppingListRef = collection(
    db,
    "users",
    `${user}`,
    "shoppingList"
  );
  const [deleted, setDeleted] = useState(0);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [recordId, setRecordId] = useState("");
  const navigate = useNavigate();
  const [selectedIngredient, setSelectedIngredient] = useState();

  const handleClickOpen = (id) => {
    setOpen(true);
    setRecordId(id);
  };

  const handleClickOpen2 = (data) => {
    setOpen2(true);
    setSelectedIngredient(data);
  };

  const handleClose = () => {
    setOpen(false);
    setOpen2(false);
  };

  const handleSwitchUpdate = () => {
    setOpen2(false);
    dispatch({
      type: actionTypes.SET_ISUPDATED,
      isUpdated: true,
    });
    dispatch({
      type: actionTypes.SET_ISUPDATED2,
      isUpdated2: true,
    });
    dispatch({
      type: actionTypes.SET_INGREDIENT,
      ingredient: selectedIngredient,
    });
    navigate("/fridge/creatshoppinglist");
  };

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
          isFrozen: doc.data().isFrozen,
          endDate: moment(doc.data().endDate.seconds * 1000).format(
            "YYYY/MM/DD"
          ),
          id: doc.id,
          checked: false,
        });
      });
      setShoppingList([...temp]);
    }
    readData();
  }, [db, deleted]);

  const deleteData = async function (id) {
    await deleteDoc(doc(db, "users", `${user}`, "shoppingList", id));
    setDeleted(+1);
    console.log("deleted");
    setOpen(false);
  };

  console.log(recordId);

  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  const handleCheck = function (item, index) {
    let oldList = [...shoppingList];
    if (item.checked == false) {
      oldList[index] = { ...oldList[index], checked: true };
      setShoppingList(oldList);
      dispatch({
        type: actionTypes.SET_CHECKEDLIST,
        checkedList: union([...checkedList, oldList[index]]),
      });
    } else {
      oldList[index] = { ...oldList[index], checked: false };
      setShoppingList(oldList);
      dispatch({
        type: actionTypes.SET_CHECKEDLIST,
        checkedList: differenceBy([...checkedList], [oldList[index]], "id"),
      });
    }
    <CheckFoodList checkedList={checkedList} />;
  };

  return (
    <div>
      {shoppingList.map((item, index) => (
        <div className="foodCard">
          <div className="box" sx={{ width: "80%" }} key={index}>
            <Checkbox {...label} onClick={() => handleCheck(item, index)} />
            <div className="foodCard__img">
              <img src={item.imageURL} alt="" />
            </div>
            <div className="contextCard">
              <h3 style={{ color: "brown" }}>{item.name}</h3>
              <h4
                style={{
                  position: "absolute",
                  top: "0px",
                  left: "0px",
                  background: "#ffff99",
                  padding: "5px",
                  borderRadius: "20px",
                  fontSize: "20px",
                  color: "#444545",
                  textShadow: "1px 1px gray",
                }}
              >
                {item.quantity}
                {item.unit}
              </h4>
            </div>
            <div className="delete-edit-card">
              <CloseIcon onClick={() => handleClickOpen(item.id)} />
              <CreateIcon onClick={() => handleClickOpen2(item)} />
            </div>
          </div>
        </div>
      ))}
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
          <Button onClick={handleSwitchUpdate} autoFocus>
            是
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
