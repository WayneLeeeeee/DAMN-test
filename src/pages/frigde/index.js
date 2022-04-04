import React, { useEffect, useState } from "react";
import ButtonNav from "../../components/BottomNav";
import fridgeIndex from "../../images/fridgeIndexBar.png";

import Ticker from "react-ticker";
import egg from "../../images/egg.jpg";
import moment from "moment";

//mui icon
import KitchenIcon from "@mui/icons-material/Kitchen";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { Autocomplete } from "@mui/material";
import useSearch from "../../hooks/useSearch";
import { TextField } from "@material-ui/core";
import { useStateValue } from "../../StateProvider";
import { actionTypes } from "../../reducer";
import { orderBy } from "lodash";

function FridgeHomePage() {
  const navigate = useNavigate();

  const handleswitchtofridge = () => {
    navigate("/fridge/fridgePage");
  };

  const handleswitchtoshoppingList = () => {
    navigate("/fridge/shoppingListPage");
  };

  const handleswitchtoadd = () => {
    navigate("/fridge/add");
  };

  const handleswitchtoadd2 = () => {
    navigate("/fridge/add2");
  };

  const user = localStorage.getItem("userUid");

  //一般讀取
  const [ingredient2, setIngredient2] = useState([]);

  //即期品
  const [expireData, setExpireData] = useState([]);

  //過期品
  const [expiredData, setExpiredData] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const ingredientsData2 = useSearch("ingredients", searchTerm);
  const onSearchChange = (e) => setSearchTerm(e.target.value);
  const [name, setName] = useState("");
  const [{ total }, dispatch] = useStateValue();

  const handleChangeName = (value) => {
    setName(value);
  };

  useEffect(() => {
    async function readData() {
      const querySnapshot = await getDocs(
        collection(db, "users", `${user}`, "fridge")
      );
      const temp = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        temp.push({ id: doc.id, ...doc.data() });
      });
      console.log(temp);
      setIngredient2([...temp]);

      const temp2 = [];
      const temp3 = [];
      for (var i = 0; i < temp.length; i++) {
        const data =
          -moment(new Date()).diff(
            moment(temp[i].endDate.seconds * 1000).format("YYYY/MM/DD"),
            "days"
          ) + 1;
        if (data < 0) {
          console.log("過期", data);
          temp3.push(temp[i]);
        }
        if (data < 4 && data > 0) {
          console.log("即期", data);
          temp2.push(temp[i]);
        }
      }
      setExpireData([...temp2]);
      setExpiredData([...temp3]);
    }
    readData();
  }, [db]);

  useEffect(() => {
    function readDataQ() {}
    readDataQ();
  });

  useEffect(() => {
    async function readDataCategory() {
      //讀取特定分類食材
      var categoryRef = collection(db, "users", `${user}`, "fridge");
      const q = query(categoryRef, where("name", "==", `${name}`));
      const querySnapshot2 = await getDocs(q);
      const temp2 = [];
      querySnapshot2.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        temp2.push(doc.data());
      });
      dispatch({
        type: actionTypes.SET_TOTAL,
        total: [...temp2],
      });
    }
    readDataCategory();
  }, [name]);

  console.log(total);

  return (
    <div>
      <div className="fridge__index">
        <div className="fridge__index__slogan">
          <VolumeUpIcon />

          <Ticker mode="smooth">
            {() => (
              <>
                <h4>開啟智能語音讓你更快速解決問題 </h4>
              </>
            )}
          </Ticker>
        </div>
        <div className="fridge__index__displayQuantity">
          <div className="fridge__index__displayQuantity__item">
            <h4 style={{ color: "green" }}>{ingredient2.length}</h4>
            <h4>總數</h4>
          </div>
          <div className="fridge__index__displayQuantity__item">
            <h4 style={{ color: "orange" }}>{expireData.length}</h4>
            <h4>即期</h4>
          </div>
          <div className="fridge__index__displayQuantity__item">
            <h4 style={{ color: "red" }}>{expiredData.length}</h4>
            <h4>過期</h4>
          </div>
        </div>
        <div className="fridge__index__img">
          {/* <img src={fridgeIndex} alt="" /> */}
        </div>

        <div className="fridge__index__function">
          <div
            className="fridge__index__function__item"
            onClick={handleswitchtofridge}
          >
            <KitchenIcon />
            <h4>打開冰箱</h4>
          </div>
          <div
            className="fridge__index__function__item"
            onClick={handleswitchtoshoppingList}
          >
            <ShoppingCartIcon />
            <h4>打開購物清單</h4>
          </div>
        </div>
        <div className="fridge__index__add" onClick={handleswitchtoadd}>
          <h4>新增冰箱食材</h4>
          <AddCircleOutlineIcon />
        </div>
        <div className="fridge__index__add" onClick={handleswitchtoadd2}>
          <h4>新增購物清單</h4>
          <AddCircleOutlineIcon />
        </div>
        <div className="fridge__index__history">
          <h4>歷史紀錄查詢</h4>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={ingredientsData2}
            noOptionsText="沒有ㄝ~試試其他關鍵字吧！"
            getOptionLabel={(option) => option.name}
            sx={{ width: 300, padding: "10px" }}
            onChange={(__, value) => handleChangeName(value.name)}
            onInputChange={onSearchChange}
            renderInput={(params) => <TextField {...params} label={"名稱"} />}
          />
        </div>
        <div className="fridge__index__history__datas">
          {total.map((item) => (
            <div className="fridge__index__history__data">
              <img src={item?.imageURL?.url} alt="" />
              <h4>{item.name}</h4>
              <h4>
                {item.quantity}
                {item.unit}
              </h4>
              <h4>
                ~{moment(item.endDate.seconds * 1000).format("YYYY/MM/DD")}
              </h4>
            </div>
          ))}
        </div>
      </div>
      <ButtonNav />
    </div>
  );
}

export default FridgeHomePage;
