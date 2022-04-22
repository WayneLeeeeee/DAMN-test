import React, { useEffect, useState } from "react";
import ButtonNav from "../../components/BottomNav";
import { Button, Search } from "semantic-ui-react";
import SearchIcon from "@mui/icons-material/Search";

//mui
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate, useSearchParams } from "react-router-dom";
import useSearch from "../../hooks/useSearch";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { useStateValue } from "../../StateProvider";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  where,
  query,
} from "firebase/firestore";
import { db } from "../../firebase";
import moment from "moment";
import {
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { actionTypes } from "../../reducer";
import { TextField } from "@material-ui/core";

function FridgePage() {
  //global state
  const [{ ingredient, category }, dispatch] = useStateValue();

  //返回
  const navigate = useNavigate();
  const goToFridgePage = function () {
    navigate("/fridge");
    dispatch({
      type: actionTypes.SET_CATEGORY,
      category: false,
    });
  };
  //使用者id
  const user = localStorage.getItem("userUid");

  const [query2, setQuery2] = useState("");
  // const results = useSearch("fridge", query2, `${user}`);
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("query");

  //刪除相關變數
  const [open, setOpen] = React.useState(false);
  const [deleted, setDeleted] = useState(0);
  const [recordId, setRecordId] = React.useState("");

  //修改相關變數
  const [open2, setOpen2] = React.useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  //普通讀取
  const [ingredient2, setIngredient2] = useState([]);

  //分類讀取
  const [ingredient3, setIngredient3] = useState([]);

  //autocomplete 的搜尋
  const [searchTerm, setSearchTerm] = useState("");
  const ingredientsData = useSearch("ingredients", searchTerm);
  const onSearchChange = (e) => setSearchTerm(e.target.value);

  //分類搜尋關鍵字
  const [name, setName] = useState("");

  function onResultSelect(e, { result }) {
    setSearchParams(query2);
    navigate(`/fridge/search/?query=${query2}`);
  }

  //關閉所有dialog
  const handleClose = () => {
    setOpen(false);
    setOpen2(false);
  };

  //開啟刪除dialog
  const handleClickOpen = (id) => {
    setOpen(true);
    setRecordId(id);
  };

  //開啟修改dialog
  const handleClickOpen2 = (data) => {
    setOpen2(true);
    setSelectedIngredient(data);
  };

  //跳轉至修改頁面
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
    navigate("/fridge/add");
  };

  //刪除食材
  const deleteData = async function (id) {
    try {
      await deleteDoc(doc(db, "users", `${user}`, "fridge", id));
      console.log(id);
      setOpen(false);
      setDeleted(deleted + 1);
    } catch (error) {
      console.log(error);
    }
  };

  //改變分類
  const handleChangeCategory = (value) => {
    setName(value);
    dispatch({
      type: actionTypes.SET_CATEGORY,
      category: true,
    });
  };

  useEffect(() => {
    async function readData() {
      //讀取冰箱食材
      const querySnapshot = await getDocs(
        collection(db, "users", `${user}`, "fridge")
      );
      const temp = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        temp.push({ id: doc.id, ...doc.data() });
      });
      console.log(temp);
      setIngredient2([...temp]);
    }
    readData();
  }, [db, deleted]);

  useEffect(() => {
    async function readDataCategory() {
      //讀取特定分類食材
      var categoryRef = collection(db, "users", `${user}`, "fridge");
      const q = query(categoryRef, where("category", "==", `${name}`));
      const querySnapshot2 = await getDocs(q);
      const temp2 = [];
      querySnapshot2.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        temp2.push(doc.data());
      });
      setIngredient3(...[temp2]);
    }
    readDataCategory();
  }, [name]);

  console.log(name);
  console.log(category);
  console.log("分類食材", ingredient3);

  return (
    <div>
      <div className="fridgePage">
        <div className="fridgePage__bar">
          <ArrowBackIosIcon onClick={goToFridgePage} />
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={ingredientsData}
            noOptionsText="沒有ㄝ~試試其他關鍵字吧！"
            getOptionLabel={(option) => option.category}
            sx={{ width: 300 }}
            onChange={(__, value) => handleChangeCategory(value.category)}
            onInputChange={onSearchChange}
            renderInput={(params) => <TextField {...params} label={"類別"} />}
          />
        </div>
        {category
          ? ingredient3?.map((item, index) => (
              <div className="fridgePage__item" key={index}>
                <div className="fridgePage__item__img">
                  <img src={item.imageURL?.url} alt="" />
                </div>
                <div className="fridgePage__item__content">
                  <h4>{item.name}</h4>
                  <h5>
                    數量：
                    {item.quantity}
                    {item.unit}
                  </h5>
                  <h5>{item.isFrozen}</h5>
                  <h5>
                    {moment(item.endDate.seconds * 1000).format("YYYY/MM/DD")}
                  </h5>
                  <h6>
                    距離到期日：剩
                    {-moment(new Date()).diff(
                      moment(item.endDate.seconds * 1000).format("YYYY/MM/DD"),
                      "days"
                    ) + 1}
                    日
                  </h6>
                </div>
                <div className="fridgePage__item__edit">
                  <CloseIcon onClick={() => handleClickOpen(item?.id)} />
                  <EditIcon onClick={() => handleClickOpen2(item)} />
                </div>
              </div>
            ))
          : ingredient2?.map((item, index) => (
              <div className="fridgePage__item" key={index}>
                <div className="fridgePage__item__img">
                  <img src={item.imageURL?.url} alt="" />
                </div>
                <div className="fridgePage__item__content">
                  <h4>{item.name}</h4>
                  <h5>
                    數量：
                    {item.quantity}
                    {item.unit}
                  </h5>
                  <h5>{item.isFrozen}</h5>
                  <h5>
                    {moment(item.endDate?.seconds * 1000).format("YYYY/MM/DD")}
                  </h5>
                  <h6>
                    距離到期日：剩
                    {-moment(new Date()).diff(
                      moment(item.endDate?.seconds * 1000).format("YYYY/MM/DD"),
                      "days"
                    ) + 1}
                    日
                  </h6>
                </div>
                <div className="fridgePage__item__edit">
                  <CloseIcon onClick={() => handleClickOpen(item?.id)} />
                  <EditIcon onClick={() => handleClickOpen2(item)} />
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

export default FridgePage;
