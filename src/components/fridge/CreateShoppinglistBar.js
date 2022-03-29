import React from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import IconButton from "@mui/material/IconButton";

//跳轉頁面
import { useNavigate } from "react-router-dom";

function TopBar() {
  const navigate = useNavigate();
  const goToFridgePage = function () {
    navigate("/fridge");
  };

  return (
    <div className="topBar" style={{ position: "relative" }}>
      <div
        className="topBar__container"
        style={{
          display: "flex",
          padding: "50px",
          alignItems: "center",
          fontSize: "28px",
        }}
      >
        <KeyboardArrowLeftIcon
          onClick={goToFridgePage}
          sx={{ fontSize: "36px", position: "absolute", left: "-40px" }}
        />
        <p>新增購物清單</p>
      </div>
    </div>
  );
}

export default TopBar;
