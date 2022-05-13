import React, { useEffect, useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import HotCard from "./HotCard";
import RecommendCard from "./RecommendCard";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import ContributeRecipe from "../../components/recipe/ContributeRecipe";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@mui/material";

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
        {/* <div className="recipeIndexMiddle__more">
          <span>更多</span>
          <ArrowForwardIosIcon />
        </div> */}
      </div>
      <div className="recipeIndexMiddle__cards">
        {hitoRecipes?.map((item) => (
          <HotCard key={item.id} data={item} />
        ))}
        {hitoRecipes.length === 0 &&
          [...new Array(3)].map((item) => (
            <div className="hotCard">
              <Skeleton
                sx={{ width: 280, height: 240, borderRadius: 5 }}
                animation="wave"
                variant="rectangular"
              />
              <Skeleton
                className="hotCard__content"
                variant="rectangular"
                sx={{ width: 215, height: 80 }}
              />
            </div>
          ))}
      </div>

      <ContributeRecipe />

      <div className="recipeIndexMiddle__title">
        <h4>推薦食譜</h4>
      </div>
      <div className="recipeIndexMiddle__cards-1">
        <RecommendCard />
      </div>
    </div>
  );
}

export default IndexMiddle;
