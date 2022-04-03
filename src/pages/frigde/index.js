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
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

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
  const [ingredient2, setIngredient2] = useState([]);
  const [expire, setExpire] = useState(0);
  const [expired, setExpired] = useState(0);

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
    }
    readData();
  }, [db]);

  useEffect(() => {
    for (var i = 0; i < ingredient2.length; i++) {
      if (
        -1 <
        -moment(new Date()).diff(
          moment(ingredient2[i].endDate.seconds * 1000).format("YYYY/MM/DD"),
          "days"
        ) +
          1 <
        4
      ) {
        setExpire(+1);
      }
      if (
        -moment(new Date()).diff(
          moment(ingredient2[i].endDate.seconds * 1000).format("YYYY/MM/DD"),
          "days"
        ) +
          1 <
        0
      ) {
        setExpired(+1);
      }
    }
  });

  console.log("過期", expired);
  console.log("即期", expire);

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
            <h4>{ingredient2.length}</h4>
            <h4>總數</h4>
          </div>
          <div className="fridge__index__displayQuantity__item">
            <h4>{expire}</h4>
            <h4>即期</h4>
          </div>
          <div className="fridge__index__displayQuantity__item">
            <h4>{expired}</h4>
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
        <div className="fridge__index__expired">
          <h4>即期品</h4>
          <div className="div">
            <div className="fridge__index__expired__img">
              <img src={egg} alt="" />
            </div>
            <div className="fridge__index__expired__content">
              <h4>雞蛋</h4>
              <h5>3個</h5>
              <h5>2021/04/01 剩3天</h5>
            </div>
          </div>
        </div>
        <div className="fridge__index__expired">
          <h4>過期品</h4>
          <div className="div">
            <div className="fridge__index__expired__img">
              <img src={egg} alt="" />
            </div>
            <div className="fridge__index__expired__content">
              <h4>雞蛋</h4>
              <h5>3個</h5>
              <h5>2021/04/01</h5>
            </div>
          </div>
        </div>
      </div>
      <ButtonNav />
    </div>
  );
}

export default FridgeHomePage;
