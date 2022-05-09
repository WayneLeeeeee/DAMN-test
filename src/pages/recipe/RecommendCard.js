
import { Box } from "@material-ui/core";
import { Grid, Paper, Rating } from "@mui/material";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";

// import hamburger from "../../images/hamburger.png";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
function RecommendCard() {
  const userId = localStorage.getItem('userUid');
  const [ingredient, setIngrendient] = useState([]);
  const [recommend, setRecommend] = useState([]);
  const [champion, setChampion] = useState([]);

  useEffect(() => {
    async function readData() {
      //找有的食材
      const querySnapshot = await getDocs(
        collection(db, 'users', userId, 'fridge')
      );
      const temp = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.id, ' => ', doc.data());
        temp.push(doc.data().name);
      });
      // console.log(temp);
      setIngrendient(...[temp]);

      var result = ingredient.filter((item, index, arr) => {
        return arr.indexOf(item) === index;
      });

      console.log(result);

      //找食材能做的食譜
      const querySnapshot2 = await getDocs(collection(db, 'recipes'));
      const temp2 = [];
      querySnapshot2.forEach((doc) => {
        console.log(doc.id, '=>', doc.data().ingredientRecommendTags);
        const data = { ...doc.data(), id: doc.id };
        temp2.push([data, doc.data().ingredientRecommendTags, 0]);
      });
      console.log(temp2);
      setRecommend(...[temp2]);

      const temp3 = [];
      for (let i = 0; i <= temp2?.length - 1; i++) {
        for (let j = 0; j <= temp2[i][1]?.length - 1; j++) {
          console.log(temp2[i][1][j]?.name);
          if (result.indexOf(temp2[i][1][j]?.name)) {
            temp2[i][2] = temp2[i][2] + 1;
          }
          console.log(temp2[i]);
        }
        if (temp2[i][2] >= 2) {
          temp3.push(temp2[i][0]);
        }
      }
      console.log(temp3);

      setChampion(...[temp3]);
    }

    readData();
  }, []);

  let navigate = useNavigate();

  return (
    <Box className="recommendCardList" sx={{ flexGrow: 1, padding: "0 20px" }}>
      <Grid container spacing={2}>
        {champion.map((item, index) => (
          // need to check  RWD xs ={6} change to xs={12}
          <Grid item xs={12}>
            <Paper
              className="recommendCard__img"
              key={index}
              sx={{ display: "flex", padding: "10px" }}
              onClick={() => navigate(`/recipe/${item.id}`)}
            >
              <img src={item.thumbnail.url} alt="" />
              <div className="content">
                <h4>{item.name}</h4>
                <Rating value={4} readOnly />
              </div>
              {/* > btn */}
              <ArrowCircleRightOutlinedIcon className="ArrowCircleRightOutlinedIcon" />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default RecommendCard;
