import React, { useEffect, useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import HotCard from "./HotCard";
import RecommendCard from "./RecommendCard";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import ContributeRecipe from "../../components/recipe/ContributeRecipe";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import { useNavigate } from "react-router-dom";

function IndexMiddle() {
  const [hitoRecipes, setHitoRecipes] = useState([]);
  const query_hitoRecipes = query(
    collection(db, "recipes"),
    where("likes", ">=", 80)
  );

  let navigate = useNavigate();
  const handleRouteToItemPage = () => {
    navigate(`/recipe/recommend`);
  };

  const fetchHitoRecipes = async () => {
    const querySnapshot = await getDocs(query_hitoRecipes);
    querySnapshot.forEach((doc) => {
      const data = { ...doc.data(), id: doc.id };
      setHitoRecipes((oldData) => [...oldData, data]);
      console.log(data);
    });
  };
  //   console.log(hitoRecipes);
  useEffect(() => {
    fetchHitoRecipes();
  }, []);
  return (
    <div className="recipeIndexMiddle">
      <div className="recipeIndexMiddle__title">
        <h4>熱門討論</h4>
        <div className="recipeIndexMiddle__more">
          <span>更多</span>
          <ArrowForwardIosIcon />
        </div>
      </div>
      <div className="recipeIndexMiddle__cards">
        {hitoRecipes?.map((item) => (
          <HotCard key={item.id} data={item} />
        ))}
      </div>

      <ContributeRecipe />

      <div className="recipeIndexMiddle__title">
        <h4>新手上菜囉！</h4>
      </div>
      <div className="recipeIndexMiddle__cards-1">
        <RecommendCard />
        <RecommendCard />
      </div>

      <div
        className="recipeIndexMiddle__recommend__recipes-container"
        
      >
        <h5>推薦食譜</h5>
        <div className="recipeIndexMiddle__recommend__recipes" onClick={handleRouteToItemPage}>
          <TipsAndUpdatesIcon />
        </div>
      </div>
    </div>
  );
}

export default IndexMiddle;
