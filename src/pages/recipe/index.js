import React from "react";
import IndexTop from "./IndexTop";
import IndexMiddle from "./IndexMiddle";
import RecipeItemPage from "./RecipeItemPage";
import BottomNav from "../../components/BottomNav";

function index() {
  return (
    <div className="recipe__index">
      {/* <RecipeItemPage /> */}
      <IndexTop />

      <IndexMiddle />

      <BottomNav />
    </div>
  );
}

export default index;
