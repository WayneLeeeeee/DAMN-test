import React from "react";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
//component
import BottomNav from "../../components/BottomNav";
import Ticker from "react-ticker";
import AddIcon from "@mui/icons-material/Add";
//跳轉頁面
import { useNavigate } from "react-router-dom";
import KitchenIcon from "@mui/icons-material/Kitchen";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import egg from "../../images/egg.jpg";
import AddCircleIcon from "@mui/icons-material/AddCircle";

export default function FridgePage() {
  const navigate = useNavigate();
  const goToShoppingListPage = function () {
    navigate("/fridge/shoppinglist");
  };
  const goToCreatShoppingListPage = function () {
    navigate("/fridge/creatshoppinglist");
  };
  const goToFridgeManagePage = function () {
    navigate("/fridge/fridgemanage");
  };

  return (
    <div className="fridgeIndex">
      <div className="fridgeIndex__container">
        <div className="fridgeIndex__slogan">
          <VolumeUpIcon />

          <Ticker mode="smooth">
            {() => (
              <>
                <h4>開啟智能語音讓你更快速解決問題 </h4>
              </>
            )}
          </Ticker>
        </div>
        <div className="fridgeIndex__overview">
          <div className="fridgeIndex__overviewItem" style={{ color: "green" }}>
            <h4>40</h4>
            <h4>總數量</h4>
          </div>
          <div
            className="fridgeIndex__overviewItem"
            style={{ color: "orange" }}
          >
            <h4>8</h4>
            <h4>即期</h4>
          </div>
          <div className="fridgeIndex__overviewItem" style={{ color: "red" }}>
            <h4>5</h4>
            <h4>過期</h4>
          </div>
        </div>
        <div className="fridgeIndex__main">
          <div className="fridgeIndex__button" onClick={goToFridgeManagePage}>
            <KitchenIcon />
            <h4>打開冰箱</h4>
          </div>
          <div className="fridgeIndex__button" onClick={goToShoppingListPage}>
            <ShoppingCartIcon />
            <h4>打開購物清單</h4>
          </div>
        </div>
        <div className="fridgeIndex__expiring__title">
          <h4>即期品專區!</h4>
        </div>
        <div className="fridgeIndex__expiring">
          <div className="fridgeIndex__expiring__img">
            <img src={egg} alt="" />
          </div>
          <div className="fridgeIndex__expiring__content">
            <h4>雞蛋</h4>
            <span>有3顆</span>
            <span>3天後即將過期</span>
          </div>
        </div>
        <div className="fridgeIndex__expiring__title">
          <h4>過期品專區!</h4>
        </div>
        <div className="fridgeIndex__expiring">
          <div className="fridgeIndex__expiring__img">
            <img src={egg} alt="" />
          </div>
          <div className="fridgeIndex__expiring__content">
            <h4>雞蛋</h4>
            <span>有3顆</span>
            <span>3天後即將過期</span>
          </div>
        </div>
        <div className="addingredient" onClick={goToCreatShoppingListPage}>
          <AddCircleIcon />
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
