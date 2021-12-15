import React, { useEffect, useState } from "react";
import Tabs from "./Tabs";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Box, ThemeProvider } from "@mui/system";
import { Paper } from "@mui/material";
import theme from "../../function/theme";
import ImageIcon from "@mui/icons-material/Image";
import ImageStepper from "../../components/ImageStepper";

function RecipeItem({ propsData }) {
  const [data, setData] = useState(null);
  let params = useParams();

  // fetch recipe detail data from fireStore
  const fetchData = async () => {
    const docRef = doc(db, "recipes", params.id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setData(docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  useEffect(() => {
    if (params.id) {
      // 如果有路徑帶 uid 就 fetchData
      fetchData();
      setData(null);
      return;
    } else {
      // 如果有 props 就設定 data 為傳入資料
      setData(propsData);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Paper
        elevation={3}
        className="recipeItem__container"
        sx={{ color: "text.normal" }}
      >
        <div className="recipeItem__wrap">
          {data?.thumbnail?.url && <ImageStepper data={data} />}
          {/* <div className="recipeItem__box">
            <h4>{data?.name ? data?.name : "沒有食譜名稱"}</h4>
          </div> */}
        </div>
        {/* 食材 或 步驟 選項 */}
        <Tabs data={data} />
      </Paper>
    </ThemeProvider>
  );
}

export default RecipeItem;
