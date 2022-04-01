import React from "react";
import ButtonNav from "../../components/BottomNav";
import fridgeIndex from "../../images/fridgeIndexBar.png";

import Ticker from "react-ticker";
import egg from "../../images/egg.jpg";

//mui icon
import KitchenIcon from "@mui/icons-material/Kitchen";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { useNavigate } from "react-router-dom";

function FridgeHomePage() {
  const navigate = useNavigate();

  const handleswitchtofridge = () => {
    navigate("/fridge/fridgePage");
  };

  const handleswitchtoadd = () => {
    navigate("/fridge/add");
  };

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
            <h4>40</h4>
            <h4>總數</h4>
          </div>
          <div className="fridge__index__displayQuantity__item">
            <h4>8</h4>
            <h4>即期</h4>
          </div>
          <div className="fridge__index__displayQuantity__item">
            <h4>5</h4>
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
          <div className="fridge__index__function__item">
            <ShoppingCartIcon />
            <h4>打開購物清單</h4>
          </div>
        </div>
        <div className="fridge__index__add" onClick={handleswitchtoadd}>
          <h4>新增</h4>
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
