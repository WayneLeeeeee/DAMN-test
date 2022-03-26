import React from "react";
import hamburger from "../../images/hamburger.png";

function RecommendCard({recommend}) {
  return (
    <div className="recommendCard">
      <div className="recommendCard__img">
        <img src={hamburger} alt="" />
      </div>
      <div className="recommendCard__content">
        <h4>burger</h4>
        <span>good!</span>
      </div>
    </div>
  );
}

export default RecommendCard;
