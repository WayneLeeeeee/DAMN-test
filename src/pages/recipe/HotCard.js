import React, { useEffect, useState } from "react";
// import stake from "../../images/stake.jpg";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, getDoc, deleteDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

function HotCard({ data }) {
  const userUid = localStorage.getItem("userUid");
  const recipesLikes = doc(db, "recipes", data.id);
  const [isLiked, setIsLiked] = useState(false);
  const [dataLikes, setDataLikes] = useState(data.likes);

  const handleLike = async () => {
    const docRef = doc(
      db,
      "users",
      `${userUid}`,
      "isLikedrecipes",
      `${data.id}`
    );
    const docSnap = await getDoc(docRef);
    //不存在代表沒案過讚
    if (!docSnap.exists()) {
      await updateDoc(recipesLikes, {
        likes: dataLikes + 1,
      });
      await setDoc(
        doc(db, "users", `${userUid}`, "isLikedrecipes", `${data.id}`),
        {
          recipe: `${data.name}`,
        }
      );
      setDataLikes(dataLikes + 1);
      setIsLiked(true);
    } else {
      await updateDoc(recipesLikes, {
        likes: dataLikes - 1,
      });
      await deleteDoc(
        doc(db, "users", `${userUid}`, "isLikedrecipes", `${data.id}`)
      );
      setDataLikes(dataLikes - 1);
      setIsLiked(false);
    }
  };

  //跳轉
  let navigate = useNavigate();
  const handleRouteToItemPage = () => {
    console.log(data);
    navigate(`/recipe/${data.id}`);
  };

  return (
    <div className="hotCard">
      <img
        className="hotCard__img"
        style={{
          maxWidth: "unset",
        }}
        src={data.thumbnail.url}
        alt=""
        onClick={handleRouteToItemPage}
      />
      <div>
        <div className="hotCard__content">
          <div className="hotCard__title">
            <h4>{data.name}</h4>
            <h4>{data.author}</h4>
          </div>
          <span></span>
          <div className="hotCard__items">
            <div className="hotCard__item">
              {isLiked ? (
                <ThumbUpIcon
                  sx={{ color: "#2D8DFF", paddingRight: "5px",cursor:"pointer"}}
                  onClick={handleLike}
                  link
                />
              ) : (
                <ThumbUpOffAltIcon
                  sx={{ color: "#2D8DFF", paddingRight: "5px",cursor:"pointer" }}
                  onClick={handleLike}
                />
              )}
              <h4>{dataLikes}</h4>
            </div>
            <div className="hotCard__item">
              <AccessTimeIcon sx={{ color: "#45BCFF", paddingRight: "5px" }} />
              <h4>{data.cookTime}</h4>
              <h5>min</h5>
            </div>
            <div className="hotCard__item">
              <StarIcon sx={{ color: "#FE645A", paddingRight: "5px" }} />
              <h4>{data.rating}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotCard;
