import { React, useState, useEffect } from "react";
import { Button, Card, Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import CreateIcon from "@mui/icons-material/Create";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { useStateValue } from "../../StateProvider";
import { actionTypes } from "../../reducer";

import moment from "moment";
import { useNavigate } from "react-router-dom";

function FoodCard(props) {
  const [isSelected, setIsSelected] = useState(false);
  const [deleted, setDeleted] = useState(0);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [recordId, setRecordId] = useState("");
  const [selectedIngredient, setSelectedIngredient] = useState();
  const [fridge, setFridge] = useState([]);
  const user = localStorage.getItem("userUid");
  const [{ isUpdated }, dispatch] = useStateValue();
  const navigate = useNavigate();

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
      type: actionTypes.SET_INGREDIENT,
      ingredient: selectedIngredient,
    });
    navigate("/fridge/creatshoppinglist");
  };

  //冷藏or冷凍
  function isFrozen(ice) {
    if (ice === true) {
      return "冷凍中";
    } else {
      return "冷藏中";
    }
  }
  const userFoodRef = collection(db, "users", `${user}`, "fridge");
  //read firebase
  useEffect(() => {
    async function readData() {
      const querySnapshot = await getDocs(userFoodRef);
      const temp = [];
      querySnapshot.forEach((doc) => {
        temp.push({
          id: doc.id,
          name: doc.data().name,
          quantity: doc.data().quantity,
          unit: doc.data().unit,
          isFrozen: isFrozen(doc.data().isFrozen),
          imageURL: doc.data().imageURL,
          endDate: moment(doc.data().endDate.seconds * 1000).format(
            "YYYY/MM/DD"
          ),
        });
      });
      console.log(temp);
      setFridge([...temp]);
    }
    readData();
  }, [db, deleted]);

  console.log(selectedIngredient);

  const deleteData = async function (id) {
    await deleteDoc(doc(db, "users", `${user}`, "fridge", id));
    setDeleted(+1);
    console.log("deleted");
    setOpen(false);
  };

  console.log(recordId);

  return (
    <div className="foodCard">
      {fridge.map((food, index) => (
        <div className="box">
          <div className="foodCard__img">
            <img src={food.imageURL} alt="" />
          </div>
          <div className="contextCard">
            <h3 style={{ color: "brown" }}>{food.name}</h3>
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
              {food.quantity}
              {food.unit}
            </h4>
            <h4 style={{ color: "lightblue" }}>{food.isFrozen}</h4>
            <h4>{food.endDate}</h4>
            <h4>
              還有{-moment(new Date()).diff(food.endDate, "days") + 1}天到期
            </h4>
          </div>
          <div className="delete-edit-card">
            <CloseIcon onClick={() => handleClickOpen(food.id)} />
            <CreateIcon onClick={() => handleClickOpen2(food)} />
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
export default FoodCard;
