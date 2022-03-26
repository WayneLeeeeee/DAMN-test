import React, { useEffect, useState } from "react";
import { collection, getDocs, limit, where } from "firebase/firestore";
import { db } from "../../firebase";
import { query, orderBy } from "firebase/firestore";
import RecommendCard from "./RecommendCard";
import RecommendIcon from "@mui/icons-material/Recommend";

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
        where("ingredientRecommendTags", "array-contains-any", temp)
      );
      const querySnapshot2 = await getDocs(q);
      const temp2 = [];
      querySnapshot2.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        temp2.push(doc.data());
      });
      setRecommend(...[temp2]);
    }
    console.log(ingredient);

    readData();
  }, []);

  const [champion, setChampion] = useState([]);
  //找重複的
  const getduplication = () => {
    const newRecommend = [];
    recommend.map((item) =>
      newRecommend.push(...[item.ingredientRecommendTags])
    );

    var duplicationLength = [[]];

    duplicationLength.sort();

    for (let i = 0; i <= recommend?.length - 1; i++) {
      var z = newRecommend[i].filter(function (val) {
        return ingredient.indexOf(val) !== -1;
      });
      console.log(z);
      if (Array.isArray(duplicationLength[i])) {
        duplicationLength[i][0] = z.length;
        duplicationLength[i][1] = recommend[i].name;
        duplicationLength[i][2] = recommend[i].thumbnail.url;
        duplicationLength[i][3] = recommend[i].ingredientRecommendTags;
      } else {
        duplicationLength[i] = [
          z.length,
          recommend[i].name,
          recommend[i].thumbnail.url,
          recommend[i].ingredientRecommendTags,
        ];
        // duplicationLength[i] = [];
      }

      // console.log(recommend.length);
      console.log("二維 => ", duplicationLength.sort());
      setChampion(duplicationLength[duplicationLength.length - 1]);
      console.log("冠軍=>", duplicationLength[duplicationLength.length - 1]);
    }
  };

  console.log(recommend);

  return (
    <div>
      <div className="recommend__recipe">
        <div className="recipeItem__title">
          <h3>推薦您：{champion[1]}</h3>
        </div>
        <h3 style={{ paddingLeft: "10px" }}>點選進入料理</h3>
        {/* <div className="recommendCard">
          <div className="recommendCard__img">
            <img src={champion[2]} alt="" />
          </div>
          <div className="recommendCard__content">
            <h4>{champion[1]}</h4>
            <span>{champion[3]}</span>
          </div>
        </div> */}
        <RecommendIcon
          onClick={getduplication}
          sx={{ color: "#FE8B83", fontSize: "72px" }}
        />
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
