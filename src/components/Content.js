import React, { useEffect, useState } from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { id } from "date-fns/locale";

export default function StandardImageList() {
  const user = localStorage.getItem("userUid");
  const [ingredient2, setIngredient2] = useState([]);
  console.log("ingredient2 ?????", ingredient2);
  const [useid, setUseid] = useState("");
  useEffect(() => {
    async function readData() {
      const querySnapshot = await getDocs(
        collection(db, "users", `${user}`, "isLikedrecipes")
      );
      const temp = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        temp.push({ id: doc.id, ...doc.data() });
      });
      console.log(temp);
      setIngredient2([...temp]);
    }

    readData();
  }, [db]);

  console.log("id => ", useid);

  let navigate = useNavigate();
  const handleToItemPage = (id) => {
    // setUseid(id)
    console.log(id);
    navigate(`/recipe/${id}`);
  };

  return (
    <ImageList
      sx={{ width: "100%", marginTop: "16px" }}
      cols={3}
      rowHeight={164}
    >
      {ingredient2.length === 0 ? (
        <p>您還未有按愛心的食譜</p>
      ) : (
        ingredient2?.map((item, index) => (
          <ImageListItem key={index}>
            <img
              src={item.image}
              alt={item.recipe}
              loading="lazy"
              onClick={() => handleToItemPage(item.id)}
            />
          </ImageListItem>
        ))
      )}
    </ImageList>
  );
}
