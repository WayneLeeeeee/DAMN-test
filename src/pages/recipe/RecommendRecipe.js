import React, { useEffect, useState } from "react";
import { collection, getDocs, limit, where } from "firebase/firestore";
import { db } from "../../firebase";
import { query, orderBy } from "firebase/firestore";
import RecommendCard from "./RecommendCard";

function RecommendRecipe() {
  const userId = localStorage.getItem("userUid");
  const [ingredient, setIngrendient] = useState([]);
  const [recommend, setRecommend] = useState([]);

  useEffect(() => {
    async function readData() {
      //找有的食材
      const querySnapshot = await getDocs(
        collection(db, "users", userId, "fridge")
      );
      const temp = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        temp.push(doc.data().name);
      });
      console.log(temp);
      setIngrendient(...[temp]);

      //找食材能做的食譜
      var ingredientRef = collection(db, "recipes");
      const q = query(
        ingredientRef,
        where("ingredientRecommendTags", "array-contains-any", ingredient),

      );
      const querySnapshot2 = await getDocs(q);
      const temp2 = [];
      querySnapshot2.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        temp2.push(doc.data());
      });
      setRecommend(...[temp2]);
    }
    readData();
  }, []);

  const newIngredient = [...ingredient]
  newIngredient.sort()

  console.log(newIngredient);
  console.log(recommend);

  return (
    <div>
      <div className="recommend__recipe">
        <div className="recipeItem__title">
          <h3>推薦食譜</h3>
        </div>
        {recommend?.map((item, id) => (
          <div className="recommendCard">
            <div className="recommendCard__img">
              <img key={id} src={item.thumbnail?.url} alt="xx" />
            </div>
            <div className="recommendCard__content">
              <h4>{item.name}</h4>
              <span>{item.ingredientRecommendTags}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecommendRecipe;
